/**
 * HTTP Caching utilities for Next.js API routes
 * Provides optimized cache headers for better performance
 */

import { NextResponse } from 'next/server';

/**
 * Cache strategies for different types of content
 */
export const CACHE_STRATEGIES = {
  // Static data that rarely changes - 10 minutes browser, 1 hour CDN
  static: {
    maxAge: 600,          // 10 minutes
    sMaxAge: 3600,        // 1 hour CDN
    staleWhileRevalidate: 86400, // 24 hours stale-while-revalidate
  },

  // Semi-dynamic data - 5 minutes browser, 30 minutes CDN
  dynamic: {
    maxAge: 300,          // 5 minutes
    sMaxAge: 1800,        // 30 minutes CDN
    staleWhileRevalidate: 3600,  // 1 hour stale-while-revalidate
  },

  // Real-time data - 30 seconds browser, 2 minutes CDN
  realtime: {
    maxAge: 30,           // 30 seconds
    sMaxAge: 120,         // 2 minutes CDN
    staleWhileRevalidate: 600,   // 10 minutes stale-while-revalidate
  },

  // User-specific data - no public cache, only private
  private: {
    maxAge: 0,
    private: true,
    mustRevalidate: true,
  },

  // No cache for sensitive operations
  none: {
    maxAge: 0,
    noCache: true,
    noStore: true,
    mustRevalidate: true,
  }
} as const;

/**
 * Cache headers configuration for specific endpoints
 */
export const ENDPOINT_CACHE_CONFIG = {
  // Public data endpoints
  '/api/categories': CACHE_STRATEGIES.static,
  '/api/programmes-formation': CACHE_STRATEGIES.dynamic,
  '/api/formations': CACHE_STRATEGIES.dynamic,

  // User-specific endpoints
  '/api/apprenants': CACHE_STRATEGIES.private,
  '/api/rendezvous': CACHE_STRATEGIES.private,

  // Real-time endpoints
  '/api/reclamations': CACHE_STRATEGIES.realtime,
  '/api/veille': CACHE_STRATEGIES.realtime,

  // Security-sensitive endpoints
  '/api/auth': CACHE_STRATEGIES.none,
  '/api/csrf': CACHE_STRATEGIES.none,
} as const;

/**
 * Generate Cache-Control header value
 */
function generateCacheControl(strategy: any): string {
  const directives: string[] = [];

  if (strategy.noCache) directives.push('no-cache');
  if (strategy.noStore) directives.push('no-store');
  if (strategy.private) directives.push('private');
  if (strategy.mustRevalidate) directives.push('must-revalidate');

  if (!strategy.noCache && !strategy.noStore) {
    if (strategy.maxAge !== undefined) directives.push(`max-age=${strategy.maxAge}`);
    if (strategy.sMaxAge !== undefined) directives.push(`s-maxage=${strategy.sMaxAge}`);
    if (strategy.staleWhileRevalidate !== undefined) {
      directives.push(`stale-while-revalidate=${strategy.staleWhileRevalidate}`);
    }
  }

  return directives.join(', ');
}

/**
 * Apply cache headers to a Response
 */
export function applyCacheHeaders(
  response: NextResponse,
  strategy: any,
  customHeaders?: Record<string, string>
): NextResponse {
  // Set Cache-Control header
  const cacheControl = generateCacheControl(strategy);
  if (cacheControl) {
    response.headers.set('Cache-Control', cacheControl);
  }

  // Set ETag for conditional requests (if content provided)
  const content = response.body;
  if (content && typeof content === 'string') {
    const etag = generateETag(content);
    response.headers.set('ETag', etag);
  }

  // Set Vary header for content negotiation
  response.headers.set('Vary', 'Accept, Accept-Encoding, Authorization');

  // Set custom headers
  if (customHeaders) {
    Object.entries(customHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
  }

  // Performance headers
  if (!strategy.private && !strategy.noCache) {
    // Allow CDN caching for public endpoints
    response.headers.set('CDN-Cache-Control', `max-age=${strategy.sMaxAge || strategy.maxAge}`);
  }

  return response;
}

/**
 * Generate ETag from content
 */
function generateETag(content: string): string {
  // Simple hash function for ETag generation
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return `"${Math.abs(hash).toString(36)}"`;
}

/**
 * Create cached JSON response
 */
export function createCachedResponse(
  data: any,
  strategy: any,
  status: number = 200,
  customHeaders?: Record<string, string>
): NextResponse {
  const response = NextResponse.json(data, { status });
  return applyCacheHeaders(response, strategy, customHeaders);
}

/**
 * Get cache strategy for endpoint
 */
export function getCacheStrategy(pathname: string): any {
  // Exact match first
  if (pathname in ENDPOINT_CACHE_CONFIG) {
    return ENDPOINT_CACHE_CONFIG[pathname as keyof typeof ENDPOINT_CACHE_CONFIG];
  }

  // Pattern matching
  if (pathname.startsWith('/api/programmes-formation/')) return CACHE_STRATEGIES.dynamic;
  if (pathname.startsWith('/api/formations/')) return CACHE_STRATEGIES.dynamic;
  if (pathname.startsWith('/api/auth/')) return CACHE_STRATEGIES.none;
  if (pathname.startsWith('/api/admin/')) return CACHE_STRATEGIES.private;

  // Default fallback
  return CACHE_STRATEGIES.dynamic;
}

/**
 * Cache middleware for API routes
 */
export function withCacheHeaders(handler: Function) {
  return async function cachedHandler(request: Request) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Execute the original handler
    const response = await handler(request);

    // Skip caching for non-GET requests
    if (request.method !== 'GET') {
      return response;
    }

    // Get appropriate cache strategy
    const strategy = getCacheStrategy(pathname);

    // Apply cache headers
    return applyCacheHeaders(response, strategy);
  };
}

/**
 * Check if request has conditional headers (ETag, If-Modified-Since)
 */
export function checkConditionalRequest(
  request: Request,
  etag?: string,
  lastModified?: Date
): NextResponse | null {
  const ifNoneMatch = request.headers.get('If-None-Match');
  const ifModifiedSince = request.headers.get('If-Modified-Since');

  // ETag match - return 304 Not Modified
  if (ifNoneMatch && etag && ifNoneMatch === etag) {
    return new NextResponse(null, {
      status: 304,
      headers: {
        'ETag': etag,
        'Cache-Control': 'private, must-revalidate',
      },
    });
  }

  // Last-Modified check
  if (ifModifiedSince && lastModified) {
    const ifModifiedSinceDate = new Date(ifModifiedSince);
    if (lastModified <= ifModifiedSinceDate) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'Last-Modified': lastModified.toUTCString(),
          'Cache-Control': 'private, must-revalidate',
        },
      });
    }
  }

  return null;
}

/**
 * Log cache performance
 */
export function logCachePerformance(
  endpoint: string,
  hit: boolean,
  responseTime: number
) {
  const status = hit ? 'HIT' : 'MISS';
  const color = hit ? '🟢' : '🔵';

  console.log(
    `${color} Cache ${status}: ${endpoint} (${responseTime}ms)`
  );
}

export default {
  applyCacheHeaders,
  createCachedResponse,
  getCacheStrategy,
  withCacheHeaders,
  checkConditionalRequest,
  CACHE_STRATEGIES,
};