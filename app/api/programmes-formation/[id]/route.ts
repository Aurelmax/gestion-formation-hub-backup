import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation partiel pour les mises à jour
const updateProgrammeSchema = z.object({
  code: z.string().min(1, 'Le code est requis').optional(),
  type: z.enum(['catalogue', 'sur-mesure']).optional(),
  typeProgramme: z.string().optional(),
  titre: z.string().min(1, 'Le titre est requis').optional(),
  description: z.string().min(1, 'La description est requise').optional(),
  duree: z.string().min(1, 'La durée est requise').optional(),
  prix: z.string().min(1, 'Le prix est requis').optional(),
  niveau: z.string().min(1, 'Le niveau est requis').optional(),
  participants: z.string().min(1, 'Le nombre de participants est requis').optional(),
  objectifs: z.array(z.string()).min(1, 'Au moins un objectif est requis').optional(),
  prerequis: z.string().min(1, 'Les prérequis sont requis').optional(),
  publicConcerne: z.string().min(1, 'Le public concerné est requis').optional(),
  contenuDetailleJours: z.string().min(1, 'Le contenu détaillé est requis').optional(),
  modalites: z.string().min(1, 'Les modalités sont requises').optional(),
  modalitesAcces: z.string().min(1, 'Les modalités d\'accès sont requises').optional(),
  modalitesTechniques: z.string().min(1, 'Les modalités techniques sont requises').optional(),
  modalitesReglement: z.string().min(1, 'Les modalités de règlement sont requises').optional(),
  formateur: z.string().min(1, 'Le formateur est requis').optional(),
  ressourcesDisposition: z.string().min(1, 'Les ressources à disposition sont requises').optional(),
  modalitesEvaluation: z.string().min(1, 'Les modalités d\'évaluation sont requises').optional(),
  sanctionFormation: z.string().min(1, 'La sanction de formation est requise').optional(),
  niveauCertification: z.string().min(1, 'Le niveau de certification est requis').optional(),
  delaiAcceptation: z.string().min(1, 'Le délai d\'acceptation est requis').optional(),
  accessibiliteHandicap: z.string().min(1, 'L\'accessibilité handicap est requise').optional(),
  cessationAbandon: z.string().min(1, 'Les conditions de cessation d\'abandon sont requises').optional(),
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
        programmeSource: {
          select: {
            id: true,
            code: true,
            titre: true,
            version: true,
          },
        },
        versionsDerivees: {
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

    // Vérifier si le programme est utilisé dans des dossiers
    const usedInDossiers = await prisma.dossierFormation.count({
      where: {
        OR: [
          { programmeId: id },
          { programmePersonnalise: { some: { formationId: id } } },
        ],
      },
    });

    if (usedInDossiers > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer ce programme car il est utilisé dans un ou plusieurs dossiers',
          usedInDossiers,
        },
        { status: 400 }
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
