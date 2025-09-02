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
    .nullable()
    .optional()
    .transform(val => val || undefined),

  search: z
    .string()
    .trim()
    .min(1, "Le terme de recherche ne peut pas être vide")
    .max(100, "Le terme de recherche est trop long")
    .nullable()
    .optional()
    .transform(val => val || undefined),

  includeInactive: z
    .union([
      z.literal('true'),
      z.literal('false'),
      z.boolean()
    ])
    .transform(val => val === true || val === 'true')
    .default('false')
    .optional()
});

export async function GET(req: Request) {
  try {
    console.log('Requête reçue sur /api/programmes-formation/par-categorie/groupes');
    const url = new URL(req.url);
    console.log('URL complète:', req.url);
    console.log('Paramètres de recherche:', Object.fromEntries(url.searchParams.entries()));
    
    // Valider et parser les paramètres
    const result = querySchema.safeParse(
      Object.fromEntries(url.searchParams.entries())
    );

    if (!result.success) {
      console.error('Erreur de validation des paramètres:', result.error.flatten());
      return NextResponse.json(
        { 
          error: 'Paramètres de requête invalides',
          details: result.error.flatten() 
        },
        { status: 400 }
      );
    }

    const { page, limit, categorieId, search, includeInactive } = result.data;
    const skip = (page - 1) * limit;

    // Construire la requête Prisma
    const where: any = {
      type: 'catalogue',
      estVisible: true,
      ...(!includeInactive && { estActif: true }),
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

    console.log('Requête Prisma where:', JSON.stringify(where, null, 2));

    try {
      // Exécuter les requêtes en parallèle
      const [programmes, total] = await Promise.all([
        prisma.programmeFormation.findMany({
          where,
          include: {
            categorie: {
              select: {
                id: true,
                titre: true
              }
            }
          },
          orderBy: { dateCreation: 'desc' },
          take: limit,
          skip,
        }),
        prisma.programmeFormation.count({ where })
      ]);

      console.log(`Résultats trouvés: ${programmes.length} sur ${total}`);

      return NextResponse.json({
        data: programmes,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (prismaError) {
      console.error('Erreur Prisma:', prismaError);
      return NextResponse.json(
        { 
          error: 'Erreur de base de données',
          details: process.env.NODE_ENV === 'development' ? prismaError : undefined
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur inattendue:', error);
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
