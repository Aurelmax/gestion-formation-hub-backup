import { NextRequest, NextResponse } from 'next/server';
import { getSecurityHeaders } from '@/lib/security';

/**
 * Middleware de sécurité global pour l'application
 */
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Ajouter les headers de sécurité à toutes les réponses
  const securityHeaders = getSecurityHeaders();
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Protection spécifique pour les routes admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Ajouter des headers de sécurité renforcés pour l'admin
    response.headers.set('X-Robots-Tag', 'noindex, nofollow, nosnippet, noarchive');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }

  // Protection pour les APIs sensibles
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Logs de sécurité pour les APIs (sans données sensibles)
    const logData = {
      method: request.method,
      path: request.nextUrl.pathname,
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
      timestamp: new Date().toISOString()
    };

    // En développement, logger les requêtes API
    if (process.env.NODE_ENV === 'development') {
      console.log('API Request:', logData);
    }

    // Bloquer les requêtes avec des user-agents suspects
    const userAgent = request.headers.get('user-agent') || '';
    const suspiciousAgents = [
      'bot',
      'crawler',
      'spider',
      'scraper',
      'curl',
      'wget',
      'python-requests',
      'postman' // En production, vous pourriez vouloir bloquer Postman
    ];

    if (suspiciousAgents.some(agent => userAgent.toLowerCase().includes(agent))) {
      // En production, vous pourriez vouloir être plus strict
      if (process.env.NODE_ENV === 'production' &&
          !request.nextUrl.pathname.startsWith('/api/public/')) {

        console.warn('Suspicious user agent blocked:', {
          userAgent,
          path: request.nextUrl.pathname,
          ip: logData.ip
        });

        return new NextResponse(
          JSON.stringify({
            success: false,
            error: {
              type: 'access_denied',
              message: 'Access denied'
            }
          }),
          {
            status: 403,
            headers: {
              'Content-Type': 'application/json',
              ...securityHeaders
            }
          }
        );
      }
    }

    // Ajouter des headers spécifiques aux APIs
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-API-Version', '1.0');
  }

  // Protection pour les fichiers statiques sensibles
  const sensitiveFiles = [
    '.env',
    '.env.local',
    '.env.production',
    'package.json',
    'package-lock.json',
    'yarn.lock',
    '.git',
    'node_modules',
    'prisma/schema.prisma'
  ];

  if (sensitiveFiles.some(file => request.nextUrl.pathname.includes(file))) {
    return new NextResponse(
      'Not Found',
      {
        status: 404,
        headers: securityHeaders
      }
    );
  }

  return response;
}

/**
 * Configuration du middleware
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};