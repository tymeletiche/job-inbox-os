import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const userId = process.env.DEV_USER_ID;
    if (!userId) {
      throw new Error('DEV_USER_ID environment variable not set');
    }

    const gmailAccount = await prisma.gmailAccount.findUnique({
      where: { userId },
      select: {
        gmailEmail: true,
        lastSyncAt: true,
        createdAt: true,
      },
    });

    if (!gmailAccount) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      email: gmailAccount.gmailEmail,
      lastSyncAt: gmailAccount.lastSyncAt,
      connectedAt: gmailAccount.createdAt,
    });
  } catch (error) {
    console.error('Gmail status error:', error);
    return NextResponse.json(
      { error: 'Failed to check Gmail status' },
      { status: 500 }
    );
  }
}
