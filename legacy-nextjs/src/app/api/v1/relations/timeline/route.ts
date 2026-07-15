import { NextRequest, NextResponse } from 'next/server';
import { RelationService } from '@/server/modules/knowledge-base/services/relation.service';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId parameter' }, { status: 400 });
    }

    const timeline = await RelationService.getTimeline(documentId);
    
    return NextResponse.json({ data: timeline });
  } catch (error) {
    console.error('Timeline API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
