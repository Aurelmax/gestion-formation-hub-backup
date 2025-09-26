import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';
// Route de test
export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
    }

  return new Response('Test réussi!');
}

    );
  }
