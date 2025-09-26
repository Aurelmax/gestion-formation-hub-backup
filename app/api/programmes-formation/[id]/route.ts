import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { PROGRAMME_TYPE_ENUM } from '@/types/programmes';
import { prisma } from '@/lib/prisma';
import type { ProgrammeFormation, Prisma } from '@prisma/client';

// ✅ Convention Hybride Stricte - Client Prisma Typé

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

    const programme = await prisma.programmes_formation.findUnique({
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

    const existingProgramme = await prisma.programmes_formation.findUnique({ where: { id } });
    if (!existingProgramme) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });

    const validation = updateProgrammeSchema.safeParse(data);
    if (!validation.success) {
      return NextResponse.json({ error: 'Données invalides', details: validation.error.errors }, { status: 400 });
    }

    console.log('🔍 PUT - Données reçues:', Object.keys(data), data);
    console.log('🔍 PUT - Données validées:', Object.keys(validation.data), validation.data);

    if (data.code && data.code !== existingProgramme.code) {
      const codeExists = await prisma.programmes_formation.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (codeExists) return NextResponse.json({ error: 'Un programme avec ce code existe déjà' }, { status: 409 });
    }

    // Mapper les champs camelCase vers snake_case pour Prisma
    const mappedData: any = { date_modification: new Date() };

    Object.entries(validation.data).forEach(([key, value]) => {
      switch (key) {
        case 'estActif':
          mappedData.est_actif = value;
          break;
        case 'estVisible':
          mappedData.est_visible = value;
          break;
        case 'publicConcerne':
          mappedData.public_concerne = value;
          break;
        case 'contenuDetailleJours':
          mappedData.contenu_detaille_jours = value;
          break;
        case 'modalitesAcces':
          mappedData.modalites_acces = value;
          break;
        case 'modalitesTechniques':
          mappedData.modalites_techniques = value;
          break;
        case 'modalitesReglement':
          mappedData.modalites_reglement = value;
          break;
        case 'modalitesEvaluation':
          mappedData.modalites_evaluation = value;
          break;
        case 'sanctionFormation':
          mappedData.sanction_formation = value;
          break;
        case 'niveauCertification':
          mappedData.niveau_certification = value;
          break;
        case 'delaiAcceptation':
          mappedData.delai_acceptation = value;
          break;
        case 'accessibiliteHandicap':
          mappedData.accessibilite_handicap = value;
          break;
        case 'cessationAbandon':
          mappedData.cessation_abandon = value;
          break;
        case 'ressourcesDisposition':
          mappedData.ressources_disposition = value;
          break;
        case 'categorieId':
          mappedData.categorie_id = value;
          break;
        case 'beneficiaireId':
          mappedData.beneficiaire_id = value;
          break;
        case 'formateurId':
          mappedData.formateur_id = value;
          break;
        case 'programmeSourId':
          mappedData.programme_source_id = value;
          break;
        case 'positionnementRequestId':
          mappedData.positionnement_request_id = value;
          break;
        case 'typeProgramme':
          mappedData.type_programme = value;
          break;
        case 'programmeUrl':
          mappedData.programme_url = value;
          break;
        case 'objectifsSpecifiques':
          mappedData.objectifs_specifiques = value;
          break;
        case 'ressourcesAssociees':
          mappedData.ressources_associees = value;
          break;
        default:
          mappedData[key] = value;
      }
    });

    console.log('🔍 PUT - Données mappées pour Prisma:', Object.keys(mappedData), mappedData);

    const updatedProgramme = await prisma.programmes_formation.update({
      where: { id },
      data: mappedData,
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

    const existingProgramme = await prisma.programmes_formation.findUnique({ where: { id } });
    if (!existingProgramme) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });

    const validation = updateProgrammeSchema.safeParse(data);
    if (!validation.success) return NextResponse.json({ error: 'Données invalides', details: validation.error.errors }, { status: 400 });

    if (data.code && data.code !== existingProgramme.code) {
      const codeExists = await prisma.programmes_formation.findFirst({
        where: { code: data.code, id: { not: id } },
      });
      if (codeExists) return NextResponse.json({ error: 'Un programme avec ce code existe déjà' }, { status: 409 });
    }

    // Mapper les champs camelCase vers snake_case pour Prisma
    const mappedData: any = { date_modification: new Date() };

    Object.entries(validation.data).forEach(([key, value]) => {
      switch (key) {
        case 'estActif':
          mappedData.est_actif = value;
          break;
        case 'estVisible':
          mappedData.est_visible = value;
          break;
        case 'publicConcerne':
          mappedData.public_concerne = value;
          break;
        case 'contenuDetailleJours':
          mappedData.contenu_detaille_jours = value;
          break;
        case 'modalitesAcces':
          mappedData.modalites_acces = value;
          break;
        case 'modalitesTechniques':
          mappedData.modalites_techniques = value;
          break;
        case 'modalitesReglement':
          mappedData.modalites_reglement = value;
          break;
        case 'modalitesEvaluation':
          mappedData.modalites_evaluation = value;
          break;
        case 'sanctionFormation':
          mappedData.sanction_formation = value;
          break;
        case 'niveauCertification':
          mappedData.niveau_certification = value;
          break;
        case 'delaiAcceptation':
          mappedData.delai_acceptation = value;
          break;
        case 'accessibiliteHandicap':
          mappedData.accessibilite_handicap = value;
          break;
        case 'cessationAbandon':
          mappedData.cessation_abandon = value;
          break;
        case 'ressourcesDisposition':
          mappedData.ressources_disposition = value;
          break;
        case 'categorieId':
          mappedData.categorie_id = value;
          break;
        case 'beneficiaireId':
          mappedData.beneficiaire_id = value;
          break;
        case 'formateurId':
          mappedData.formateur_id = value;
          break;
        case 'programmeSourId':
          mappedData.programme_source_id = value;
          break;
        case 'positionnementRequestId':
          mappedData.positionnement_request_id = value;
          break;
        case 'typeProgramme':
          mappedData.type_programme = value;
          break;
        case 'programmeUrl':
          mappedData.programme_url = value;
          break;
        case 'objectifsSpecifiques':
          mappedData.objectifs_specifiques = value;
          break;
        case 'ressourcesAssociees':
          mappedData.ressources_associees = value;
          break;
        default:
          mappedData[key] = value;
      }
    });

    const updatedProgramme = await prisma.programmes_formation.update({
      where: { id },
      data: mappedData,
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
    const existingProgramme = await prisma.programmes_formation.findUnique({ where: { id } });
    if (!existingProgramme) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });

    const programmeWithDossiers = await prisma.programmes_formation.findUnique({
      where: { id },
      include: { dossiers: true },
    });

    if (programmeWithDossiers?.dossiers?.length > 0) {
      return NextResponse.json(
        { error: 'Impossible de supprimer ce programme, utilisé dans un ou plusieurs dossiers', usedInDossiers: programmeWithDossiers.dossiers.length },
        { status: 409 }
      );
    }

    await prisma.programmes_formation.delete({ where: { id } });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Erreur DELETE programmes-formation:', error);
    return NextResponse.json({ error: 'Erreur lors de la suppression du programme' }, { status: 500 });
  }
}
