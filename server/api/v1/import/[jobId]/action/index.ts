import { importService } from '~~/server/modules/import-engine/services/import.service';
import { importWorker } from '~~/server/modules/import-engine/queue/worker';
import { JobStatus } from '@prisma/client';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { action } = body; // 'PAUSE', 'RESUME', 'CANCEL', 'RETRY', 'ROLLBACK'

    const { jobId } = await params;
    const job = await importService.getJob(jobId);
    if (!job) {
      setResponseStatus(event, 404);
    return { error: 'Job not found' };
    }

    switch (action) {
      case 'PAUSE':
        await importService.updateJobStatus(jobId, JobStatus.PAUSED);
        break;
      
      case 'RESUME':
      case 'RETRY':
        await importService.updateJobStatus(jobId, JobStatus.PENDING);
        // Trigger worker again
        importWorker.processJob(jobId).catch(err => console.error('Worker Error:', err));
        break;

      case 'CANCEL':
        await importService.updateJobStatus(jobId, JobStatus.CANCELLED);
        break;

      case 'ROLLBACK':
        await importService.rollbackJob(jobId);
        break;

      default:
        setResponseStatus(event, 400);
    return { error: 'Invalid action' };
    }

    return { success: true, action, jobId }
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});