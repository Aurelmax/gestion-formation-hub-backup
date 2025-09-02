import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schéma de validation des paramètres de requête
export const querySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, "Le numéro de page doit être un nombre positif")
    .transform(Number)
    .refine((n) => n > 0, {
      message: "Le numéro de page doit être supérieur à 0"
    })
    .default('1'),

  limit: z
    .string()
    .regex(/^\d+$/, "La limite doit être un nombre positif")
    .transform(Number)
    .refine((n) => n > 0 && n <= 100, {
      message: "La limite doit être comprise entre 1 et 100"
    })
    .default('6'),

  categorieId: z
    .string()
    .uuid("L'ID de catégorie doit être un UUID valide")
    .optional(),

  search: z
    .string()
    .trim()
    .max(100, "Le terme de recherche est trop long")
    .optional()
    .transform(val => val || undefined),
});

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    
    // Valider et parser les paramètres
    const result = querySchema.safeParse(
      Object.fromEntries(url.searchParams.entries())
    );

    if (!result.success) {
      return NextResponse.json(
        { 
          error: 'Paramètres de requête invalides',
          details: result.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { page, limit, categorieId, search } = result.data;
    const skip = (page - 1) * limit;

    // Construire la requête Prisma
    const where: any = {
      type: 'catalogue',
      estVisible: true,
      estActif: true,
    };
    
    if (categorieId) {
      where.categorieId = categorieId;
    }
    
    if (search) {
      where.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { objectifs: { hasSome: [search] } }
      ];
    }

    // Exécuter les requêtes en parallèle
    const [programmes, total] = await Promise.all([
      prisma.programmeFormation.findMany({
        where,
        include: {
          categorie: {
            select: {
              id: true,
              titre: true,
              description: true,
              code: true
            }
          }
        },
        orderBy: { dateCreation: 'desc' },
        take: limit,
        skip,
      }),
      prisma.programmeFormation.count({ where })
    ]);

    return NextResponse.json({
      data: programmes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Erreur API programmes par catégorie:', error);
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
