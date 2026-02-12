import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { eventId, action } = await request.json();

    if (!eventId || !action) {
      return NextResponse.json(
        { error: 'Missing required fields: eventId, action' },
        { status: 400 }
      );
    }

    if (!['CONFIRM', 'REJECT'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be CONFIRM or REJECT' },
        { status: 400 }
      );
    }

    const jobEvent = await prisma.jobEvent.update({
      where: { id: eventId },
      data: {
        status: action === 'CONFIRM' ? 'CONFIRMED' : 'REJECTED',
        confirmedAt: action === 'CONFIRM' ? new Date() : null,
        rejectedAt: action === 'REJECT' ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, jobEvent });
  } catch (error) {
    console.error('Confirm error:', error);
    return NextResponse.json(
      { error: 'Failed to update event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
