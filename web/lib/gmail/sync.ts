import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';
import { getAuthenticatedClient } from './client';
import { parseGmailMessage } from './parse';
import { gmailHtmlToText } from './html-to-text';
import { ingestEmail } from '@/lib/ingest';

const MIN_CONFIDENCE = 0.2;

export interface SyncResult {
  ingested: number;
  skipped: number;
  filtered: number;
  errors: number;
  total: number;
}

/**
 * Sync Gmail messages for a user.
 * Fetches recent messages, deduplicates, classifies, and ingests.
 * Only ingests emails with classifier confidence >= MIN_CONFIDENCE.
 */
export async function syncGmailMessages(userId: string): Promise<SyncResult> {
  const client = await getAuthenticatedClient(userId);
  const gmail = google.gmail({ version: 'v1', auth: client });

  const maxResults = parseInt(process.env.GMAIL_SYNC_MAX_RESULTS || '50', 10);
  const query = process.env.GMAIL_SYNC_QUERY || 'newer_than:7d';

  // 1. List messages
  const listResponse = await gmail.users.messages.list({
    userId: 'me',
    q: query,
    maxResults,
  });

  const messageRefs = listResponse.data.messages || [];
  let ingested = 0;
  let skipped = 0;
  let filtered = 0;
  let errors = 0;

  // 2. Process each message
  for (const ref of messageRefs) {
    const gmailMessageId = ref.id;
    if (!gmailMessageId) continue;

    try {
      // Check dedup: skip if already ingested
      const existing = await prisma.emailMessage.findUnique({
        where: { gmailMessageId },
      });
      if (existing) {
        skipped++;
        continue;
      }

      // Fetch full message
      const msgResponse = await gmail.users.messages.get({
        userId: 'me',
        id: gmailMessageId,
        format: 'full',
      });

      const parsed = parseGmailMessage(msgResponse.data);

      // Get body: prefer plain text, fall back to HTML conversion
      const body = parsed.bodyText || (parsed.bodyHtml ? gmailHtmlToText(parsed.bodyHtml) : '');

      if (!body && !parsed.subject) {
        skipped++;
        continue;
      }

      // Ingest through the shared pipeline with confidence threshold
      const result = await ingestEmail(
        {
          subject: parsed.subject,
          body: body || parsed.subject,
          sender: parsed.sender,
          userId,
          gmailMessageId: parsed.gmailMessageId,
          gmailThreadId: parsed.gmailThreadId,
        },
        { minConfidence: MIN_CONFIDENCE }
      );

      if ('skippedReason' in result) {
        filtered++;
      } else {
        ingested++;
      }
    } catch (err) {
      console.error(`Failed to process Gmail message ${gmailMessageId}:`, err);
      errors++;
    }
  }

  // 3. Update last sync time
  await prisma.gmailAccount.update({
    where: { userId },
    data: { lastSyncAt: new Date() },
  });

  return { ingested, skipped, filtered, errors, total: messageRefs.length };
}
