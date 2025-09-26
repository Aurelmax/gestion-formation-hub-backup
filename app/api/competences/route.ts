import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';



// Schéma de validation pour les compétences
const competenceSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  description: z.string().min(1, 'La description est requise'),
  categorie: z.string().min(1, 'La catégorie est requise'),
  domaineDeveloppement: z.string().min(1, 'Le domaine de développement est requis'),
  niveauActuel: z.number().int().min(0).max(5, 'Le niveau actuel doit être entre 0 et 5'),
  objectifNiveau: z.number().int().min(0).max(5, 'L\'objectif niveau doit être entre 0 et 5'),
  statut: z.enum(['planifie', 'en-cours', 'acquis', 'valide']).default('planifie'),
  actionPrevue: z.string().min(1, 'L\'action prévue est requise'),
  plateformeFomation: z.string().optional(),
  lienFormation: z.string().url('Lien formation invalide').optional(),
  typePreuve: z.string().min(1, 'Le type de preuve est requis'),
  contenuPreuve: z.string().min(1, 'Le contenu de preuve est requis'),
  formateurId: z.string().uuid().optional(),
});

// Schéma pour les paramètres de requête
const queryParamsSchema = z.object({
  categorie: z.string().optional(),
  statut: z.enum(['planifie', 'en-cours', 'acquis', 'valide']).optional(),
  formateurId: z.string().uuid().optional(),
  domaineDeveloppement: z.string().optional(),
  page: z.preprocess(
    val => parseInt(String(val || '1'), 10),
    z.number().int().positive()
  ).default(1),
  limit: z.preprocess(
    val => Math.min(100, parseInt(String(val || '20'), 10)),
    z.number().int().min(1).max(100)
  ).default(20),
});

export async function GET(request: NextRequest) {
  try {
    // Valider les paramètres de requête
    const validation = queryParamsSchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Paramètres invalides', details: validation.error.format() },
        { status: 400 }
      );
    }

    const params = validation.data;
    
    // Construire le filtre
    const where: any = {};
    if (params.categorie) where.categorie = params.categorie;
    if (params.statut) where.statut = params.statut;
    if (params.formateurId) where.formateurId = params.formateurId;
    if (params.domaineDeveloppement) where.domaineDeveloppement = params.domaineDeveloppement;

    // Pagination
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    // Récupérer les compétences
    const [competences, total] = await Promise.all([
      prisma.competence.findMany({
        where,
        skip,
        take,
        orderBy: { dateCreation: 'desc' },
      }),
      prisma.competence.count({ where })
    ]);

    const totalPages = Math.ceil(total / params.limit);

    return NextResponse.json({
      data: competences,
      pagination: {
        total,
        totalPages,
        currentPage: params.page,
        itemsPerPage: params.limit,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1
      }
    });
    
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des compétences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validation = competenceSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Créer la compétence avec mapping explicite
    const competence = await prisma.competence.create({
      data: {
        nom: validation.data.nom,
        description: validation.data.description,
        categorie: validation.data.categorie,
        domaine_developpement: validation.data.domaineDeveloppement,
        niveau_actuel: validation.data.niveauActuel,
        objectif_niveau: validation.data.objectifNiveau,
        statut: validation.data.statut,
        action_prevue: validation.data.actionPrevue,
        plateforme_formation: validation.data.plateformeFomation,
        lien_formation: validation.data.lienFormation,
        type_preuve: validation.data.typePreuve,
        contenu_preuve: validation.data.contenuPreuve,
        formateur_id: validation.data.formateurId,
      },
    });

    return NextResponse.json(competence, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la compétence' },
      { status: 500 }
    );
  }
}
