import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';

export function createOAuth2Client() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

/**
 * Generate the Google OAuth consent URL.
 * Uses offline access to get a refresh token + forces consent to ensure it's returned.
 */
export function getAuthUrl(): string {
  const client = createOAuth2Client();
  return client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
}

/**
 * Get an authenticated OAuth2 client for a user.
 * Automatically refreshes the token if expired or about to expire.
 */
export async function getAuthenticatedClient(userId: string) {
  const gmailAccount = await prisma.gmailAccount.findUnique({
    where: { userId },
  });

  if (!gmailAccount) {
    throw new Error('Gmail not connected. Please connect your Gmail account first.');
  }

  const client = createOAuth2Client();
  client.setCredentials({
    access_token: gmailAccount.accessToken,
    refresh_token: gmailAccount.refreshToken,
  });

  // Refresh if token expires within 5 minutes
  const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
  if (gmailAccount.tokenExpiry < fiveMinutesFromNow) {
    const { credentials } = await client.refreshAccessToken();

    await prisma.gmailAccount.update({
      where: { id: gmailAccount.id },
      data: {
        accessToken: credentials.access_token!,
        tokenExpiry: new Date(credentials.expiry_date!),
        ...(credentials.refresh_token
          ? { refreshToken: credentials.refresh_token }
          : {}),
      },
    });

    client.setCredentials(credentials);
  }

  return client;
}
