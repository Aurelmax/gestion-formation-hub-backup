import { NextRequest, NextResponse } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

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

export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Unauthorized" },
    { status: 401 }
  );
    }

    console.log('Requête reçue sur /api/programmes-formation/par-categorie/groupes');

    // Récupérer toutes les catégories avec leurs programmes actifs et visibles
    const categories = await prisma.categorieProgramme.findMany({
      orderBy: { ordre: 'asc' },
      include: {
        programmes: {
          where: {
            type: 'catalogue',
            estActif: true,
            estVisible: true
          },
          orderBy: { dateCreation: 'desc' }
        }
      }
    });

    console.log(`Catégories trouvées: ${categories.length}`);
    
    // Transformer les données au format attendu par le front-end
    const formattedCategories = categories
      .filter(category => category.programmes.length > 0) // Ne garder que les catégories avec des programmes
      .map(category => ({
        id: category.id,
        titre: category.titre,
        description: category.description,
        formations: category.programmes.map(programme => ({
          id: programme.id,
          titre: programme.titre,
          description: programme.description,
          duree: programme.duree,
          prix: programme.prix,
          niveau: programme.niveau,
          participants: programme.participants,
          objectifs: programme.objectifs || [],
          prerequis: programme.prerequis,
          modalites: programme.modalites,
          programmeUrl: `/formations/${programme.id}`
        }))
      }));

    console.log('Catégories formatées:', formattedCategories.map(cat => `${cat.titre}: ${cat.formations.length} programmes`));

    return NextResponse.json(formattedCategories);

    );
  }
}

    );
  }
