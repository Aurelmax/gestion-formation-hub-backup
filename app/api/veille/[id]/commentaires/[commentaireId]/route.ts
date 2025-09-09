import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Modifier un commentaire
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentaireId: string }> }
) {
  try {
    const { id, commentaireId } = await params;
    const { contenu } = await request.json();

    if (!contenu || contenu.trim().length === 0) {
      return NextResponse.json(
        { error: 'Le contenu du commentaire est requis' },
        { status: 400 }
      );
    }

    // Vérifier que la veille existe
    const veille = await prisma.veille.findUnique({
      where: { id }
    });

    if (!veille) {
      return NextResponse.json(
        { error: 'Veille non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que le commentaire existe et appartient à cette veille
    const commentaire = await prisma.veilleCommentaire.findFirst({
      where: {
        id: commentaireId,
        veilleId: id
      }
    });

    if (!commentaire) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      );
    }

    // Mettre à jour le commentaire
    const commentaireMisAJour = await prisma.veilleCommentaire.update({
      where: { id: commentaireId },
      data: {
        contenu: contenu.trim()
      }
    });

    // Ajouter une entrée dans l'historique
    await prisma.veilleHistorique.create({
      data: {
        action: 'Commentaire modifié',
        details: `Commentaire modifié`,
        utilisateur: 'Système',
        veilleId: id
      }
    });

    return NextResponse.json({
      id: commentaireMisAJour.id,
      contenu: commentaireMisAJour.contenu,
      dateCreation: commentaireMisAJour.dateCreation,
      utilisateur: commentaireMisAJour.utilisateur
    });

  } catch (error) {
    console.error('Erreur lors de la modification du commentaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la modification du commentaire' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un commentaire
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentaireId: string }> }
) {
  try {
    const { id, commentaireId } = await params;

    // Vérifier que la veille existe
    const veille = await prisma.veille.findUnique({
      where: { id }
    });

    if (!veille) {
      return NextResponse.json(
        { error: 'Veille non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier que le commentaire existe et appartient à cette veille
    const commentaire = await prisma.veilleCommentaire.findFirst({
      where: {
        id: commentaireId,
        veilleId: id
      }
    });

    if (!commentaire) {
      return NextResponse.json(
        { error: 'Commentaire non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le commentaire
    await prisma.veilleCommentaire.delete({
      where: { id: commentaireId }
    });

    // Ajouter une entrée dans l'historique
    await prisma.veilleHistorique.create({
      data: {
        action: 'Commentaire supprimé',
        details: `Commentaire supprimé`,
        utilisateur: 'Système',
        veilleId: id
      }
    });

    return NextResponse.json(
      { message: 'Commentaire supprimé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du commentaire' },
      { status: 500 }
    );
  }
}