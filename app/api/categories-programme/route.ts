import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation pour une catégorie
const categorieSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  ordre: z.number().int().min(0).optional().default(0),
});

// Schéma de validation des paramètres de requête
const querySchema = z.object({
  search: z.string().optional(),
  includePrograms: z.string().optional().default('false').transform(val => val === 'true'),
});

// GET /api/categories-programme - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  console.log('[API] GET /api/categories-programme - Début de la requête');
  
  try {
    const { searchParams } = new URL(request.url);
    const params = Object.fromEntries(searchParams.entries());
    console.log('[API] Paramètres de la requête:', params);
    
    // Valider les paramètres de la requête
    const { search, includePrograms } = querySchema.parse(params);
    console.log('[API] Paramètres validés:', { search, includePrograms });
    
    // Construire la condition de recherche
    const where: any = {};
    
    if (search) {
      where.OR = [
        { code: { contains: search, mode: 'insensitive' } },
        { titre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Options de requête de base
    const queryOptions: any = {
      where,
      orderBy: [
        { ordre: 'asc' },
        { titre: 'asc' },
      ],
    };

    // Inclure les programmes si demandé
    if (includePrograms) {
      console.log('[API] Inclusion des programmes demandée');
      queryOptions.include = {
        programmes: {
          where: {
            estActif: true,
            estVisible: true,
            type: 'catalogue',
          },
          orderBy: { titre: 'asc' },
        },
      };
    } else {
      console.log('[API] Comptage des programmes demandé');
      queryOptions.include = {
        _count: {
          select: { programmes: true },
        },
      };
    }

    console.log('[API] Options de requête Prisma:', JSON.stringify(queryOptions, null, 2));
    
    const categories = await prisma.categorieProgramme.findMany(queryOptions);
    console.log(`[API] ${categories.length} catégories trouvées`);

    return NextResponse.json({
      success: true,
      data: categories,
    });

  } catch (error) {
    console.error('[API] Erreur:', error);
    
    if (error instanceof z.ZodError) {
      console.error('[API] Erreur de validation:', error.errors);
      return NextResponse.json(
        { 
          success: false, 
          error: 'Erreur de validation des paramètres',
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Une erreur est survenue lors de la récupération des catégories',
        // En développement, on peut inclure plus de détails
        ...(process.env.NODE_ENV === 'development' && { details: error.message })
      },
      { status: 500 }
    );
  } finally {
    console.log('[API] Fin de la requête /api/categories-programme');
  }
}

// GET /api/categories-programme/simple - Récupérer les catégories de programmes
export async function GETSimple() {
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

// POST /api/categories-programme - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validation = categorieSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Vérifier si le code existe déjà
    const existingCategorie = await prisma.categorieProgramme.findUnique({
      where: { code: data.code },
    });

    if (existingCategorie) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce code existe déjà' },
        { status: 409 } // Conflict
      );
    }

    // Création de la catégorie
    const categorie = await prisma.categorieProgramme.create({
      data: {
        code: validation.data.code,
        titre: validation.data.titre,
        description: validation.data.description,
        ordre: validation.data.ordre,
      },
    });

    return NextResponse.json(categorie, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}
