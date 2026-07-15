import { NextResponse } from 'next/server';
import { importService } from '@/server/modules/import-engine/services/import.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const job = await importService.getJob(id);
      return NextResponse.json(job);
    }

    const jobs = await importService.getAllJobs();
    return NextResponse.json(jobs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
