import { NextResponse } from 'next/server';
import { importService } from '@/server/modules/import-engine/services/import.service';
import { importWorker } from '@/server/modules/import-engine/queue/worker';
import { JobStatus } from '@prisma/client';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const body = await req.json();
    const { action } = body; // 'PAUSE', 'RESUME', 'CANCEL', 'RETRY', 'ROLLBACK'

    const { jobId } = await params;
    const job = await importService.getJob(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
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
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, action, jobId });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
