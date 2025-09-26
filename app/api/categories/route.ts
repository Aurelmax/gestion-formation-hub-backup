import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { cache, CACHE_CONFIG, createCacheKey, withCache } from '@/lib/cache';
import { createCachedResponse, CACHE_STRATEGIES } from '@/lib/http-cache';

// Schéma de validation pour une catégorie
const categorieSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  ordre: z.number().int().min(0).default(0)
});

// GET /api/categories - Récupérer toutes les catégories avec cache optimisé
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const cacheKey = createCacheKey('/api/categories', Object.fromEntries(url.searchParams));

    const categories = await withCache(
      async () => {
        return await prisma.categories_programme.findMany({
          orderBy: { ordre: 'asc' },
          select: {
            id: true,
            code: true,
            titre: true,
            description: true,
            ordre: true,
            _count: {
              select: {
                programmes_formation: {
                  where: { est_actif: true, est_visible: true }
                }
              }
            }
          }
        });
      },
      cacheKey,
      CACHE_CONFIG.categories
    );

    // Return response with optimized cache headers
    return createCachedResponse(categories, CACHE_STRATEGIES.static);
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
    const existing = await prisma.categories_programme.findUnique({
      where: { code: validatedData.code }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce code existe déjà' },
        { status: 400 }
      );
    }

    const categorie = await prisma.categories_programme.create({
      data: {
        ...validatedData
      }
    });

    // Invalider le cache des catégories après création
    cache.delete('api:categories');
    console.log('🗑️ Cache invalidated: categories after POST');

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

// GET /api/categories/programmes - Récupérer les catégories de programmes avec cache
export async function GETProgrammes() {
  try {
    const cacheKey = createCacheKey('/api/categories/programmes');

    const categories = await withCache(
      async () => {
        return await prisma.categories_programme.findMany({
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
      },
      cacheKey,
      CACHE_CONFIG.categories
    );

    return createCachedResponse(categories, CACHE_STRATEGIES.static);
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
