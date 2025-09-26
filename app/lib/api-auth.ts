import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

export interface AuthResult {
  isAuthenticated: boolean;
  userId?: string;
  userRole?: string;
  error?: NextResponse;
}

/**
 * Vérifie l'authentification pour les routes API
 */
export async function requireAuth(): Promise<AuthResult> {
  try {
    const { userId } = await auth();

    if (!userId) {
      return {
        isAuthenticated: false,
        error: NextResponse.json(
          { error: 'Non autorisé - Authentification requise' },
          { status: 401 }
        )
      };
    }

    return {
      isAuthenticated: true,
      userId
    };
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return {
      isAuthenticated: false,
      error: NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 500 }
      )
    };
  }
}

/**
 * Vérifie l'authentification et les rôles pour les routes API
 */
export async function requireAuthWithRole(requiredRole?: string): Promise<AuthResult> {
  try {
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return {
        isAuthenticated: false,
        error: NextResponse.json(
          { error: 'Non autorisé - Authentification requise' },
          { status: 401 }
        )
      };
    }

    // Vérifier le rôle si spécifié
    if (requiredRole) {
      const userRole = sessionClaims?.metadata?.role as string || 'user';
      
      if (userRole !== requiredRole && userRole !== 'admin') {
        return {
          isAuthenticated: false,
          userId,
          userRole,
          error: NextResponse.json(
            { error: 'Accès refusé - Permissions insuffisantes' },
            { status: 403 }
          )
        };
      }
    }

    return {
      isAuthenticated: true,
      userId,
      userRole: sessionClaims?.metadata?.role as string || 'user'
    };
  } catch (error) {
    console.error('Erreur d\'authentification avec rôle:', error);
    return {
      isAuthenticated: false,
      error: NextResponse.json(
        { error: 'Erreur d\'authentification' },
        { status: 500 }
      )
    };
  }
}

/**
 * Vérifie si l'utilisateur est administrateur
 */
export async function requireAdmin(): Promise<AuthResult> {
  return requireAuthWithRole('admin');
}

/**
 * Middleware de protection pour les routes API sensibles
 */
export function withAuth(handler: Function, requiredRole?: string) {
  return async (request: NextRequest, ...args: any[]) => {
    const authResult = requiredRole 
      ? await requireAuthWithRole(requiredRole)
      : await requireAuth();

    if (!authResult.isAuthenticated) {
      return authResult.error;
    }

    return handler(request, ...args);
  };
}
