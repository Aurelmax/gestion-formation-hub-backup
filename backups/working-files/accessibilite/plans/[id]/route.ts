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
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;
    const { nom, description, statut, date_creation } = await request.json();

    const plan = await prisma.plans_accessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'plan non trouvé' },
        { status: 404 }
      );
    }

    const updatedplan = await prisma.plans_accessibilite.update({
      where: { id },
      data: {
        nom,
        description,
        statut,
        date_creation
      }
    });

    return NextResponse.json(updatedplan);
  } catch (error) {
    console.error('Erreur lors de la mise à jour:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour' },
      { status: 500 }
    );
  }
}
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
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

    await prisma.plans_accessibilite.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'plan supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    );
  }
}