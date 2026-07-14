import { NextRequest, NextResponse } from 'next/server';
import { RelationService } from '@/server/modules/knowledge-base/services/relation.service';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const documentId = searchParams.get('documentId');
    const depthParam = searchParams.get('depth');
    const depth = depthParam ? parseInt(depthParam, 10) : 2;

    if (!documentId) {
      return NextResponse.json({ error: 'Missing documentId parameter' }, { status: 400 });
    }

    const graph = await RelationService.getKnowledgeGraph(documentId, depth);
    
    return NextResponse.json({ data: graph });
  } catch (error) {
    console.error('Graph API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
