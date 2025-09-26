import { NextRequest } from 'next/server';
import { generateCSRFTokenResponse } from '@/lib/csrf';
import { secureLogger } from '@/lib/security';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

/**
 * API pour générer un nouveau token CSRF
 * GET /api/csrf
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
    secureLogger.info('CSRF token requested', {
      route: '/api/csrf',
      method: 'GET',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip')
    });

    return await generateCSRFTokenResponse();
  } catch (error) {
    secureLogger.error('Failed to generate CSRF token', {
      error: error instanceof Error ? error.message : 'Unknown error',
      route: '/api/csrf'
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          type: 'csrf_generation_failed',
          message: 'Impossible de générer le token CSRF'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}