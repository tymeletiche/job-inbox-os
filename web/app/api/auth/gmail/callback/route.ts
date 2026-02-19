import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createOAuth2Client } from '@/lib/gmail/client';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const error = request.nextUrl.searchParams.get('error');

    if (error) {
      console.error('Gmail OAuth error:', error);
      return NextResponse.redirect(new URL('/?gmail_error=auth_denied', request.url));
    }

    if (!code) {
      return NextResponse.redirect(new URL('/?gmail_error=no_code', request.url));
    }

    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const client = createOAuth2Client();
    const { tokens } = await client.getToken(code);

    if (!tokens.access_token) {
      throw new Error('No access token received from Google');
    }

    // Get the user's Gmail email address
    client.setCredentials(tokens);
    const gmail = google.gmail({ version: 'v1', auth: client });
    const profile = await gmail.users.getProfile({ userId: 'me' });

    const gmailEmail = profile.data.emailAddress;
    if (!gmailEmail) {
      throw new Error('Could not retrieve Gmail email address');
    }

    // Check for existing account to preserve refresh token if new one not provided
    const existing = await prisma.gmailAccount.findUnique({ where: { userId } });
    const refreshToken = tokens.refresh_token || existing?.refreshToken;

    if (!refreshToken) {
      // No refresh token from Google and none stored — force re-auth
      return NextResponse.redirect(new URL('/?gmail_error=no_refresh_token', request.url));
    }

    // Upsert GmailAccount
    await prisma.gmailAccount.upsert({
      where: { userId },
      update: {
        gmailEmail,
        accessToken: tokens.access_token,
        refreshToken,
        tokenExpiry: new Date(tokens.expiry_date || Date.now() + 3600 * 1000),
      },
      create: {
        userId,
        gmailEmail,
        accessToken: tokens.access_token,
        refreshToken,
        tokenExpiry: new Date(tokens.expiry_date || Date.now() + 3600 * 1000),
      },
    });

    return NextResponse.redirect(new URL('/?gmail_connected=true', request.url));
  } catch (error) {
    console.error('Gmail callback error:', error);
    return NextResponse.redirect(new URL('/?gmail_error=callback_failed', request.url));
  }
}
