import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour modification de veille
const veilleUpdateSchema = z.object({
  titre: z.string().min(1, 'Le titre est requis').optional(),
  description: z.string().min(1, 'La description est requise').optional(),
  type: z.enum(['reglementaire', 'metier', 'innovation']).optional(),
  statut: z.enum(['nouvelle', 'en-cours', 'terminee']).optional(),
  avancement: z.number().min(0).max(100).optional(),
  dateEcheance: z.string().datetime().optional().nullable(),
});

// GET /api/veille/[id] - Récupérer une veille spécifique
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const veille = await prisma.veille.findUnique({
      where: { id: params.id }
    });

    if (!veille) {
      return NextResponse.json(
        {
          success: false,
          error: 'Veille non trouvée'
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: veille
    });

  } catch (error) {
    console.error('Erreur lors de la récupération de la veille:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération de la veille'
      },
      { status: 500 }
    );
  }
}

// PUT /api/veille/[id] - Modifier une veille
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();

    // Validation des données
    const validation = veilleUpdateSchema.safeParse(body);
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

    // Vérifier que la veille existe
    const veilleExistante = await prisma.veille.findUnique({
      where: { id: params.id }
    });

    if (!veilleExistante) {
      return NextResponse.json(
        {
          success: false,
          error: 'Veille non trouvée'
        },
        { status: 404 }
      );
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};

    if (data.titre !== undefined) updateData.titre = data.titre;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.type !== undefined) updateData.type = data.type;
    if (data.statut !== undefined) updateData.statut = data.statut;
    if (data.avancement !== undefined) updateData.avancement = data.avancement;
    if (data.dateEcheance !== undefined) {
      updateData.dateEcheance = data.dateEcheance ? new Date(data.dateEcheance) : null;
    }

    const veilleModifiee = await prisma.veille.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: veilleModifiee,
      message: 'Veille modifiée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la modification de la veille:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la modification de la veille'
      },
      { status: 500 }
    );
  }
}

// DELETE /api/veille/[id] - Supprimer une veille
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier que la veille existe
    const veilleExistante = await prisma.veille.findUnique({
      where: { id: params.id }
    });

    if (!veilleExistante) {
      return NextResponse.json(
        {
          success: false,
          error: 'Veille non trouvée'
        },
        { status: 404 }
      );
    }

    await prisma.veille.delete({
      where: { id: params.id }
    });

    return NextResponse.json({
      success: true,
      message: 'Veille supprimée avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression de la veille:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la suppression de la veille'
      },
      { status: 500 }
    );
  }
}