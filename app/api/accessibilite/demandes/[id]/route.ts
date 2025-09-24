import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";



// GET - Récupérer une demande d'accessibilité spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const demande = await prisma.demandeAccessibilite.findUnique({
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const {
      nom,
      email,
      telephone,
      description,
      statut,
      reponse
    } = await request.json();

    const demande = await prisma.demandeAccessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande d\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    
    if (nom) updateData.nom = nom;
    if (email) updateData.email = email;
    if (telephone) updateData.telephone = telephone;
    if (description) updateData.description = description;
    if (statut) updateData.statut = statut;
    if (reponse) updateData.reponse = reponse;

    // Si on met à jour le statut vers "resolu" ou "ferme", ajouter la date de résolution
    if (statut && (statut === 'resolu' || statut === 'ferme')) {
      updateData.dateResolution = new Date();
    }

    const demandeMiseAJour = await prisma.demandeAccessibilite.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(demandeMiseAJour);
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const demande = await prisma.demandeAccessibilite.findUnique({
      where: { id }
    });

    if (!demande) {
      return NextResponse.json(
        { error: 'Demande d\'accessibilité non trouvée' },
        { status: 404 }
      );
    }

    await prisma.demandeAccessibilite.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Demande d\'accessibilité supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la demande d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la demande d\'accessibilité' },
      { status: 500 }
    );
  }
}