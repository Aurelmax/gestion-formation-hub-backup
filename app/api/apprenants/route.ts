import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { withAccelerate } from '@prisma/extension-accelerate';
import { z } from 'zod';

  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends(withAccelerate());

// Schéma de validation pour les apprenants (adapté au schéma Prisma)
const apprenantSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
});

export async function GET() {
  try {
    const apprenants = await prisma.apprenant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(apprenants);
  } catch (error) {
    console.error('Erreur lors de la récupération des apprenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des apprenants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validation = apprenantSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    // Vérifier si l'apprenant existe déjà (par email s'il n'y a pas d'unicité sur email)
    const existingApprenant = await prisma.apprenant.findFirst({
      where: { email: validation.data.email },
    });

    if (existingApprenant) {
      return NextResponse.json(
        { error: 'Un apprenant avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Création de l'apprenant
    const nouvelApprenant = await prisma.apprenant.create({
      data: validation.data,
    });

    return NextResponse.json(nouvelApprenant, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'apprenant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'apprenant' },
      { status: 500 }
    );
  }
}
