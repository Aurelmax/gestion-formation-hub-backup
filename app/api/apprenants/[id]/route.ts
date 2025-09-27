import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour d'un apprenant
const updateApprenantSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères').optional(),
  email: z.string().email('Adresse email invalide').optional(),
  telephone: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const apprenant = await prisma.user.findUnique({
      where: { 
        id,
        role: 'apprenant'
      },
      select: {
        id: true,
        name: true,
        email: true,
        telephone: true,
        createdAt: true,
      }
    });
    
    if (!apprenant) {
      return NextResponse.json(
        { error: 'Apprenant non trouvé' },
        { status: 404 }
      );
    }

    // Transformer pour le frontend
    const apprenantTransformed = {
      id: apprenant.id,
      nom: apprenant.name,
      email: apprenant.email,
      telephone: apprenant.telephone,
      createdAt: apprenant.createdAt,
    };

    return NextResponse.json(apprenantTransformed);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'apprenant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de l\'apprenant' },
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
    const validation = updateApprenantSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    // Vérifier que l'apprenant existe
    const existingApprenant = await prisma.user.findUnique({
      where: { 
        id,
        role: 'apprenant'
      }
    });
    
    if (!existingApprenant) {
      return NextResponse.json(
        { error: 'Apprenant non trouvé' },
        { status: 404 }
      );
    }

    // Si l'email change, vérifier qu'il n'existe pas déjà
    if (data.email && data.email !== existingApprenant.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      });

      if (emailExists) {
        return NextResponse.json(
          { error: 'Un utilisateur avec cet email existe déjà' },
          { status: 409 }
        );
      }
    }

    // Préparer les données de mise à jour avec mapping
    const updateData: any = {};
    
    if (data.nom) updateData.name = data.nom;
    if (data.email) updateData.email = data.email;
    if (data.telephone !== undefined) updateData.telephone = data.telephone;

    const updatedApprenant = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        telephone: true,
        createdAt: true,
      }
    });

    // Transformer pour le frontend
    const apprenantResponse = {
      id: updatedApprenant.id,
      nom: updatedApprenant.name,
      email: updatedApprenant.email,
      telephone: updatedApprenant.telephone,
      createdAt: updatedApprenant.createdAt,
    };

    return NextResponse.json(apprenantResponse);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'apprenant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de l\'apprenant' },
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
    
    // Vérifier que l'apprenant existe
    const existingApprenant = await prisma.user.findUnique({
      where: { 
        id,
        role: 'apprenant'
      }
    });
    
    if (!existingApprenant) {
      return NextResponse.json(
        { error: 'Apprenant non trouvé' },
        { status: 404 }
      );
    }

    // Soft delete en désactivant plutôt qu'en supprimant
    await prisma.user.update({
      where: { id },
      data: { 
        isActive: false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Apprenant désactivé avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'apprenant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de l\'apprenant' },
      { status: 500 }
    );
  }
}