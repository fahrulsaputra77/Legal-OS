import { prisma } from '~~/app/lib/db';
import { JobStatus, BatchStatus } from '@prisma/client';

export class ImportService {
  async createJob(fileName: string, fileType: string, fileSize: number, fileUrl: string) {
    return prisma.importJob.create({
      data: {
        fileName,
        fileType,
        fileSize,
        fileUrl,
        status: JobStatus.PENDING,
      }
    });
  }

  async getJob(id: string) {
    return prisma.importJob.findUnique({
      where: { id },
      include: { batches: true }
    });
  }

  async getAllJobs() {
    return prisma.importJob.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateJobStatus(id: string, status: JobStatus, errorLog?: any) {
    return prisma.importJob.update({
      where: { id },
      data: { 
        status,
        ...(errorLog ? { errorLog } : {})
      }
    });
  }

  async createBatch(jobId: string, batchNumber: Int32Array | number) {
    return prisma.importBatch.create({
      data: {
        jobId,
        batchNumber: Number(batchNumber),
        status: BatchStatus.PENDING,
      }
    });
  }

  async updateBatch(batchId: string, status: BatchStatus, recordIds: string[], errorDetails?: string) {
    return prisma.importBatch.update({
      where: { id: batchId },
      data: {
        status,
        recordIds,
        ...(errorDetails ? { errorDetails } : {})
      }
    });
  }
  
  async rollbackJob(id: string) {
    const job = await this.getJob(id);
    if (!job) throw new Error('Job not found');

    await this.updateJobStatus(id, JobStatus.ROLLING_BACK);

    try {
      // Collect all record IDs from successful batches
      const allRecordIds = job.batches
        .filter((b: any) => b.status === BatchStatus.SUCCESS)
        .flatMap((b: any) => b.recordIds);

      if (allRecordIds.length > 0) {
        // Delete all inserted records (duplicate prevention & rollback)
        await prisma.legalDocument.deleteMany({
          where: { id: { in: allRecordIds } }
        });
      }

      await this.updateJobStatus(id, JobStatus.ROLLED_BACK);
    } catch (error: any) {
      await this.updateJobStatus(id, JobStatus.FAILED, { action: 'rollback', message: error.message });
      throw error;
    }
  }
}

export const importService = new ImportService();
