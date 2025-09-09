import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends(withAccelerate());

// Schéma de validation pour les compétences
const competenceUpdateSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').optional(),
  description: z.string().min(1, 'La description est requise').optional(),
  categorie: z.string().min(1, 'La catégorie est requise').optional(),
  domaineDeveloppement: z.string().min(1, 'Le domaine de développement est requis').optional(),
  niveauActuel: z.number().int().min(0).max(5, 'Le niveau actuel doit être entre 0 et 5').optional(),
  objectifNiveau: z.number().int().min(0).max(5, 'L\'objectif niveau doit être entre 0 et 5').optional(),
  statut: z.enum(['planifie', 'en-cours', 'acquis', 'valide']).optional(),
  actionPrevue: z.string().min(1, 'L\'action prévue est requise').optional(),
  plateformeFomation: z.string().optional(),
  lienFormation: z.string().url('Lien formation invalide').optional(),
  typePreuve: z.string().min(1, 'Le type de preuve est requis').optional(),
  contenuPreuve: z.string().min(1, 'Le contenu de preuve est requis').optional(),
  formateurId: z.string().uuid().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const competence = await prisma.competence.findUnique({
      where: { id },
    });

    if (!competence) {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(competence);
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la compétence' },
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
    const validation = competenceUpdateSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Mettre à jour la compétence
    const competence = await prisma.competence.update({
      where: { id },
      data: {
        ...validation.data,
        dateModification: new Date(),
      },
    });

    return NextResponse.json(competence);
    
  } catch (error) {
    if ((error as any)?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la compétence' },
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
    
    await prisma.competence.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Compétence supprimée avec succès' });
  } catch (error) {
    if ((error as any)?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Compétence non trouvée' },
        { status: 404 }
      );
    }
    
    console.error('Erreur lors de la suppression de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la compétence' },
      { status: 500 }
    );
  }
}