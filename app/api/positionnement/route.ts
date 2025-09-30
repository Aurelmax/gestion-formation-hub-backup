import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la création d'une demande de positionnement
const positionnementRequestSchema = z.object({
  // Informations du bénéficiaire
  nom: z.string().min(1, 'Le nom est requis'),
  prenom: z.string().min(1, 'Le prénom est requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().min(1, 'Le téléphone est requis'),

  // Formation sélectionnée
  formationSelectionnee: z.string().optional(),
  formationTitre: z.string().optional(),

  // Informations personnelles optionnelles
  dateNaissance: z.string().optional().nullable(),
  sexe: z.string().optional(),

  // Situation de handicap
  hasHandicap: z.boolean().optional(),
  detailsHandicap: z.string().optional().nullable(),

  // Adresse
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),

  // Statut professionnel
  statut: z.string().optional(),

  // Expérience et objectifs
  experience: z.string().optional(),
  objectifs: z.string().optional(),
  niveau: z.string().optional(),

  // Date et statut du rendez-vous
  dateRdv: z.string().datetime().optional(),
  status: z.string().default('nouveau'),
  type: z.string().default('positionnement'),
  source: z.string().default('site-internet')
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const beneficiaire = searchParams.get('beneficiaire');

    // Construction du filtre WHERE
    const where: any = {};
    if (status && status !== 'tous') {
      where.status = status;
    }
    if (beneficiaire && beneficiaire !== 'all') {
      where.OR = [
        {
          nomBeneficiaire: {
            contains: beneficiaire,
            mode: 'insensitive'
          }
        },
        {
          prenomBeneficiaire: {
            contains: beneficiaire,
            mode: 'insensitive'
          }
        }
      ];
    }

    const positionnementRequests = await prisma.positionnementRequest.findMany({
      where,
      include: {
        programmesPersonnalises: {
          select: {
            id: true,
            titre: true,
            description: true,
          }
        }
      },
      orderBy: [
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      data: positionnementRequests,
      total: positionnementRequests.length,
      message: 'Demandes de positionnement récupérées avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des demandes de positionnement:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération des demandes de positionnement'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation des données
    const validation = positionnementRequestSchema.safeParse(body);
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

    // Créer la demande de positionnement
    const nouvelleDemandePositionnement = await prisma.positionnementRequest.create({
      data: {
        nomBeneficiaire: data.nom,
        prenomBeneficiaire: data.prenom,
        emailBeneficiaire: data.email,
        formationSelectionnee: data.formationSelectionnee || data.formationTitre || '',
        hasHandicap: data.hasHandicap || false,
        detailsHandicap: data.detailsHandicap,
        attentes: data.objectifs || '',
        dateDispo: data.niveau || 'Non spécifié',
        commentaires: data.experience || null,
        statut: data.status || 'nouveau',
      }
    });

    // Créer le rendez-vous associé si une date est fournie
    if (data.dateRdv) {
      await prisma.rendezvous.create({
        data: {
          nom: data.nom,
          prenom: data.prenom,
          email: data.email,
          telephone: data.telephone || '',
          dateRdv: new Date(data.dateRdv),
          status: 'planifie',
          type: data.type || 'positionnement',
          notes: `Demande de positionnement pour ${data.formationSelectionnee || data.formationTitre || 'formation non spécifiée'}`,
          formationTitre: data.formationSelectionnee || data.formationTitre,
          formationSelectionnee: data.formationSelectionnee || data.formationTitre,
        }
      });
    }

    return NextResponse.json({
      success: true,
      data: nouvelleDemandePositionnement,
      message: 'Demande de positionnement créée avec succès'
    }, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la demande de positionnement:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la création de la demande de positionnement'
      },
      { status: 500 }
    );
  }
}
