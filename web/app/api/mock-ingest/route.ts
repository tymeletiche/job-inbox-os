import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { classifyEmail } from '@/lib/classifier';

export async function POST(request: NextRequest) {
  try {
    const { subject, body, sender } = await request.json();

    if (!subject || !body || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, body, sender' },
        { status: 400 }
      );
    }

    // Classify email
    const classification = classifyEmail({ subject, body, sender });

    // Create email message
    const emailMessage = await prisma.emailMessage.create({
      data: { subject, body, sender },
    });

    // Extract or default company/position
    const company = classification.extractedData.company || 'Unknown Company';
    const position = classification.extractedData.position || 'Unknown Position';

    // Get dev user ID from env
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    // Find or create job
    const job = await prisma.job.upsert({
      where: {
        userId_company_position: {
          userId,
          company,
          position,
        },
      },
      update: {},
      create: {
        userId,
        company,
        position,
      },
    });

    // Create job event
    const jobEvent = await prisma.jobEvent.create({
      data: {
        jobId: job.id,
        userId,
        emailMessageId: emailMessage.id,
        type: classification.eventType,
        extractedData: classification.extractedData,
        rawData: {
          matches: classification.rawMatches,
          confidence: classification.confidence,
        },
      },
      include: { job: true },
    });

    return NextResponse.json({ success: true, jobEvent });
  } catch (error) {
    console.error('Mock ingest error:', error);
    return NextResponse.json(
      { error: 'Failed to ingest email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
