import { NextResponse } from 'next/server';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

  return NextResponse.json({ status: 'ok', timestamp: new Date().toISOString() });
}

    );
  }
