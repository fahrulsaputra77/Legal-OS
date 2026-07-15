import { RelationService } from '~~/server/modules/knowledge-base/services/relation.service';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const documentId = query.documentId as string;
    const depthParam = query.depth as string;
    const depth = depthParam ? parseInt(depthParam, 10) : 2;

    if (!documentId) {
      setResponseStatus(event, 400);
      return { error: 'Missing documentId parameter' };
    }

    const graph = await RelationService.getKnowledgeGraph(documentId, depth);
    
    return { data: graph }
  } catch (error) {
    console.error('Graph API Error:', error);
    setResponseStatus(event, 500);
    return { error: 'Internal Server Error' };
  }
});