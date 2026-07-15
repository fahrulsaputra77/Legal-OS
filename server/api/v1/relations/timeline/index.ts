import { RelationService } from '~~/server/modules/knowledge-base/services/relation.service';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const documentId = query.documentId as string;

    if (!documentId) {
      setResponseStatus(event, 400);
      return { error: 'Missing documentId parameter' };
    }

    const timeline = await RelationService.getTimeline(documentId);
    
    return { data: timeline }
  } catch (error) {
    console.error('Timeline API Error:', error);
    setResponseStatus(event, 500);
    return { error: 'Internal Server Error' };
  }
});