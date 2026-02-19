import type { gmail_v1 } from 'googleapis';

export interface ParsedGmailMessage {
  subject: string;
  sender: string;
  bodyText: string | null;
  bodyHtml: string | null;
  gmailMessageId: string;
  gmailThreadId: string;
  receivedAt: Date;
}

/**
 * Extract bare email from a From header like "John Doe <john@company.com>"
 */
export function parseFromHeader(from: string): string {
  const match = from.match(/<([^>]+)>/);
  if (match) return match[1];
  // Already a bare email
  if (from.includes('@')) return from.trim();
  return from;
}

/**
 * Recursively walk MIME parts to find text/plain and text/html bodies.
 * Gmail stores body data as base64url-encoded strings.
 */
function extractBodies(part: gmail_v1.Schema$MessagePart): {
  text: string | null;
  html: string | null;
} {
  let text: string | null = null;
  let html: string | null = null;

  if (part.mimeType === 'text/plain' && part.body?.data) {
    text = Buffer.from(part.body.data, 'base64url').toString('utf-8');
  }

  if (part.mimeType === 'text/html' && part.body?.data) {
    html = Buffer.from(part.body.data, 'base64url').toString('utf-8');
  }

  if (part.parts) {
    for (const child of part.parts) {
      const childResult = extractBodies(child);
      if (childResult.text && !text) text = childResult.text;
      if (childResult.html && !html) html = childResult.html;
    }
  }

  return { text, html };
}

/**
 * Get a header value from a Gmail message payload, case-insensitive.
 */
function getHeader(
  headers: gmail_v1.Schema$MessagePartHeader[] | undefined,
  name: string
): string {
  if (!headers) return '';
  const header = headers.find(
    (h) => h.name?.toLowerCase() === name.toLowerCase()
  );
  return header?.value || '';
}

/**
 * Parse a Gmail API message into a structured format for the classifier.
 */
export function parseGmailMessage(
  message: gmail_v1.Schema$Message
): ParsedGmailMessage {
  const payload = message.payload;
  if (!payload) {
    throw new Error(`Gmail message ${message.id} has no payload`);
  }

  const subject = getHeader(payload.headers, 'Subject');
  const fromRaw = getHeader(payload.headers, 'From');
  const sender = parseFromHeader(fromRaw);
  const dateHeader = getHeader(payload.headers, 'Date');

  // Extract text and HTML bodies
  const { text, html } = extractBodies(payload);

  return {
    subject,
    sender,
    bodyText: text,
    bodyHtml: html,
    gmailMessageId: message.id || '',
    gmailThreadId: message.threadId || '',
    receivedAt: dateHeader ? new Date(dateHeader) : new Date(),
  };
}
