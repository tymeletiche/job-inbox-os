import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const [pendingEvents, confirmedEvents, rejectedEvents, totalJobs, eventsByType, recentEvents] =
      await Promise.all([
        prisma.jobEvent.count({ where: { userId, status: 'PENDING' } }),
        prisma.jobEvent.count({ where: { userId, status: 'CONFIRMED' } }),
        prisma.jobEvent.count({ where: { userId, status: 'REJECTED' } }),
        prisma.job.count({ where: { userId } }),
        prisma.jobEvent.groupBy({
          by: ['type'],
          where: { userId },
          _count: { type: true },
        }),
        prisma.jobEvent.findMany({
          where: { userId },
          include: { job: true, emailMessage: true },
          orderBy: { createdAt: 'desc' },
          take: 5,
        }),
      ]);

    const typeCountMap = Object.fromEntries(
      eventsByType.map((e) => [e.type, e._count.type])
    );

    return NextResponse.json({
      pendingEvents,
      confirmedEvents,
      rejectedEvents,
      totalJobs,
      eventsByType: typeCountMap,
      recentEvents,
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
