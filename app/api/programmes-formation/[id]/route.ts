import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PROGRAMME_TYPE_ENUM } from '@/types/programmes';
import { prisma } from '@/lib/prisma';

// Variable centralisée pour accès direct à la table SQL mappée
const prismaAny = prisma as any;

// Schéma de validation partiel pour mise à jour
const updateProgrammeSchema = z.object({
  code: z.string().min(1, 'Le code est requis').optional(),
  type: z.enum(PROGRAMME_TYPE_ENUM).optional(),
  titre: z.string().min(1, 'Le titre est requis').optional(),
  description: z.string().optional(),
  duree: z.string().min(1, 'La durée est requise').optional(),
  prix: z.string().min(1, 'Le prix est requis').optional(),
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
  categorieId: z.string().uuid().optional().nullable(),
  pictogramme: z.string().optional(),
  estActif: z.boolean().optional(),
  estVisible: z.boolean().optional(),
  version: z.number().int().positive().optional(),
  objectifsSpecifiques: z.string().optional().nullable(),
  programmeUrl: z.string().url().optional().nullable(),
  ressourcesAssociees: z.array(z.string()).optional(),
  beneficiaireId: z.string().uuid().optional().nullable(),
  formateurId: z.string().uuid().optional().nullable(),
  programmeSourId: z.string().uuid().optional().nullable(),
  positionnementRequestId: z.string().uuid().optional().nullable(),
});

// ------------------------
// GET /api/programmes-formation/[id]
// ------------------------
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const programme = await prismaAny.programmes_formation.findUnique({
      where: { id },
      include: {
        categorie: true,
        programmeCatalogue: { select: { id: true, code: true, titre: true, version: true } },
        programmesDérivés: { select: { id: true, code: true, titre: true, version: true } },
      },
    });

    if (!programme) {
      return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    }

    return NextResponse.json(programme);
  } catch (error) {
    console.error('Erreur GET programmes-formation:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération du programme' },
      { status: 500 }
    );
  }
}

// ------------------------
// PUT /api/programmes-formation/[id]
// ------------------------
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existingProgramme = await prismaAny.programmes_formation.findUnique({ where: { id } });
    if (!existingProgramme) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });

    const validation = updateProgrammeSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ error: 'Données invalides', details: validation.error.errors }, { status: 400 });
    }

    if (data.code && data.code !== existingProgramme.code) {
      const codeExists = await prismaAny.programmes_formation.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (codeExists) return NextResponse.json({ error: 'Un programme avec ce code existe déjà' }, { status: 409 });
    }

    const updatedProgramme = await prismaAny.programmes_formation.update({
      where: { id },
      data: { ...validation.data, date_modification: new Date() },
      include: { categorie: true },
    });

    return NextResponse.json(updatedProgramme);
  } catch (error) {
    console.error('Erreur PUT programmes-formation:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du programme' }, { status: 500 });
  }
}

// ------------------------
// PATCH /api/programmes-formation/[id]
// ------------------------
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const existingProgramme = await prismaAny.programmes_formation.findUnique({ where: { id } });
    if (!existingProgramme) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });

    const validation = updateProgrammeSchema.safeParse(data);
    if (!validation.success) return NextResponse.json({ error: 'Données invalides', details: validation.error.errors }, { status: 400 });

    if (data.code && data.code !== existingProgramme.code) {
      const codeExists = await prismaAny.programmes_formation.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (codeExists) return NextResponse.json({ error: 'Un programme avec ce code existe déjà' }, { status: 409 });
    }

    const updatedProgramme = await prismaAny.programmes_formation.update({
      where: { id },
      data: { ...validation.data, date_modification: new Date() },
      include: { categorie: true },
    });

    return NextResponse.json(updatedProgramme);
  } catch (error) {
    console.error('Erreur PATCH programmes-formation:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour partielle du programme' }, { status: 500 });
  }
}

// ------------------------
// DELETE /api/programmes-formation/[id]
// ------------------------
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existingProgramme = await prismaAny.programmes_formation.findUnique({ where: { id } });
    if (!existingProgramme) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });

    const programmeWithDossiers = await prismaAny.programmes_formation.findUnique({
      where: { id },
      include: { dossiers: true },
    });

    if (programmeWithDossiers?.dossiers?.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer ce programme, utilisé dans un ou plusieurs dossiers', usedInDossiers: programmeWithDossiers.dossiers.length },
        { status: 409 }
      );
    }

    await prismaAny.programmes_formation.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur DELETE programmes-formation:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du programme' }, { status: 500 });
  }
}
