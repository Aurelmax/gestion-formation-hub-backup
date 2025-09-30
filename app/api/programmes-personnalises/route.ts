import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour création de programme personnalisé
const programmePersonnaliseSchema = z.object({
  formationId: z.string().uuid('ID de formation invalide').optional(),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  contenu: z.string().min(1, 'Le contenu est requis').optional(),
  duree: z.string().min(1, 'La durée est requise').optional(),
  objectifsSpecifiques: z.string().min(1, 'Les objectifs spécifiques sont requis').optional(),
  evaluationSur: z.string().min(1, 'L\'évaluation est requise').optional(),
  positionnementRequestId: z.string().uuid('ID de demande de positionnement invalide').optional(),
  accessibiliteHandicap: z.string().optional(),
  cessationAnticipee: z.string().optional(),
  delaiAcceptation: z.string().optional(),
  delaiAcces: z.string().optional(),
  formateur: z.string().optional(),
  horaires: z.string().optional(),
  modalitesAcces: z.string().optional(),
  modalitesEvaluation: z.string().optional(),
  modalitesReglement: z.string().optional(),
  modalitesTechniques: z.string().optional(),
  niveauCertification: z.string().optional(),
  prerequis: z.string().optional(),
  publicConcerne: z.string().optional(),
  referentPedagogique: z.string().optional(),
  referentQualite: z.string().optional(),
  ressourcesDisposition: z.string().optional(),
  sanctionFormation: z.string().optional(),
  tarif: z.string().optional(),
});

// GET /api/programmes-personnalises - Récupérer tous les programmes personnalisés
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut');
    const beneficiaire = searchParams.get('beneficiaire');

    // Construction du filtre WHERE
    const where: any = {};
    if (statut && statut !== 'tous') {
      // Mapper les statuts pour ProgrammePersonnalise
      where.createdAt = { gte: new Date('1970-01-01') }; // Tous les programmes
    }
    if (beneficiaire && beneficiaire !== 'all') {
      where.positionnementRequest = {
        nomBeneficiaire: {
          contains: beneficiaire,
          mode: 'insensitive'
        }
      };
    }

    const programmesPersonnalises = await prisma.programmePersonnalise.findMany({
      where,
      include: {
        formation: {
          select: {
            id: true,
            libelle: true,
            code: true,
          }
        },
        positionnementRequest: {
          select: {
            id: true,
            nomBeneficiaire: true,
            prenomBeneficiaire: true,
            formationSelectionnee: true,
            createdAt: true,
          }
        },
        rendezvous: {
          select: {
            id: true,
            dateRdv: true,
            status: true,
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    // Formatter les données pour correspondre à l'interface attendue
    const formattedData = programmesPersonnalises.map(prog => ({
      id: prog.id,
      titre: prog.titre,
      description: prog.description,
      type: 'sur-mesure',
      dateCreation: prog.createdAt.toISOString(),
      dateModification: prog.updatedAt.toISOString(),
      contenu: prog.contenu,
      duree: prog.duree,
      objectifsSpecifiques: prog.objectifsSpecifiques,
      evaluationSur: prog.evaluationSur,
      statut: 'valide', // Sera déterminé par la logique métier
      estValide: true,
      beneficiaire: prog.positionnementRequest
        ? `${prog.positionnementRequest.prenomBeneficiaire} ${prog.positionnementRequest.nomBeneficiaire}`
        : null,
      rendezvousId: prog.positionnementRequestId || null,
      formationId: prog.formationId,
      formation: prog.formation,
      // Champs réglementaires
      accessibiliteHandicap: prog.accessibiliteHandicap,
      cessationAbandon: prog.cessationAnticipee,
      delaiAcceptation: prog.delaiAcceptation,
      delaiAcces: prog.delaiAcces,
      formateur: prog.formateur,
      horaires: prog.horaires,
      modalitesAcces: prog.modalitesAcces,
      modalitesEvaluation: prog.modalitesEvaluation,
      modalitesReglement: prog.modalitesReglement,
      modalitesTechniques: prog.modalitesTechniques,
      niveauCertification: prog.niveauCertification,
      prerequis: prog.prerequis,
      publicConcerne: prog.publicConcerne,
      referentPedagogique: prog.referentPedagogique,
      referentQualite: prog.referentQualite,
      ressourcesDisposition: prog.ressourcesDisposition,
      sanctionFormation: prog.sanctionFormation,
      prix: prog.tarif,
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
      total: formattedData.length,
      message: 'Programmes personnalisés récupérés avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des programmes personnalisés:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des programmes personnalisés'
      },
      { status: 500 }
    );
  }
}

// POST /api/programmes-personnalises - Créer un nouveau programme personnalisé
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validation = programmePersonnaliseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Vérifier que la formation existe si un formationId est fourni
    if (data.formationId) {
      const formation = await prisma.formation.findUnique({
        where: { id: data.formationId }
      });

      if (!formation) {
        return NextResponse.json(
          {
            success: false,
            error: 'Formation non trouvée'
          },
          { status: 404 }
        );
      }
    }

    // Vérifier que la demande de positionnement existe si fournie
    if (data.positionnementRequestId) {
      const positionnementRequest = await prisma.positionnementRequest.findUnique({
        where: { id: data.positionnementRequestId }
      });

      if (!positionnementRequest) {
        return NextResponse.json(
          {
            success: false,
            error: 'Demande de positionnement non trouvée'
          },
          { status: 404 }
        );
      }
    }

    // Créer le programme personnalisé
    const nouveauProgramme = await prisma.programmePersonnalise.create({
      data: {
        formationId: data.formationId || null,
        titre: data.titre,
        description: data.description,
        contenu: data.contenu || '',
        duree: data.duree || '',
        objectifsSpecifiques: data.objectifsSpecifiques || '',
        evaluationSur: data.evaluationSur || '',
        positionnementRequestId: data.positionnementRequestId || null,
        accessibiliteHandicap: data.accessibiliteHandicap,
        cessationAnticipee: data.cessationAnticipee,
        delaiAcceptation: data.delaiAcceptation,
        delaiAcces: data.delaiAcces,
        formateur: data.formateur,
        horaires: data.horaires,
        modalitesAcces: data.modalitesAcces,
        modalitesEvaluation: data.modalitesEvaluation,
        modalitesReglement: data.modalitesReglement,
        modalitesTechniques: data.modalitesTechniques,
        niveauCertification: data.niveauCertification,
        prerequis: data.prerequis,
        publicConcerne: data.publicConcerne,
        referentPedagogique: data.referentPedagogique,
        referentQualite: data.referentQualite,
        ressourcesDisposition: data.ressourcesDisposition,
        sanctionFormation: data.sanctionFormation,
        tarif: data.tarif,
      },
      include: {
        formation: {
          select: {
            id: true,
            libelle: true,
            code: true,
          }
        },
        positionnementRequest: {
          select: {
            id: true,
            nomBeneficiaire: true,
            prenomBeneficiaire: true,
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      data: nouveauProgramme,
      message: 'Programme personnalisé créé avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création du programme personnalisé:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la création du programme personnalisé'
      },
      { status: 500 }
    );
  }
}