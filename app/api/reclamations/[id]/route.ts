import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma pour les mises à jour
const updateReclamationSchema = z.object({
  nom: z.string().min(1).optional(),
  email: z.string().email().optional(),
  telephone: z.string().optional(),
  sujet: z.string().min(1).optional(),
  message: z.string().min(1).optional(),
  statut: z.enum(['nouvelle', 'en_cours', 'resolue', 'fermee']).optional(),
  priorite: z.enum(['basse', 'normale', 'haute', 'urgente']).optional(),
  assigneeId: z.string().uuid().optional(),
  notes_internes: z.string().optional(),
  date_resolution: z.string().datetime().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reclamation = await prisma.reclamation.findUnique({
      where: { id },
      include: {
        assignee: {
          select: { id: true, nom: true, prenom: true, email: true }
        },
        actionsCorrectives: {
          select: { id: true, titre: true, statut: true }
        }
      }
    });

    if (!reclamation) {
      return NextResponse.json(
        { error: 'Réclamation non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(reclamation);
  } catch (error) {
    console.error('Erreur lors de la récupération de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la réclamation' },
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
    const validation = updateReclamationSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Vérifier que la réclamation existe
    const existingReclamation = await prisma.reclamation.findUnique({
      where: { id }
    });

    if (!existingReclamation) {
      return NextResponse.json(
        { error: 'Réclamation non trouvée' },
        { status: 404 }
      );
    }

    // Mettre à jour la réclamation
    const updatedReclamation = await prisma.reclamation.update({
      where: { id },
      data: {
        ...validation.data,
        updatedAt: new Date()
      },
      include: {
        assignee: {
          select: { id: true, nom: true, prenom: true, email: true }
        }
      }
    });

    return NextResponse.json(updatedReclamation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de la réclamation' },
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

    // Vérifier que la réclamation existe
    const existingReclamation = await prisma.reclamation.findUnique({
      where: { id }
    });

    if (!existingReclamation) {
      return NextResponse.json(
        { error: 'Réclamation non trouvée' },
        { status: 404 }
      );
    }

    // Supprimer la réclamation
    await prisma.reclamation.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Réclamation supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la réclamation' },
      { status: 500 }
    );
  }
}