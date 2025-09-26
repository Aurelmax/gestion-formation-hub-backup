import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';
// Route de test
export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
  return new Response('Test réussi!');
}
