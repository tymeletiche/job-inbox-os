import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { EventStatus, EventType, Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = (searchParams.get('status') as EventStatus) || 'PENDING';
    const search = searchParams.get('search') || '';
    const type = searchParams.get('type') as EventType | null;
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '20')));

    if (!['PENDING', 'CONFIRMED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be PENDING, CONFIRMED, or REJECTED' },
        { status: 400 }
      );
    }

    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const where: Prisma.JobEventWhereInput = {
      userId,
      status,
      ...(type ? { type } : {}),
      ...(search
        ? {
            job: {
              OR: [
                { company: { contains: search, mode: 'insensitive' } },
                { position: { contains: search, mode: 'insensitive' } },
              ],
            },
          }
        : {}),
    };

    const [events, total] = await Promise.all([
      prisma.jobEvent.findMany({
        where,
        include: { job: true, emailMessage: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.jobEvent.count({ where }),
    ]);

    return NextResponse.json({
      events,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Review fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
