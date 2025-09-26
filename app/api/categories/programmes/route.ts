import { NextRequest, NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

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

    );
  }
    // Code pour créer une nouvelle catégorie de programme

    );
  }
}
