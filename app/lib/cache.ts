/**
 * CacheService (Redis-Ready Interface)
 * 
 * Provides an abstract caching layer to easily swap out an in-memory cache
 * for a real Redis implementation (like upstash-redis or ioredis) in the future.
 */

const memoryCache = new Map<string, { value: any; expiresAt: number }>();

export class CacheService {
  /**
   * Get an item from the cache.
   * Returns null if not found or expired.
   */
  static async get<T>(key: string): Promise<T | null> {
    const item = memoryCache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiresAt) {
      memoryCache.delete(key);
      return null;
    }

    return item.value as T;
  }

  /**
   * Set an item in the cache with an expiration time.
   * @param key The cache key
   * @param value The data to store
   * @param ttlSeconds Time-to-live in seconds (default: 1 hour)
   */
  static async set(key: string, value: any, ttlSeconds: number = 3600): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    memoryCache.set(key, { value, expiresAt });
  }

  /**
   * Delete an item from the cache.
   */
  static async del(key: string): Promise<void> {
    memoryCache.delete(key);
  }

  /**
   * Clear all items in the cache.
   */
  static async clear(): Promise<void> {
    memoryCache.clear();
  }

  /**
   * Wrap an async function with caching logic.
   * Useful for wrapping heavy database queries.
   */
  static async remember<T>(key: string, ttlSeconds: number, fetcher: () => Promise<T>): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const data = await fetcher();
    await this.set(key, data, ttlSeconds);
    return data;
  }
}
