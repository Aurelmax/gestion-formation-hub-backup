import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour d'une formation
const updateFormationSchema = z.object({
  code: z.string().min(1, 'Le code est requis').optional(),
  prerequis: z.string().optional(),
  publicConcerne: z.string().optional(),
  duree: z.string().optional(),
  horaires: z.string().optional(),
  objectifsPedagogiques: z.string().optional(),
  modalitesAcces: z.string().optional(),
  tarif: z.string().optional(),
  modalitesReglement: z.string().optional(),
  contactOrganisme: z.string().optional(),
  referentPedagogique: z.string().optional(),
  referentQualite: z.string().optional(),
  modalitesTechniques: z.string().optional(),
  formateur: z.string().optional(),
  ressourcesDisposition: z.string().optional(),
  modalitesEvaluation: z.string().optional(),
  sanctionFormation: z.string().optional(),
  niveauCertification: z.string().optional(),
  delaiAcceptation: z.string().optional(),
  accessibiliteHandicapee: z.string().optional(),
  cessationAbandon: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    const formation = await prisma.programmeFormation.findUnique({
      where: { id },
      select: {
        id: true,
        code: true,
        prerequis: true,
        publicConcerne: true,
        duree: true,
        objectifs: true,
        modalitesAcces: true,
        prix: true,
        modalitesReglement: true,
        formateur: true,
        ressourcesDisposition: true,
        modalitesEvaluation: true,
        sanctionFormation: true,
        niveauCertification: true,
        delaiAcceptation: true,
        accessibiliteHandicap: true,
        cessationAbandon: true,
        modalitesTechniques: true,
        dateCreation: true,
        dateModification: true,
        created_at: true,
      }
    });
    
    if (!formation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    // Transformer pour le frontend
    const formationTransformed = {
      ...formation,
      objectifsPedagogiques: Array.isArray(formation.objectifs) 
        ? formation.objectifs.join('\n') 
        : formation.objectifs,
      tarif: formation.prix,
      accessibiliteHandicapee: formation.accessibiliteHandicap,
      horaires: "À définir selon le programme",
      contactOrganisme: "contact@gestionmax.com",
      referentPedagogique: formation.formateur,
      referentQualite: "qualité@gestionmax.com",
    };

    return NextResponse.json(formationTransformed);
  } catch (error) {
    console.error('Erreur lors de la récupération de la formation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération de la formation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();
    
    // Validation des données
    const validation = updateFormationSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    // Vérifier que la formation existe
    const existingFormation = await prisma.programmeFormation.findUnique({
      where: { id }
    });
    
    if (!existingFormation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour avec mapping
    const updateData: any = {};
    
    if (data.code) updateData.code = data.code;
    if (data.prerequis) updateData.prerequis = data.prerequis;
    if (data.publicConcerne) updateData.publicConcerne = data.publicConcerne;
    if (data.duree) updateData.duree = data.duree;
    if (data.objectifsPedagogiques) {
      updateData.objectifs = [data.objectifsPedagogiques];
      updateData.description = data.objectifsPedagogiques;
    }
    if (data.modalitesAcces) {
      updateData.modalitesAcces = data.modalitesAcces;
      updateData.modalites = data.modalitesAcces;
    }
    if (data.tarif) updateData.prix = data.tarif;
    if (data.modalitesReglement) updateData.modalitesReglement = data.modalitesReglement;
    if (data.formateur) updateData.formateur = data.formateur;
    if (data.ressourcesDisposition) updateData.ressourcesDisposition = data.ressourcesDisposition;
    if (data.modalitesEvaluation) updateData.modalitesEvaluation = data.modalitesEvaluation;
    if (data.sanctionFormation) updateData.sanctionFormation = data.sanctionFormation;
    if (data.niveauCertification) updateData.niveauCertification = data.niveauCertification;
    if (data.delaiAcceptation) updateData.delaiAcceptation = data.delaiAcceptation;
    if (data.accessibiliteHandicapee) updateData.accessibiliteHandicap = data.accessibiliteHandicapee;
    if (data.cessationAbandon) updateData.cessationAbandon = data.cessationAbandon;
    if (data.modalitesTechniques) updateData.modalitesTechniques = data.modalitesTechniques;
    
    updateData.dateModification = new Date();

    const updatedFormation = await prisma.programmeFormation.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        code: true,
        prerequis: true,
        publicConcerne: true,
        duree: true,
        objectifs: true,
        modalitesAcces: true,
        prix: true,
        modalitesReglement: true,
        formateur: true,
        ressourcesDisposition: true,
        modalitesEvaluation: true,
        sanctionFormation: true,
        niveauCertification: true,
        delaiAcceptation: true,
        accessibiliteHandicap: true,
        cessationAbandon: true,
        modalitesTechniques: true,
        dateCreation: true,
        dateModification: true,
        created_at: true,
      }
    });

    // Transformer pour le frontend
    const formationResponse = {
      ...updatedFormation,
      objectifsPedagogiques: Array.isArray(updatedFormation.objectifs) 
        ? updatedFormation.objectifs.join('\n') 
        : updatedFormation.objectifs,
      tarif: updatedFormation.prix,
      accessibiliteHandicapee: updatedFormation.accessibiliteHandicap,
      horaires: "À définir selon le programme",
      contactOrganisme: "contact@gestionmax.com",
      referentPedagogique: updatedFormation.formateur,
      referentQualite: "qualité@gestionmax.com",
    };

    return NextResponse.json(formationResponse);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la formation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour de la formation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Vérifier que la formation existe
    const existingFormation = await prisma.programmeFormation.findUnique({
      where: { id }
    });
    
    if (!existingFormation) {
      return NextResponse.json(
        { error: 'Formation non trouvée' },
        { status: 404 }
      );
    }

    // Soft delete en désactivant plutôt qu'en supprimant
    await prisma.programmeFormation.update({
      where: { id },
      data: { 
        estActif: false,
        dateModification: new Date()
      }
    });

    return NextResponse.json(
      { message: 'Formation désactivée avec succès' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur lors de la suppression de la formation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression de la formation' },
      { status: 500 }
    );
  }
}