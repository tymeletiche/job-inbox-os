import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const jobs = await prisma.job.findMany({
      where: { userId },
      include: {
        _count: { select: { events: true } },
        events: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { type: true, status: true, createdAt: true },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
