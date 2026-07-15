import { PrismaClient } from '@prisma/client';
import { Logger } from '~~/app/lib/logger';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
  try {
    // Check DB connection
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return {
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
    };

  } catch (error) {
    Logger.error('Health check failed', error);
    setResponseStatus(event, 503);
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Database connection failed'
    };
  }
});