import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
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

    // Préparer les données de mise à jour
    const updateData: any = {};
    
    if (data.statut) updateData.statut = data.statut;
    if (data.priorite) updateData.priorite = data.priorite;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;
    if (data.assignee_id !== undefined) updateData.assigneeId = data.assignee_id;
    if (data.notes_internes !== undefined) updateData.notes_internes = data.notes_internes;
    if (data.date_resolution !== undefined) updateData.date_resolution = data.date_resolution;
    
    // Automatiquement mettre à jour updated_at
    updateData.updated_at = new Date();

    const updatedReclamation = await prisma.reclamation.update({
      where: { id },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(updatedReclamation);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la réclamation' },
      { status: 500 }
    );
  }
}

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
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        actionsCorrectives: true
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
      { error: 'Erreur lors de la récupération de la réclamation' },
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

    await prisma.reclamation.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Réclamation supprimée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la réclamation' },
      { status: 500 }
    );
  }
}