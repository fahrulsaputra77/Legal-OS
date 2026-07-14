/**
 * Logger Utility
 * 
 * Standardized logging format for Enterprise systems.
 * Can be easily integrated with Datadog, Sentry, or ELK Stack.
 */

export const Logger = {
  info: (message: string, meta: any = {}) => {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`, meta);
  },
  
  warn: (message: string, meta: any = {}) => {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, meta);
  },
  
  error: (message: string, error?: unknown, meta: any = {}) => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      ...meta
    });
  },

  debug: (message: string, meta: any = {}) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, meta);
    }
  }
};
