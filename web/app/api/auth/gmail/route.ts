import { NextResponse } from 'next/server';
import { getAuthUrl } from '@/lib/gmail/client';

export async function GET() {
  try {
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      return NextResponse.json(
        { error: 'Google OAuth credentials not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env' },
        { status: 500 }
      );
    }

    const url = getAuthUrl();
    return NextResponse.redirect(url);
  } catch (error) {
    console.error('Gmail auth error:', error);
    return NextResponse.json(
      { error: 'Failed to start Gmail authentication' },
      { status: 500 }
    );
  }
}
