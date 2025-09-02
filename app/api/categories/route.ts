import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour une catégorie
const categorieSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  ordre: z.number().int().min(0).default(0)
});

// GET /api/categories - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.categorieProgramme.findMany({
      orderBy: { ordre: 'asc' },
      select: {
        id: true,
        code: true,
        titre: true,
        description: true,
        ordre: true,
        _count: {
          select: {
            programmes: {
              where: { estActif: true, estVisible: true }
            }
          }
        }
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

// POST /api/categories - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const validatedData = categorieSchema.parse(data);

    // Vérifier si le code existe déjà
    const existing = await prisma.categorieProgramme.findUnique({
      where: { code: validatedData.code }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce code existe déjà' },
        { status: 400 }
      );
    }

    const categorie = await prisma.categorieProgramme.create({
      data: {
        ...validatedData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    return NextResponse.json(categorie, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}

// GET /api/categories/programmes - Récupérer les catégories de programmes
export async function GETProgrammes() {
  try {
    const categories = await prisma.categorieProgramme.findMany({
      select: {
        id: true,
        titre: true,
        code: true,
        description: true,
        ordre: true
      },
      orderBy: {
        ordre: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur API catégories programme:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : String(error)
          : undefined
      },
      { status: 500 }
    );
  }
}

// Mettre à jour le schéma pour inclure la validation des paramètres de requête
declare global {
  interface RequestInit {
    next?: {
      revalidate?: number | false;
      tags?: string[];
    };
  }
}
