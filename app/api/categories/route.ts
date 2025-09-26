import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';
// Temporarily disabled caching imports to fix module resolution
// import { cache, CACHE_CONFIG, createCacheKey, withCache } from '@/lib/cache';
// import { createCachedResponse, CACHE_STRATEGIES } from '@/lib/http-cache';

// Schéma de validation pour une catégorie
const categorieSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  ordre: z.number().int().min(0).default(0)
});

// GET /api/categories - Récupérer toutes les catégories (cache temporairement désactivé)
export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

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

    // Cache invalidation temporarily disabled
    // cache.delete('api:categories');
    console.log('✅ Category created successfully');

    return NextResponse.json(categorie, { status: 201 });

      );
    }
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
}

    );
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

  );
}
}

    );
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
