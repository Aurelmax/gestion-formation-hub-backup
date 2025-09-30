import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour les paramètres de requête du catalogue public
const catalogueQuerySchema = z.object({
  categorieId: z.string().uuid().optional(),
  search: z.string().optional(),
  niveau: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

// GET /api/catalogue/programmes - Récupérer les programmes visibles du catalogue public
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validation des paramètres
    const queryParams = catalogueQuerySchema.parse({
      categorieId: searchParams.get('categorieId') || undefined,
      search: searchParams.get('search') || undefined,
      niveau: searchParams.get('niveau') || undefined,
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
    });

    // Construction des filtres WHERE
    const where: any = {
      AND: [
        { estActif: true },        // Seulement les programmes actifs
        { estVisible: true },      // Seulement les programmes visibles
        { type: 'catalogue' }      // Seulement les programmes catalogue (publics)
      ]
    };

    // Filtre par catégorie
    if (queryParams.categorieId) {
      where.AND.push({ categorieId: queryParams.categorieId });
    }

    // Filtre par niveau
    if (queryParams.niveau) {
      where.AND.push({ niveau: { contains: queryParams.niveau, mode: 'insensitive' } });
    }

    // Filtre de recherche
    if (queryParams.search) {
      where.AND.push({
        OR: [
          { titre: { contains: queryParams.search, mode: 'insensitive' } },
          { description: { contains: queryParams.search, mode: 'insensitive' } },
          { objectifs: { hasSome: [queryParams.search] } },
          { publicConcerne: { contains: queryParams.search, mode: 'insensitive' } }
        ]
      });
    }

    // Pagination
    const skip = (queryParams.page - 1) * queryParams.limit;
    const take = queryParams.limit;

    // Exécuter les requêtes
    const [programmes, total, categories] = await Promise.all([
      prisma.programmeFormation.findMany({
        where,
        select: {
          id: true,
          code: true,
          titre: true,
          description: true,
          type: true,
          duree: true,
          prix: true,
          niveau: true,
          participants: true,
          objectifs: true,
          prerequis: true,
          publicConcerne: true,
          pictogramme: true,
          dateCreation: true,
          dateModification: true,
          programmeUrl: true,
          categorie: {
            select: {
              id: true,
              titre: true,
              description: true,
              code: true
            }
          }
        },
        skip,
        take,
        orderBy: [
          { categorie: { ordre: 'asc' } },
          { titre: 'asc' }
        ]
      }),
      prisma.programmeFormation.count({ where }),
      prisma.categorieProgramme.findMany({
        where: {
          programmes: {
            some: {
              estActif: true,
              estVisible: true,
              type: 'catalogue'
            }
          }
        },
        select: {
          id: true,
          titre: true,
          description: true,
          code: true,
          _count: {
            select: {
              programmes: {
                where: {
                  estActif: true,
                  estVisible: true,
                  type: 'catalogue'
                }
              }
            }
          }
        },
        orderBy: { ordre: 'asc' }
      })
    ]);

    // Formater les programmes pour le composant ProgrammeCard
    const programmesFormatted = programmes.map(prog => ({
      id: prog.id,
      code: prog.code,
      titre: prog.titre,
      description: prog.description,
      type: 'catalogue' as const,
      dateCreation: prog.dateCreation.toISOString(),
      dateModification: prog.dateModification?.toISOString(),
      duree: prog.duree,
      niveau: prog.niveau,
      participantsMax: parseInt(prog.participants) || 0,
      prix: parseFloat(prog.prix) || 0,
      objectifs: prog.objectifs,
      prerequis: prog.prerequis,
      publicConcerne: prog.publicConcerne,
      pictogramme: prog.pictogramme,
      programmeUrl: prog.programmeUrl,
      categorieProgramme: prog.categorie ? {
        id: prog.categorie.id,
        titre: prog.categorie.titre,
        description: prog.categorie.description,
        couleur: '#3B82F6' // Couleur par défaut, à enrichir si nécessaire
      } : undefined
    }));

    const totalPages = Math.ceil(total / queryParams.limit);

    const response = NextResponse.json({
      success: true,
      data: programmesFormatted,
      categories: categories.map(cat => ({
        id: cat.id,
        titre: cat.titre,
        description: cat.description,
        code: cat.code,
        count: cat._count.programmes
      })),
      pagination: {
        total,
        totalPages,
        currentPage: queryParams.page,
        itemsPerPage: queryParams.limit,
        hasNextPage: queryParams.page < totalPages,
        hasPreviousPage: queryParams.page > 1
      },
      meta: {
        filters: queryParams,
        totalVisible: total
      }
    });

    // Cache optimisé pour le catalogue public
    response.headers.set('Cache-Control', 'public, max-age=900, s-maxage=3600, stale-while-revalidate=1800');
    response.headers.set('Last-Modified', new Date().toUTCString());

    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération du catalogue:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Paramètres de requête invalides',
          details: error.errors
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération du catalogue'
      },
      { status: 500 }
    );
  }
}