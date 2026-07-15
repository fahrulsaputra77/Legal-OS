import { NextResponse } from 'next/server';
import { documentService } from '@/server/modules/knowledge-base/services/document.service';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = {
      type: searchParams.get('type') || undefined,
      year: searchParams.get('year') ? parseInt(searchParams.get('year') as string) : undefined,
      status: searchParams.get('status') || undefined,
      search: searchParams.get('search') || undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit') as string) : undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page') as string) : undefined,
    };

    const documents = await documentService.getDocuments(query);
    return NextResponse.json({ success: true, data: documents });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const document = await documentService.createDocument(body);
    return NextResponse.json({ success: true, data: document }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
