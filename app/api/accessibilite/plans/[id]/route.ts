import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer un plan d'accessibilité spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await prisma.planAccessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\'accessibilité non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(plan);
  } catch (error) {
    console.error('Erreur lors de la récupération du plan d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération du plan d\'accessibilité' },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un plan d'accessibilité
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {
      titre,
      description,
      actionsRequises,
      statut
    } = await request.json();

    const plan = await prisma.planAccessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\'accessibilité non trouvé' },
        { status: 404 }
      );
    }

    const planMisAJour = await prisma.planAccessibilite.update({
      where: { id },
      data: {
        ...(titre && { titre }),
        ...(description && { description }),
        ...(actionsRequises && { actionsRequises }),
        ...(statut && { statut }),
        dateModification: new Date()
      }
    });

    return NextResponse.json(planMisAJour);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du plan d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour du plan d\'accessibilité' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un plan d'accessibilité
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const plan = await prisma.planAccessibilite.findUnique({
      where: { id }
    });

    if (!plan) {
      return NextResponse.json(
        { error: 'Plan d\'accessibilité non trouvé' },
        { status: 404 }
      );
    }

    await prisma.planAccessibilite.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Plan d\'accessibilité supprimé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression du plan d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du plan d\'accessibilité' },
      { status: 500 }
    );
  }
}