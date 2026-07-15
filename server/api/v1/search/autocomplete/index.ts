import { searchService } from '~~/server/modules/search-engine/services/search.service';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const q = query.q;
    
    if (!q) {
      return []
    }

    const results = await searchService.autocomplete(q);
    return results
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});