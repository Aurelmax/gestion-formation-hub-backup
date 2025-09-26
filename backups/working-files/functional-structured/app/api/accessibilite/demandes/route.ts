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

    const demande = await prisma.demandes_accessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'demande non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(demande);
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

    const { nom, email, telephone, description } = await request.json();

    const nouveaudemande = await prisma.demandes_accessibilite.create({
      data: {
        nom,
        email,
        telephone,
        description
      }
    });

    return NextResponse.json(nouveaudemande, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création' },
      { status: 500 }
    );
  }
}