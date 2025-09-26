import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// PUT - Modifier un commentaire
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; commentaireId: string }> }
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

    
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

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
  console.error("Erreur serveur:", error);
  return NextResponse.json(
    { error: "Erreur serveur" },
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
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

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
  console.error("Erreur serveur:", error);
  return NextResponse.json(
    { error: "Erreur serveur" },
    { status: 500 }
  );
}
}