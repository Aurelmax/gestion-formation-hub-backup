import { NextRequest, NextResponse, prisma, requireAuth, requireAuthWithRole } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';


export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;

    const plan = await prisma.plans_accessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'plan non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Erreur lors de la récupération:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération' },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { nom, description, statut } = await request.json();

    const nouveauplan = await prisma.plans_accessibilite.create({
      data: {
        nom,
        description,
        statut
      }
    });

    return NextResponse.json(nouveauplan, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création' },
      { status: 500 }
    );
  }
}