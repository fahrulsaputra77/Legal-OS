import { searchService } from '~~/server/modules/search-engine/services/search.service';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const q = query.q;
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const sort = query.sort || 'relevance';

    if (!q) {
      return { data: [], total: 0 }
    }

    // Save history asynchronously
    searchService.saveHistory(q, 'guest').catch(console.error);

    const result = await searchService.search(q, page, limit, sort);
    return result
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});