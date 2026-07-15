import { documentService } from '~~/server/modules/knowledge-base/services/document.service';

export default defineEventHandler(async (event) => {
  const method = getMethod(event);

  if (method === 'GET') {
    try {
      const q = getQuery(event);
      const queryParams = {
        type: q.type || undefined,
        year: q.year ? parseInt(q.year as string) : undefined,
        status: q.status || undefined,
        search: q.search || undefined,
        limit: q.limit ? parseInt(q.limit as string) : undefined,
        page: q.page ? parseInt(q.page as string) : undefined,
      };

      const documents = await documentService.getDocuments(queryParams);
      return { success: true, data: documents }
    } catch (error: any) {
      setResponseStatus(event, 400);
      return { success: false, error: error.message };
    }
  }

  if (method === 'POST') {
    try {
      const body = await readBody(event);
      const document = await documentService.createDocument(body);
      setResponseStatus(event, 201);
      return { success: true, data: document };
    } catch (error: any) {
      setResponseStatus(event, 400);
      return { success: false, error: error.message };
    }
  }
});