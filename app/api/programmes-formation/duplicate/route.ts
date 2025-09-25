import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';



// Schéma pour la duplication
const duplicateSchema = z.object({
  sourceId: z.string().uuid('ID source invalide'),
  newData: z.object({
    code: z.string().min(1, 'Le code est requis'),
    titre: z.string().min(1, 'Le titre est requis'),
    type: z.enum(['catalogue', 'personnalise']).optional(),
    // Autres champs optionnels peuvent être ajoutés ici
  }).partial()
});

/**
 * POST /api/programmes-formation/duplicate
 * Duplique un programme existant avec de nouvelles données
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Données reçues pour duplication:', data);

    // Validation des données
    const validation = duplicateSchema.safeParse(data);
    
    if (!validation.success) {
      console.log('Erreur de validation:', validation.error.errors);
      return NextResponse.json(
        { 
          error: 'Données invalides pour la duplication',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    const { sourceId, newData } = validation.data;
    const prismaAny = prisma as any;

    // Récupérer le programme source
    const sourceProgramme = await prismaAny.programmes_formation.findUnique({
      where: { id: sourceId },
    });

    if (!sourceProgramme) {
      return NextResponse.json(
        { error: 'Programme source introuvable' },
        { status: 404 }
      );
    }

    // Vérifier si le nouveau code existe déjà
    if (newData.code) {
      const existingProgramme = await prismaAny.programmes_formation.findFirst({
        where: { code: newData.code },
      });

      if (existingProgramme) {
        return NextResponse.json(
          { error: 'Un programme avec ce code existe déjà' },
          { status: 409 }
        );
      }
    }

    // Préparer les données pour la duplication
    const {
      id,
      dateCreation,
      dateModification,
      ...sourceData
    } = sourceProgramme;

    const duplicateData = {
      ...sourceData,
      ...newData,
      type: newData.type || 'personnalise', // Par défaut, une duplication devient personnalisée
      programmeCatalogueId: sourceProgramme.type === 'catalogue' ? sourceId : sourceProgramme.programmeCatalogueId,
      dateCreation: new Date(),
      dateModification: new Date(),
    };

    console.log('Données préparées pour création:', duplicateData);

    // Créer le programme dupliqué
    const duplicatedProgramme = await prismaAny.programmes_formation.create({
      data: duplicateData,
      include: {
        categorie: true,
        programmeCatalogue: {
          select: {
            id: true,
            code: true,
            titre: true
          }
        }
      },
    });

    console.log('Programme dupliqué créé:', duplicatedProgramme.id);

    return NextResponse.json(duplicatedProgramme, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la duplication du programme:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la duplication du programme' },
      { status: 500 }
    );
  }
}