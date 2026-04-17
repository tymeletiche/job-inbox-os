import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const job = await prisma.job.findFirst({
      where: { id, userId },
      include: {
        events: {
          include: { emailMessage: true },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    console.error('Job detail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
