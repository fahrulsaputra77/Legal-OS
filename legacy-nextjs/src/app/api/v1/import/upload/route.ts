import { NextResponse } from 'next/server';
import { importService } from '@/server/modules/import-engine/services/import.service';
import { importWorker } from '@/server/modules/import-engine/queue/worker';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
