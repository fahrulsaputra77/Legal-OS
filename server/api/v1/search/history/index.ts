import { searchService } from '~~/server/modules/search-engine/services/search.service';

export default defineEventHandler(async (event) => {
  try {
    const results = await searchService.getHistory('guest');
    return results
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});