import { prisma } from '@/lib/prisma';
import { classifyEmail, ClassifierOutput } from '@/lib/classifier';
import { EventType as PrismaEventType, Prisma } from '@prisma/client';

export interface IngestEmailInput {
  subject: string;
  body: string;
  sender: string;
  userId: string;
  gmailMessageId?: string;
  gmailThreadId?: string;
}

export interface IngestResult {
  jobEvent: {
    id: string;
    type: PrismaEventType;
    status: string;
    job: { id: string; company: string; position: string };
  };
  groupId: string;
  classification: ClassifierOutput;
}

function normalizeCompanyKey(company: string | undefined): string | null {
  if (!company || company === 'Unknown Company') return null;
  return company.toLowerCase().trim();
}

export async function ingestEmail(input: IngestEmailInput): Promise<IngestResult> {
  const { subject, body, sender, userId, gmailMessageId, gmailThreadId } = input;

  // 1. Classify
  const classification = classifyEmail({ subject, body, sender });

  const company = classification.extractedData.company || 'Unknown Company';
  const position = classification.extractedData.position || 'Unknown Position';
  const companyKey = normalizeCompanyKey(classification.extractedData.company);
  const eventType = classification.eventType as PrismaEventType;

  // Truncate body for storage (full body goes in rawHeaders)
  const bodyForStorage = body.length > 5000 ? body.slice(0, 5000) : body;
  const rawHeaders: Record<string, unknown> = {};
  if (body.length > 5000) {
    rawHeaders.fullBody = body;
  }
  if (gmailMessageId) rawHeaders.gmailMessageId = gmailMessageId;
  if (gmailThreadId) rawHeaders.gmailThreadId = gmailThreadId;

  // 2-6. All DB operations in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // 2. Find or create EmailGroup
    let group;
    let isNewGroup = false;

    if (gmailThreadId) {
      // Gmail path: group by thread
      group = await tx.emailGroup.findUnique({
        where: { userId_gmailThreadId: { userId, gmailThreadId } },
      });
      if (!group) {
        group = await tx.emailGroup.create({
          data: {
            userId,
            gmailThreadId,
            companyKey,
            latestEventType: eventType,
          },
        });
        isNewGroup = true;
      }
    } else if (companyKey) {
      // Mock path: group by company
      group = await tx.emailGroup.findFirst({
        where: { userId, companyKey, gmailThreadId: null },
      });
      if (!group) {
        group = await tx.emailGroup.create({
          data: {
            userId,
            companyKey,
            latestEventType: eventType,
          },
        });
        isNewGroup = true;
      }
    } else {
      // No grouping key: standalone group
      group = await tx.emailGroup.create({
        data: {
          userId,
          latestEventType: eventType,
        },
      });
      isNewGroup = true;
    }

    // 3. Create EmailMessage linked to group
    const emailMessage = await tx.emailMessage.create({
      data: {
        subject,
        body: bodyForStorage,
        sender,
        gmailMessageId: gmailMessageId || null,
        gmailThreadId: gmailThreadId || null,
        groupId: group.id,
        rawHeaders: Object.keys(rawHeaders).length > 0 ? (rawHeaders as Prisma.InputJsonValue) : undefined,
      },
    });

    // 4. Find or create Job
    let job;
    if (group.jobId) {
      // Group already linked to a Job — reuse it
      job = await tx.job.findUniqueOrThrow({ where: { id: group.jobId } });
    } else {
      // Upsert Job by company+position
      job = await tx.job.upsert({
        where: { userId_company_position: { userId, company, position } },
        update: {},
        create: { userId, company, position },
      });
      // Link group to job
      await tx.emailGroup.update({
        where: { id: group.id },
        data: { jobId: job.id },
      });
    }

    // 5. Create JobEvent
    const jobEvent = await tx.jobEvent.create({
      data: {
        jobId: job.id,
        userId,
        emailMessageId: emailMessage.id,
        type: eventType,
        extractedData: classification.extractedData as unknown as Prisma.InputJsonValue,
        rawData: {
          matches: classification.rawMatches,
          confidence: classification.confidence,
          source: gmailMessageId ? 'gmail' : 'mock',
        },
      },
    });

    // 6. Update group metadata (skip increment for newly created groups — they start at 1)
    if (!isNewGroup) {
      await tx.emailGroup.update({
        where: { id: group.id },
        data: {
          emailCount: { increment: 1 },
          latestEventType: eventType,
          lastEmailAt: new Date(),
          ...(companyKey && !group.companyKey ? { companyKey } : {}),
        },
      });
    }

    return { jobEvent, job, groupId: group.id };
  });

  return {
    jobEvent: {
      id: result.jobEvent.id,
      type: result.jobEvent.type,
      status: result.jobEvent.status,
      job: {
        id: result.job.id,
        company: result.job.company,
        position: result.job.position,
      },
    },
    groupId: result.groupId,
    classification,
  };
}
