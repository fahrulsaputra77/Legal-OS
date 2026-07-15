import { importService } from '~~/server/modules/import-engine/services/import.service';
import { importWorker } from '~~/server/modules/import-engine/queue/worker';

export default defineEventHandler(async (event) => {
  try {
    const formData = await readFormData(event);
    const file = formData.get('file') as File;
    
    if (!file) {
      setResponseStatus(event, 400);
      return { error: 'No file provided' };
    }

    // In a real app, we would upload this to S3 or /tmp.
    // Here we'll simulate saving the file by generating a mock URL.
    const fileExt = file.name.split('.').pop() || 'txt';
    const fileUrl = `/tmp/mock-uploads/${file.name}`;
    
    const job = await importService.createJob(file.name, fileExt, file.size, fileUrl);

    // Trigger async worker in the background (fire and forget)
    // Note: Vercel serverless functions may kill this. In real production Next.js, you'd push to an SQS/BullMQ queue.
    // For this sprint's environment, we just run the promise asynchronously.
    importWorker.processJob(job.id).catch(err => console.error('Worker Error:', err));

    return { success: true, job }
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});