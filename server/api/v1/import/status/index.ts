import { importService } from '~~/server/modules/import-engine/services/import.service';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const id = query.id;

    if (id) {
      const job = await importService.getJob(id);
      return job
    }

    const jobs = await importService.getAllJobs();
    return jobs
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { error: error.message };
  }
});