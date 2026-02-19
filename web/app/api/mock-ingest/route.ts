import { NextRequest, NextResponse } from 'next/server';
import { ingestEmail } from '@/lib/ingest';

export async function POST(request: NextRequest) {
  try {
    const { subject, body, sender } = await request.json();

    if (!subject || !body || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields: subject, body, sender' },
        { status: 400 }
      );
    }

    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const result = await ingestEmail({ subject, body, sender, userId });

    return NextResponse.json({ success: true, jobEvent: result.jobEvent });
  } catch (error) {
    console.error('Mock ingest error:', error);
    return NextResponse.json(
      { error: 'Failed to ingest email', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
