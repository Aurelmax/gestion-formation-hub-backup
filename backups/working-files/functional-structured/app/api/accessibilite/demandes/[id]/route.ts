import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// GET - Récupérer une demande d'accessibilité spécifique
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
        { error: 'Demande d\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(demande);
  } catch (error) {
    console.error('Erreur lors de la récupération de la demande d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la demande d\'accessibilité' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour une demande d'accessibilité
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
    const {
      nom,
      email,
      telephone,
      description,
      statut,
      reponse
    } = await request.json();

    const demande = await prisma.demandes_accessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande d\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    const updatedDemande = await prisma.demandes_accessibilite.update({
      where: { id },
      data: {
        nom,
        email,
        telephone,
        description,
        statut,
        reponse
      }
    });

    return NextResponse.json(updatedDemande);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la demande d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de la demande d\'accessibilité' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer une demande d'accessibilité
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

    const demande = await prisma.demandes_accessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande d\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    await prisma.demandes_accessibilite.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Demande d\'accessibilité supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la demande d\'accessibilité' },
      { status: 500 }
    );
  }
}