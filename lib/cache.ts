/**
 * Cache optimization utilities for Next.js applications
 * Provides memory-based caching with automatic cleanup
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class MemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Start cleanup process every 5 minutes
    this.startCleanup();
  }

  /**
   * Get cached data
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set cached data with TTL
   */
  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    };

    this.cache.set(key, entry);
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
      memoryUsage: process.memoryUsage()
    };
  }

  /**
   * Start automatic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      let cleanedCount = 0;

      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
          cleanedCount++;
        }
      }

      if (cleanedCount > 0) {
        console.log(`🧹 Cache cleanup: removed ${cleanedCount} expired entries`);
      }
    }, 5 * 60 * 1000); // Every 5 minutes
  }

  /**
   * Stop cleanup process
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clear();
  }
}

// Singleton instance
export const cache = new MemoryCache();

/**
 * Cache configuration for different types of data
 */
export const CACHE_CONFIG = {
  // Static data that rarely changes
  categories: 600, // 10 minutes
  programmes: 300, // 5 minutes

  // User-specific data
  formations: 180, // 3 minutes
  apprenants: 120, // 2 minutes

  // Real-time data
  rendezvous: 60, // 1 minute
  reclamations: 30, // 30 seconds

  // SEO and public pages
  public: 900, // 15 minutes
  blog: 1800, // 30 minutes
} as const;

/**
 * Create a cache key for API endpoints
 */
export function createCacheKey(endpoint: string, params?: Record<string, any>): string {
  const baseKey = endpoint.replace(/^\//, '').replace(/\//g, ':');

  if (!params) return baseKey;

  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  return `${baseKey}?${sortedParams}`;
}

/**
 * Higher-order function to add caching to API handlers
 */
export function withCache<T>(
  handler: () => Promise<T>,
  cacheKey: string,
  ttlSeconds: number
): Promise<T> {
  return new Promise(async (resolve, reject) => {
    try {
      // Try to get from cache first
      const cached = cache.get<T>(cacheKey);
      if (cached) {
        console.log(`✅ Cache hit: ${cacheKey}`);
        resolve(cached);
        return;
      }

      console.log(`🔄 Cache miss: ${cacheKey}`);

      // Execute handler and cache result
      const result = await handler();
      cache.set(cacheKey, result, ttlSeconds);

      resolve(result);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Cache middleware for Next.js API routes
 */
export function cacheMiddleware(ttlSeconds: number) {
  return (handler: Function) => {
    return async (req: any, res: any) => {
      const cacheKey = createCacheKey(req.url, req.query);

      try {
        const result = await withCache(
          () => handler(req, res),
          cacheKey,
          ttlSeconds
        );

        return result;
      } catch (error) {
        throw error;
      }
    };
  };
}

/**
 * Invalidate cache entries matching a pattern
 */
export function invalidateCache(pattern: string): number {
  let invalidatedCount = 0;

  for (const key of cache.getStats().keys) {
    if (key.includes(pattern)) {
      cache.delete(key);
      invalidatedCount++;
    }
  }

  console.log(`🗑️ Invalidated ${invalidatedCount} cache entries for pattern: ${pattern}`);
  return invalidatedCount;
}

/**
 * Cache warmer for critical data
 */
export async function warmCache() {
  console.log('🔥 Starting cache warming...');

  try {
    // Pre-load critical data that's frequently accessed
    const warmupTasks = [
      // Categories are used on almost every page
      fetch('/api/categories').then(r => r.json()),
      // Recent formations for homepage
      fetch('/api/programmes-formation?limit=6').then(r => r.json()),
    ];

    await Promise.allSettled(warmupTasks);
    console.log('✅ Cache warming completed');
  } catch (error) {
    console.warn('⚠️ Cache warming failed:', error);
  }
}

export default cache;