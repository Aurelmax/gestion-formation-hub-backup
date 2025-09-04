import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour une formation
const formationSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  prerequis: z.string().min(1, 'Les prérequis sont requis'),
  publicConcerne: z.string().min(1, 'Le public concerné est requis'),
  duree: z.string().min(1, 'La durée est requise'),
  horaires: z.string().min(1, 'Les horaires sont requis'),
  objectifsPedagogiques: z.string().min(1, 'Les objectifs pédagogiques sont requis'),
  modalitesAcces: z.string().min(1, 'Les modalités d\'accès sont requises'),
  tarif: z.string().min(1, 'Le tarif est requis'),
  modalitesReglement: z.string().min(1, 'Les modalités de règlement sont requises'),
  contactOrganisme: z.string().min(1, 'Le contact organisme est requis'),
  referentPedagogique: z.string().min(1, 'Le référent pédagogique est requis'),
  referentQualite: z.string().min(1, 'Le référent qualité est requis'),
  modalitesTechniques: z.string().min(1, 'Les modalités techniques sont requises'),
  formateur: z.string().min(1, 'Le formateur est requis'),
  ressourcesDisposition: z.string().min(1, 'Les ressources à disposition sont requises'),
  modalitesEvaluation: z.string().min(1, 'Les modalités d\'évaluation sont requises'),
  sanctionFormation: z.string().min(1, 'La sanction formation est requise'),
  niveauCertification: z.string().min(1, 'Le niveau de certification est requis'),
  delaiAcceptation: z.string().min(1, 'Le délai d\'acceptation est requis'),
  accessibiliteHandicapee: z.string().min(1, 'L\'accessibilité handicapée est requise'),
  cessationAbandon: z.string().min(1, 'Les conditions de cessation abandon sont requises'),
});

export async function GET() {
  try {
    // Récupérer toutes les formations depuis les programmes de formation
    const formations = await prisma.programmeFormation.findMany({
      where: {
        estActif: true
      },
      select: {
        id: true,
        code: true,
        prerequis: true,
        publicConcerne: true,
        duree: true,
        objectifs: true, // Mapping vers objectifsPedagogiques
        modalitesAcces: true,
        prix: true, // Mapping vers tarif
        modalitesReglement: true,
        formateur: true,
        ressourcesDisposition: true,
        modalitesEvaluation: true,
        sanctionFormation: true,
        niveauCertification: true,
        delaiAcceptation: true,
        accessibiliteHandicap: true, // Mapping vers accessibiliteHandicapee
        cessationAbandon: true,
        dateCreation: true,
        dateModification: true,
        created_at: true,
      },
      orderBy: {
        dateCreation: 'desc'
      }
    });

    // Transformer les données pour correspondre à l'interface Frontend
    const formationsTransformed = formations.map(formation => ({
      ...formation,
      objectifsPedagogiques: Array.isArray(formation.objectifs) 
        ? formation.objectifs.join('\n') 
        : formation.objectifs,
      tarif: formation.prix,
      accessibiliteHandicapee: formation.accessibiliteHandicap,
      horaires: "À définir selon le programme", // Valeur par défaut
      contactOrganisme: "contact@gestionmax.com", // Valeur par défaut
      referentPedagogique: formation.formateur,
      referentQualite: "qualité@gestionmax.com", // Valeur par défaut
      modalitesTechniques: formation.modalitesTechniques || "Non spécifié"
    }));

    return NextResponse.json(formationsTransformed);
  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des formations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validation = formationSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    // Créer un nouveau programme de formation basé sur les données de formation
    const nouvelleFormation = await prisma.programmeFormation.create({
      data: {
        code: data.code,
        titre: `Formation ${data.code}`,
        description: data.objectifsPedagogiques,
        type: 'catalogue',
        duree: data.duree,
        prix: data.tarif,
        niveau: 'Tous niveaux',
        participants: '1-12',
        objectifs: [data.objectifsPedagogiques],
        prerequis: data.prerequis,
        publicConcerne: data.publicConcerne,
        contenuDetailleJours: data.objectifsPedagogiques,
        modalites: data.modalitesAcces,
        modalitesAcces: data.modalitesAcces,
        modalitesTechniques: data.modalitesTechniques,
        modalitesReglement: data.modalitesReglement,
        formateur: data.formateur,
        ressourcesDisposition: data.ressourcesDisposition,
        modalitesEvaluation: data.modalitesEvaluation,
        sanctionFormation: data.sanctionFormation,
        niveauCertification: data.niveauCertification,
        delaiAcceptation: data.delaiAcceptation,
        accessibiliteHandicap: data.accessibiliteHandicapee,
        cessationAbandon: data.cessationAbandon,
        estActif: true,
        estVisible: true,
        version: 1
      }
    });

    // Retourner au format attendu par le frontend
    const formationResponse = {
      ...nouvelleFormation,
      objectifsPedagogiques: Array.isArray(nouvelleFormation.objectifs) 
        ? nouvelleFormation.objectifs.join('\n') 
        : nouvelleFormation.objectifs,
      tarif: nouvelleFormation.prix,
      accessibiliteHandicapee: nouvelleFormation.accessibiliteHandicap,
      horaires: "À définir selon le programme",
      contactOrganisme: "contact@gestionmax.com",
      referentPedagogique: nouvelleFormation.formateur,
      referentQualite: "qualité@gestionmax.com",
    };

    return NextResponse.json(formationResponse, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la formation' },
      { status: 500 }
    );
  }
}
