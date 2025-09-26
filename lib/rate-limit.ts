import { NextRequest } from 'next/server';

interface RateLimitConfig {
  windowMs: number; // Fenêtre de temps en millisecondes
  maxRequests: number; // Nombre max de requêtes par fenêtre
}

interface RateLimitStore {
  [key: string]: {
    requests: number;
    windowStart: number;
  };
}

// Store en mémoire pour le rate limiting
const store: RateLimitStore = {};

// Nettoyage périodique du store
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (now - store[key].windowStart > 3600000) { // 1 heure
      delete store[key];
    }
  });
}, 300000); // Nettoyage toutes les 5 minutes

/**
 * Middleware de rate limiting
 */
export function createRateLimit(config: RateLimitConfig) {
  return {
    check: (request: NextRequest, identifier?: string) => {
      const now = Date.now();
      const key = identifier || getIdentifier(request);

      // Initialiser ou récupérer les données de limite pour cette clé
      if (!store[key] || (now - store[key].windowStart) >= config.windowMs) {
        store[key] = {
          requests: 1,
          windowStart: now
        };
        return { success: true, remaining: config.maxRequests - 1 };
      }

      // Incrémenter le compteur de requêtes
      store[key].requests += 1;

      // Vérifier si la limite est dépassée
      if (store[key].requests > config.maxRequests) {
        const resetTime = store[key].windowStart + config.windowMs;
        return {
          success: false,
          remaining: 0,
          resetTime: new Date(resetTime).toISOString()
        };
      }

      return {
        success: true,
        remaining: config.maxRequests - store[key].requests
      };
    }
  };
}

/**
 * Obtenir un identifiant unique pour la requête
 */
function getIdentifier(request: NextRequest): string {
  // Utiliser l'IP en priorité
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded
    ? forwarded.split(',')[0].trim()
    : request.headers.get('x-real-ip') || 'unknown';

  // Ajouter le user-agent pour plus de granularité
  const userAgent = request.headers.get('user-agent') || '';
  const userAgentHash = hashString(userAgent);

  return `${ip}:${userAgentHash}`;
}

/**
 * Hash simple pour réduire la taille des clés
 */
function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

// Configurations prédéfinies pour différents types d'endpoints
export const rateLimitConfigs = {
  // APIs publiques - limite modérée
  public: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100 // 100 requêtes par 15 min
  }),

  // APIs authentifiées - limite plus élevée
  authenticated: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 300 // 300 requêtes par 15 min
  }),

  // APIs sensibles (auth, création, modification) - limite stricte
  sensitive: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 20 // 20 requêtes par 15 min
  }),

  // APIs de contact/formulaires - limite très stricte
  forms: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 heure
    maxRequests: 5 // 5 soumissions par heure
  }),

  // APIs de lecture - limite élevée
  read: createRateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    maxRequests: 200 // 200 requêtes par 5 min
  })
};

/**
 * Wrapper pour appliquer le rate limiting à une route
 */
export function withRateLimit(
  handler: (request: NextRequest, context: any) => Promise<Response>,
  limiter: ReturnType<typeof createRateLimit>
) {
  return async (request: NextRequest, context: any) => {
    const result = limiter.check(request);

    if (!result.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: {
            type: 'rate_limit_exceeded',
            message: 'Trop de requêtes. Veuillez réessayer plus tard.',
            resetTime: result.resetTime
          }
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': result.resetTime || '',
            'Retry-After': '900' // 15 minutes
          }
        }
      );
    }

    const response = await handler(request, context);

    // Ajouter les headers de rate limit aux réponses réussies
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());

    return response;
  };
}