import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Logger } from '@/lib/logger';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Check DB connection
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: {
          status: 'connected',
          latency: `${latency}ms`
        },
        redis: {
          status: 'ready_for_connect',
          message: 'Using CacheService memory fallback'
        }
      },
      version: '1.0.0'
    }, { status: 200 });

  } catch (error) {
    Logger.error('Health check failed', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    }, { status: 503 });
  }
}
