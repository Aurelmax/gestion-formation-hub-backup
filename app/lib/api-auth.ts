import { auth } from '@clerk/nextjs/server';

/**
 * Vérifier l'authentification de base
 */
export async function requireAuth() {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      isAuthenticated: false,
      error: { error: "Non authentifié", status: 401 }
    };
  }

  return {
    isAuthenticated: true,
    userId
  };
}

/**
 * Vérifier l'authentification avec un rôle spécifique
 */
export async function requireAuthWithRole(requiredRole: string) {
  const { userId } = await auth();
  
  if (!userId) {
    return {
      isAuthenticated: false,
      error: { error: "Non authentifié", status: 401 }
    };
  }

  // Pour l'instant, on considère que tous les utilisateurs authentifiés sont admin
  // Plus tard, on pourra intégrer la gestion des rôles Clerk
  return {
    isAuthenticated: true,
    userId,
    role: 'admin'
  };
}
