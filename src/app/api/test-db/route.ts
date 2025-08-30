import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    // Test database connection with Prisma
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;

    return NextResponse.json({
      message: 'Database connection successful!',
      data: result,
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json(
      {
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
