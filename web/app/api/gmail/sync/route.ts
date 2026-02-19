import { NextResponse } from 'next/server';
import { syncGmailMessages } from '@/lib/gmail/sync';

export async function POST() {
  try {
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const result = await syncGmailMessages(userId);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('Gmail sync error:', error);

    const message = error instanceof Error ? error.message : 'Unknown error';

    // Surface reconnection hint for auth errors
    if (message.includes('not connected') || message.includes('refresh')) {
      return NextResponse.json(
        { error: 'Gmail authentication expired. Please reconnect your Gmail account.', details: message },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to sync Gmail', details: message },
      { status: 500 }
    );
  }
}
