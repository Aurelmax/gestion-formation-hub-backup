import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';



// Schéma de validation pour la création d'une veille
const veilleSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  type: z.enum(['reglementaire', 'metier', 'innovation'], {
    errorMap: () => ({ message: 'Type invalide. Doit être: reglementaire, metier ou innovation' })
  }),
  statut: z.enum(['nouvelle', 'en-cours', 'terminee']).default('nouvelle'),
  avancement: z.number().int().min(0).max(100).default(0),
  dateEcheance: z.string().datetime().optional().nullable().transform(val => val ? new Date(val) : null),
});

// GET /api/veille - Récupérer toutes les veilles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const statut = searchParams.get('statut');

    const where: any = {};
    if (type && ['reglementaire', 'metier', 'innovation'].includes(type)) {
      where.type = type;
    }
    if (statut && ['nouvelle', 'en-cours', 'terminee'].includes(statut)) {
      where.statut = statut;
    }

    const veilles = await (prisma as any).veille.findMany({
      where,
      orderBy: { dateCreation: 'desc' }
    });

    // Transformer les données pour correspondre au format TypeScript
    const veillesFormatees = veilles.map(veille => ({
      id: veille.id,
      titre: veille.titre,
      description: veille.description,
      type: veille.type as 'reglementaire' | 'metier' | 'innovation',
      statut: veille.statut as 'nouvelle' | 'en-cours' | 'terminee',
      avancement: veille.avancement,
      dateCreation: veille.dateCreation,
      dateEcheance: veille.dateEcheance,
      commentaires: [],
      documents: [],
      historique: []
    }));

    return NextResponse.json(veillesFormatees);
  } catch (error) {
    console.error('Erreur lors de la récupération des veilles:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des veilles' },
      { status: 500 }
    );
  }
}

// POST /api/veille - Créer une nouvelle veille
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validation des données
    const validation = veilleSchema.safeParse(data);
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

    // Créer la veille avec historique initial
    const nouvelleVeille = await (prisma as any).veille.create({
      data: {
        titre: validatedData.titre,
        description: validatedData.description,
        type: validatedData.type,
        statut: validatedData.statut,
        avancement: validatedData.avancement,
        dateEcheance: validatedData.dateEcheance,
        historique: {
          create: {
            action: 'Création de la veille',
            details: `Veille "${validatedData.titre}" créée`,
            utilisateur: 'Système'
          }
        }
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
      id: nouvelleVeille.id,
      titre: nouvelleVeille.titre,
      description: nouvelleVeille.description,
      type: nouvelleVeille.type as 'reglementaire' | 'metier' | 'innovation',
      statut: nouvelleVeille.statut as 'nouvelle' | 'en-cours' | 'terminee',
      avancement: nouvelleVeille.avancement,
      dateCreation: nouvelleVeille.dateCreation,
      dateEcheance: nouvelleVeille.dateEcheance,
      commentaires: nouvelleVeille.commentaires?.map(c => c.contenu) || [],
      documents: nouvelleVeille.documents?.map(d => ({
        id: d.id,
        nom: d.nom,
        url: d.url,
        type: d.type,
        taille: d.taille,
        dateAjout: d.dateAjout
      })) || [],
      historique: nouvelleVeille.historique?.map(h => ({
        id: h.id,
        action: h.action,
        date: h.dateAction,
        utilisateur: h.utilisateur || 'Système',
        details: h.details
      })) || []
    };

    return NextResponse.json(veilleFormatee, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la veille:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la veille' },
      { status: 500 }
    );
  }
}
