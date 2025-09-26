import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Veille } from '@prisma/client';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// ✅ Convention Hybride Stricte - Client Prisma Typé
// Schéma de validation pour la mise à jour d'une veille
const veilleUpdateSchema = z.object({
  titre: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  type: z.enum(['reglementaire', 'metier', 'innovation']).optional(),
  statut: z.enum(['nouvelle', 'en-cours', 'terminee']).optional(),
  avancement: z.number().int().min(0).max(100).optional(),
  dateEcheance: z.string().datetime().optional().nullable().transform(val => val ? new Date(val) : null),
});

// GET /api/veille/[id] - Récupérer une veille spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
    const { id } = await params;
    // ✅ Accès Prisma Client typé
    const veille = await prisma.veille.findUnique({
      where: { id },
      include: {
        commentaires: {
          orderBy: { dateCreation: 'desc' }
        },
        documents: {
          orderBy: { dateAjout: 'desc' }
        },
        historique: {
          orderBy: { dateAction: 'desc' }
        }
      }
    });

    if (!veille) {
      return NextResponse.json(
        { error: 'Veille non trouvée' },
        { status: 404 }
      );
    }

    // Format de retour compatible avec le front-end
    const veilleFormatee = {
      id: veille.id,
      titre: veille.titre,
      description: veille.description,
      type: veille.type as 'reglementaire' | 'metier' | 'innovation',
      statut: veille.statut as 'nouvelle' | 'en-cours' | 'terminee',
      avancement: veille.avancement,
      dateCreation: veille.dateCreation,
      dateEcheance: veille.dateEcheance,
      commentaires: veille.commentaires.map(c => c.contenu),
      documents: veille.documents.map(d => ({
        id: d.id,
        nom: d.nom,
        url: d.url,
        type: d.type,
        taille: d.taille,
        dateAjout: d.dateAjout
      })),
      historique: veille.historique.map(h => ({
        id: h.id,
        action: h.action,
        date: h.dateAction,
        utilisateur: h.utilisateur || 'Système',
        details: h.details
      }))
    };

    return NextResponse.json(veilleFormatee);
  } catch (error) {
    console.error('Erreur lors de la récupération de la veille:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// PATCH /api/veille/[id] - Mettre à jour une veille
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
    const { id } = await params;
    const prismaAny = prisma;
    const data = await request.json();

    // Validation des données
    const validation = veilleUpdateSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const validatedData = validation.data;

    // ✅ Vérification existence avec client typé
    const veilleExistante = await prisma.veille.findUnique({
      where: { id: id }
    });

    if (!veilleExistante) {
      return NextResponse.json(
        { error: 'Veille non trouvée' },
        { status: 404 }
      );
    }

    // Préparer les données d'historique pour les changements
    const changementsHistorique = [];
    if (validatedData.statut && validatedData.statut !== veilleExistante.statut) {
      changementsHistorique.push({
        action: 'Changement de statut',
        details: `Statut modifié de "${veilleExistante.statut}" vers "${validatedData.statut}"`,
        utilisateur: 'Système'
      });
    }
    if (validatedData.avancement !== undefined && validatedData.avancement !== veilleExistante.avancement) {
      changementsHistorique.push({
        action: 'Mise à jour avancement',
        details: `Avancement modifié de ${veilleExistante.avancement}% vers ${validatedData.avancement}%`,
        utilisateur: 'Système'
      });
    }

    // ✅ Mise à jour avec client typé
    const veilleModifiee = await prisma.veille.update({
      where: { id: id },
      data: {
        ...validatedData,
        historique: changementsHistorique.length > 0 ? {
          createMany: {
            data: changementsHistorique
          }
        } : undefined
      },
      include: {
        commentaires: {
          orderBy: { dateCreation: 'desc' }
        },
        documents: {
          orderBy: { dateAjout: 'desc' }
        },
        historique: {
          orderBy: { dateAction: 'desc' }
        }
      }
    });

    // Format de retour compatible avec le front-end
    const veilleFormatee = {
      id: veilleModifiee.id,
      titre: veilleModifiee.titre,
      description: veilleModifiee.description,
      type: veilleModifiee.type as 'reglementaire' | 'metier' | 'innovation',
      statut: veilleModifiee.statut as 'nouvelle' | 'en-cours' | 'terminee',
      avancement: veilleModifiee.avancement,
      dateCreation: veilleModifiee.dateCreation,
      dateEcheance: veilleModifiee.dateEcheance,
      commentaires: veilleModifiee.commentaires.map(c => c.contenu),
      documents: veilleModifiee.documents.map(d => ({
        id: d.id,
        nom: d.nom,
        url: d.url,
        type: d.type,
        taille: d.taille,
        dateAjout: d.dateAjout
      })),
      historique: veilleModifiee.historique.map(h => ({
        id: h.id,
        action: h.action,
        date: h.dateAction,
        utilisateur: h.utilisateur || 'Système',
        details: h.details
      }))
    };

    return NextResponse.json(veilleFormatee);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la veille:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// DELETE /api/veille/[id] - Supprimer une veille
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
    const { id } = await params;
    // ✅ Vérification existence avec client typé
    const veilleExistante = await prisma.veille.findUnique({
      where: { id: id }
    });

    if (!veilleExistante) {
      return NextResponse.json(
        { error: 'Veille non trouvée' },
        { status: 404 }
      );
    }

    // ✅ Suppression avec client typé (Cascade automatique)
    await prisma.veille.delete({
      where: { id: id }
    });

    return NextResponse.json(
      { message: 'Veille supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la veille:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}