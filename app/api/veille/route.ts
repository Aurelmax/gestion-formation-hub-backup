import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour création/modification de veille
const veilleSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  type: z.enum(['reglementaire', 'metier', 'innovation']),
  statut: z.enum(['nouvelle', 'en-cours', 'terminee']).optional().default('nouvelle'),
  avancement: z.number().min(0).max(100).optional().default(0),
  dateEcheance: z.string().datetime().optional(),
});

// GET /api/veille - Récupérer toutes les veilles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const statut = searchParams.get('statut');

    // Construction du filtre WHERE
    const where: any = {};
    if (type) where.type = type;
    if (statut) where.statut = statut;

    const veilles = await prisma.veille.findMany({
      where,
      orderBy: [
        { dateCreation: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: veilles,
      total: veilles.length
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des veilles:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des veilles'
      },
      { status: 500 }
    );
  }
}

// POST /api/veille - Créer une nouvelle veille
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validation = veilleSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Conversion de la date d'échéance si fournie
    const veilleData: any = {
      titre: data.titre,
      description: data.description,
      type: data.type,
      statut: data.statut,
      avancement: data.avancement,
    };

    if (data.dateEcheance) {
      veilleData.dateEcheance = new Date(data.dateEcheance);
    }

    const nouvelleVeille = await prisma.veille.create({
      data: veilleData
    });

    return NextResponse.json({
      success: true,
      data: nouvelleVeille,
      message: 'Veille créée avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la veille:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la création de la veille'
      },
      { status: 500 }
    );
  }
}
