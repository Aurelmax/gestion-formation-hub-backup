import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';



// Schéma pour les mises à jour
const updateActionCorrectiveSchema = z.object({
  titre: z.string().min(3).optional(),
  description: z.string().min(10).optional(),
  statut: z.enum(['planifiee', 'en_cours', 'terminee', 'annulee']).optional(),
  origineType: z.enum(['reclamation', 'incident', 'audit', 'veille']).optional(),
  origineRef: z.string().optional(),
  origineDate: z.string().datetime().optional(),
  origineResume: z.string().optional(),
  priorite: z.enum(['faible', 'moyenne', 'haute', 'critique']).optional(),
  avancement: z.number().min(0).max(100).optional(),
  responsableNom: z.string().optional(),
  responsableEmail: z.string().email().optional(),
  dateEcheance: z.string().datetime().optional(),
  indicateurEfficacite: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const action = await prisma.actionCorrective.findUnique({
      where: { id },
      include: {
        reclamation: {
          select: { id: true, titre: true, statut: true }
        },
        historiqueActions: {
          orderBy: { dateAction: 'desc' },
          take: 10
        }
      }
    });

    if (!action) {
      return NextResponse.json(
        { error: 'Action corrective non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(action);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'action corrective:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de l\'action corrective' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    // Validation des données
    const validation = updateActionCorrectiveSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Vérifier que l'action corrective existe
    const existingAction = await prisma.actionCorrective.findUnique({
      where: { id }
    });

    if (!existingAction) {
      return NextResponse.json(
        { error: 'Action corrective non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour l'action corrective
    const updatedAction = await prisma.actionCorrective.update({
      where: { id },
      data: {
        ...validation.data,
        origineDate: validation.data.origineDate ? new Date(validation.data.origineDate) : undefined,
        dateEcheance: validation.data.dateEcheance ? new Date(validation.data.dateEcheance) : undefined,
        updatedAt: new Date()
      },
      include: {
        reclamation: {
          select: { id: true, titre: true, statut: true }
        }
      }
    });

    // Ajouter une entrée dans l'historique
    await prisma.historiqueActionCorrective.create({
      data: {
        actionCorrectiveId: id,
        action: 'Modification',
        utilisateur: 'Système',
        commentaire: 'Action corrective mise à jour',
      },
    });

    return NextResponse.json(updatedAction);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'action corrective:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de l\'action corrective' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier que l'action corrective existe
    const existingAction = await prisma.actionCorrective.findUnique({
      where: { id }
    });

    if (!existingAction) {
      return NextResponse.json(
        { error: 'Action corrective non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer l'historique associé
    await prisma.historiqueActionCorrective.deleteMany({
      where: { actionCorrectiveId: id }
    });

    // Supprimer l'action corrective
    await prisma.actionCorrective.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Action corrective supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'action corrective:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de l\'action corrective' },
      { status: 500 }
    );
  }
}