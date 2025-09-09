import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { PROGRAMME_TYPE_ENUM } from '@/types/programmes';

const prisma = new PrismaClient();

// Schéma de validation partiel pour les mises à jour - Version assouplie
const updateProgrammeSchema = z.object({
  // Champs essentiels
  code: z.string().min(1, 'Le code est requis').optional(),
  type: z.enum(PROGRAMME_TYPE_ENUM).optional(),
  titre: z.string().min(1, 'Le titre est requis').optional(),
  description: z.string().min(1, 'La description est requise').optional(),
  duree: z.string().min(1, 'La durée est requise').optional(),
  prix: z.string().min(1, 'Le prix est requis').optional(),
  
  // Champs optionnels sans validation stricte
  typeProgramme: z.string().optional(),
  niveau: z.string().optional(),
  participants: z.string().optional(),
  objectifs: z.array(z.string()).optional(),
  prerequis: z.string().optional(),
  publicConcerne: z.string().optional(),
  contenuDetailleJours: z.string().optional(),
  modalites: z.string().optional(),
  modalitesAcces: z.string().optional(),
  modalitesTechniques: z.string().optional(),
  modalitesReglement: z.string().optional(),
  formateur: z.string().optional(),
  ressourcesDisposition: z.string().optional(),
  modalitesEvaluation: z.string().optional(),
  sanctionFormation: z.string().optional(),
  niveauCertification: z.string().optional(),
  delaiAcceptation: z.string().optional(),
  accessibiliteHandicap: z.string().optional(),
  cessationAbandon: z.string().optional(),
  categorieId: z.string().uuid('ID de catégorie invalide').optional().nullable(),
  pictogramme: z.string().optional(),
  estActif: z.boolean().optional(),
  estVisible: z.boolean().optional(),
  version: z.number().int().positive().optional(),
  objectifsSpecifiques: z.string().optional(),
  programmeUrl: z.string().url('URL de programme invalide').optional().nullable(),
  ressourcesAssociees: z.array(z.string()).optional(),
  beneficiaireId: z.string().uuid('ID de bénéficiaire invalide').optional().nullable(),
  formateurId: z.string().uuid('ID de formateur invalide').optional().nullable(),
  programmeSourId: z.string().uuid('ID de programme source invalide').optional().nullable(),
});

// GET /api/programmes-formation/[id] - Récupérer un programme par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const programme = await prisma.programmeFormation.findUnique({
      where: { id },
      include: {
        categorie: true,
        programmeCatalogue: {
          select: {
            id: true,
            code: true,
            titre: true,
            version: true,
          },
        },
        programmesDerivés: {
          select: {
            id: true,
            code: true,
            titre: true,
            version: true,
          },
        },
      },
    });

    if (!programme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(programme);
  } catch (error) {
    console.error('Erreur lors de la récupération du programme:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du programme' },
      { status: 500 }
    );
  }
}

// PUT /api/programmes-formation/[id] - Mettre à jour complètement un programme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Vérifier si le programme existe
    const existingProgramme = await prisma.programmeFormation.findUnique({
      where: { id },
    });

    if (!existingProgramme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Validation des données
    const validation = updateProgrammeSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Vérifier si le code est déjà utilisé par un autre programme
    if (data.code && data.code !== existingProgramme.code) {
      const codeExists = await prisma.programmeFormation.findFirst({
        where: {
          code: data.code,
          id: { not: id },
        },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Un programme avec ce code existe déjà' },
          { status: 409 } // Conflict
        );
      }
    }

    // Mise à jour du programme
    const updatedProgramme = await prisma.programmeFormation.update({
      where: { id },
      data: {
        ...validation.data,
        dateModification: new Date(),
      },
      include: {
        categorie: true,
      },
    });

    return NextResponse.json(updatedProgramme);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du programme:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du programme' },
      { status: 500 }
    );
  }
}

// PATCH /api/programmes-formation/[id] - Mettre à jour partiellement un programme
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    
    // Vérifier si le programme existe
    const existingProgramme = await prisma.programmeFormation.findUnique({
      where: { id },
    });

    if (!existingProgramme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Validation des données
    const validation = updateProgrammeSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Vérifier si le code est déjà utilisé par un autre programme
    if (data.code && data.code !== existingProgramme.code) {
      const codeExists = await prisma.programmeFormation.findFirst({
        where: {
          code: data.code,
          id: { not: id },
        },
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Un programme avec ce code existe déjà' },
          { status: 409 } // Conflict
        );
      }
    }

    // Mise à jour partielle du programme
    const updatedProgramme = await prisma.programmeFormation.update({
      where: { id },
      data: {
        ...validation.data,
        dateModification: new Date(),
      },
      include: {
        categorie: true,
      },
    });

    return NextResponse.json(updatedProgramme);
  } catch (error) {
    console.error('Erreur lors de la mise à jour partielle du programme:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la mise à jour du programme' },
      { status: 500 }
    );
  }
}

// DELETE /api/programmes-formation/[id] - Supprimer un programme
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier si le programme existe
    const existingProgramme = await prisma.programmeFormation.findUnique({
      where: { id },
    });

    if (!existingProgramme) {
      return NextResponse.json(
        { error: 'Programme non trouvé' },
        { status: 404 }
      );
    }

    // Vérifier si le programme a des dossiers liés (via la relation prisma)
    const programmeWithDossiers = await prisma.programmeFormation.findUnique({
      where: { id },
      include: {
        dossiers: true,
      }
    });

    if (programmeWithDossiers?.dossiers && programmeWithDossiers.dossiers.length > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer ce programme car il est utilisé dans un ou plusieurs dossiers',
          usedInDossiers: programmeWithDossiers.dossiers.length,
        },
        { status: 409 }
      );
    }

    // Supprimer le programme
    await prisma.programmeFormation.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression du programme:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression du programme' },
      { status: 500 }
    );
  }
}
