import { NextResponse } from 'next/server';
import { searchService } from '@/server/modules/search-engine/services/search.service';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sort = searchParams.get('sort') || 'relevance';

    if (!q) {
      return NextResponse.json({ data: [], total: 0 });
    }

    // Save history asynchronously
    searchService.saveHistory(q, 'guest').catch(console.error);

    const result = await searchService.search(q, page, limit, sort);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
