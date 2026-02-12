import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = (searchParams.get('status') as EventStatus) || 'PENDING';

    // Validate status
    if (!['PENDING', 'CONFIRMED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PENDING, CONFIRMED, or REJECTED' },
        { status: 400 }
      );
    }

    // Get dev user ID from env
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const events = await prisma.jobEvent.findMany({
      where: {
        userId,
        status,
      },
      include: {
        job: true,
        emailMessage: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Review fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
