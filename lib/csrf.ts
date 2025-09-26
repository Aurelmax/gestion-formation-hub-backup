import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';
import { secureLogger } from './security';

/**
 * Configuration CSRF
 */
interface CSRFConfig {
  cookieName: string;
  headerName: string;
  tokenLength: number;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
}

const defaultConfig: CSRFConfig = {
  cookieName: '__Host-csrf-token',
  headerName: 'X-CSRF-Token',
  tokenLength: 32,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict'
};

/**
 * Générateur de tokens CSRF sécurisés
 */
export class CSRFProtection {
  private config: CSRFConfig;

  constructor(config: Partial<CSRFConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Génère un token CSRF cryptographiquement sécurisé
   */
  private generateToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    // Utiliser crypto.getRandomValues si disponible, sinon Math.random (moins sécurisé)
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      const array = new Uint8Array(this.config.tokenLength);
      crypto.getRandomValues(array);
      for (let i = 0; i < this.config.tokenLength; i++) {
        token += chars[array[i] % chars.length];
      }
    } else {
      // Fallback pour les environnements sans crypto
      for (let i = 0; i < this.config.tokenLength; i++) {
        token += chars[Math.floor(Math.random() * chars.length)];
      }
    }

    return token;
  }

  /**
   * Génère un nouveau token CSRF et le stocke dans un cookie
   */
  public generateCSRFToken(): { token: string; cookieHeader: string } {
    const token = this.generateToken();

    const cookieOptions = [
      `${this.config.cookieName}=${token}`,
      'HttpOnly',
      'Path=/',
      `SameSite=${this.config.sameSite}`,
      'Max-Age=3600' // 1 heure
    ];

    if (this.config.secure) {
      cookieOptions.push('Secure');
    }

    const cookieHeader = cookieOptions.join('; ');

    return { token, cookieHeader };
  }

  /**
   * Valide un token CSRF depuis la requête
   */
  public validateCSRFToken(request: NextRequest): boolean {
    try {
      // Récupérer le token depuis le header
      const headerToken = request.headers.get(this.config.headerName);

      // Récupérer le token depuis le cookie
      const cookieHeader = request.headers.get('cookie');
      const cookieToken = this.extractTokenFromCookie(cookieHeader);

      // Vérifier que les deux tokens existent
      if (!headerToken || !cookieToken) {
        secureLogger.warn('CSRF validation failed: missing tokens', {
          hasHeaderToken: !!headerToken,
          hasCookieToken: !!cookieToken,
          route: request.nextUrl.pathname
        });
        return false;
      }

      // Vérifier que les tokens correspondent
      if (headerToken !== cookieToken) {
        secureLogger.warn('CSRF validation failed: token mismatch', {
          route: request.nextUrl.pathname
        });
        return false;
      }

      // Vérifier la longueur du token
      if (headerToken.length !== this.config.tokenLength) {
        secureLogger.warn('CSRF validation failed: invalid token length', {
          tokenLength: headerToken.length,
          expectedLength: this.config.tokenLength,
          route: request.nextUrl.pathname
        });
        return false;
      }

      return true;
    } catch (error) {
      secureLogger.error('CSRF validation error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        route: request.nextUrl.pathname
      });
      return false;
    }
  }

  /**
   * Extrait le token CSRF du cookie
   */
  private extractTokenFromCookie(cookieHeader: string | null): string | null {
    if (!cookieHeader) return null;

    const cookies = cookieHeader.split(';');
    for (const cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === this.config.cookieName) {
        return value;
      }
    }

    return null;
  }

  /**
   * Vérifie si une route nécessite une protection CSRF
   */
  public shouldProtectRoute(request: NextRequest): boolean {
    const method = request.method;
    const pathname = request.nextUrl.pathname;

    // Protéger les méthodes de modification
    const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
    if (!protectedMethods.includes(method)) {
      return false;
    }

    // Exclure certaines routes (comme les webhooks externes)
    const excludedRoutes = [
      '/api/webhooks/',
      '/api/auth/callback',
      '/api/health'
    ];

    return !excludedRoutes.some(route => pathname.startsWith(route));
  }
}

/**
 * Instance globale de protection CSRF
 */
export const csrfProtection = new CSRFProtection();

/**
 * Middleware pour appliquer la protection CSRF
 */
export function withCSRFProtection(
  handler: (request: NextRequest, context: any) => Promise<Response>
) {
  return async (request: NextRequest, context: any) => {
    // Vérifier si la route nécessite une protection CSRF
    if (!csrfProtection.shouldProtectRoute(request)) {
      return handler(request, context);
    }

    // Valider le token CSRF
    if (!csrfProtection.validateCSRFToken(request)) {
      secureLogger.warn('CSRF protection blocked request', {
        route: request.nextUrl.pathname,
        method: request.method,
        userAgent: request.headers.get('user-agent')
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: {
            type: 'csrf_validation_failed',
            message: 'Token CSRF invalide ou manquant'
          }
        }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }

    return handler(request, context);
  };
}

/**
 * Hook pour obtenir un token CSRF côté client
 */
export function getCSRFToken(): string | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === defaultConfig.cookieName) {
      return value;
    }
  }

  return null;
}

/**
 * API route pour générer un nouveau token CSRF
 */
export async function generateCSRFTokenResponse(): Promise<Response> {
  const { token, cookieHeader } = csrfProtection.generateCSRFToken();

  return new Response(
    JSON.stringify({
      success: true,
      csrfToken: token
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': cookieHeader
      }
    }
  );
}

/**
 * Composant React pour inclure automatiquement le token CSRF dans les formulaires
 */
export function CSRFTokenInput(): JSX.Element {
  const token = getCSRFToken();

  return (
    <input
      type="hidden"
      name="csrf-token"
      value={token || ''}
      data-csrf-token="true"
    />
  );
}

/**
 * Utilitaire pour ajouter le token CSRF aux requêtes fetch
 */
export function addCSRFToken(options: RequestInit = {}): RequestInit {
  const token = getCSRFToken();

  if (token) {
    return {
      ...options,
      headers: {
        ...options.headers,
        [defaultConfig.headerName]: token
      }
    };
  }

  return options;
}