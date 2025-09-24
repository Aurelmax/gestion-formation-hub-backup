import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';



const commentaireSchema = z.object({
  contenu: z.string().min(1, 'Le commentaire ne peut pas être vide'),
});

// POST /api/veille/[id]/commentaire - Ajouter un commentaire à une veille
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Validation des données
    const validation = commentaireSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const { contenu } = validation.data;

    // Vérifier que la veille existe
    const veilleExistante = await prisma.veille.findUnique({
      where: { id: id }
    });

    if (!veilleExistante) {
      return NextResponse.json(
        { error: 'Veille non trouvée' },
        { status: 404 }
      );
    }

    // Ajouter le commentaire et créer une entrée d'historique
    const [commentaire] = await prisma.$transaction([
      prisma.veilleCommentaire.create({
        data: {
          veilleId: id,
          contenu,
          utilisateur: 'Système' // À remplacer plus tard par l'utilisateur connecté
        }
      }),
      prisma.veilleHistorique.create({
        data: {
          veilleId: id,
          action: 'Ajout de commentaire',
          details: `Commentaire ajouté: "${contenu.substring(0, 50)}${contenu.length > 50 ? '...' : ''}"`,
          utilisateur: 'Système'
        }
      })
    ]);

    return NextResponse.json({
      id: commentaire.id,
      contenu: commentaire.contenu,
      dateCreation: commentaire.dateCreation
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de l\'ajout du commentaire:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}