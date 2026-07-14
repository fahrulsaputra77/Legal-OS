import { NextResponse } from 'next/server';
import { searchService } from '@/server/modules/search-engine/services/search.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    
    if (!q) {
      return NextResponse.json([]);
    }

    const results = await searchService.autocomplete(q);
    return NextResponse.json(results);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
