import { NextResponse } from 'next/server';
import { searchService } from '@/server/modules/search-engine/services/search.service';

export async function GET(req: Request) {
  try {
    const results = await searchService.getHistory('guest');
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
