import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import { z } from 'zod';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Interface pour les paramètres de requête
type QueryParams = {
  type?: 'catalogue' | 'sur-mesure';
  version?: string;
  fields?: string[];
  categorieId?: string;
  estActif?: boolean;
  search?: string;
  page: number;
  limit: number;
  includeInactive?: boolean;
};

// Schéma de validation avec Zod
const programmeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  type: z.enum(['catalogue', 'sur-mesure']),
  typeProgramme: z.string().optional(),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().min(1, 'La description est requise'),
  duree: z.string().min(1, 'La durée est requise'),
  prix: z.string().min(1, 'Le prix est requis'),
  niveau: z.string().min(1, 'Le niveau est requis'),
  participants: z.string().min(1, 'Le nombre de participants est requis'),
  objectifs: z.array(z.string()).min(1, 'Au moins un objectif est requis'),
  prerequis: z.string().min(1, 'Les prérequis sont requis'),
  publicConcerne: z.string().min(1, 'Le public concerné est requis'),
  contenuDetailleJours: z.string().min(1, 'Le contenu détaillé est requis'),
  modalites: z.string().min(1, 'Les modalités sont requises'),
  modalitesAcces: z.string().min(1, 'Les modalités d\'accès sont requises'),
  modalitesTechniques: z.string().min(1, 'Les modalités techniques sont requises'),
  modalitesReglement: z.string().min(1, 'Les modalités de règlement sont requises'),
  formateur: z.string().min(1, 'Le formateur est requis'),
  ressourcesDisposition: z.string().min(1, 'Les ressources à disposition sont requises'),
  modalitesEvaluation: z.string().min(1, 'Les modalités d\'évaluation sont requises'),
  sanctionFormation: z.string().min(1, 'La sanction de formation est requise'),
  niveauCertification: z.string().min(1, 'Le niveau de certification est requis'),
  delaiAcceptation: z.string().min(1, 'Le délai d\'acceptation est requis'),
  accessibiliteHandicap: z.string().min(1, 'L\'accessibilité handicap est requise'),
  cessationAbandon: z.string().min(1, 'Les conditions de cessation d\'abandon sont requises'),
  categorieId: z.string().uuid('ID de catégorie invalide').optional(),
  pictogramme: z.string().optional(),
  estActif: z.boolean().optional().default(true),
  estVisible: z.boolean().optional().default(true),
  version: z.number().int().positive().optional().default(1),
  objectifsSpecifiques: z.string().optional(),
  programmeUrl: z.string().url('URL de programme invalide').optional(),
  ressourcesAssociees: z.array(z.string()).optional().default([]),
  beneficiaireId: z.string().uuid('ID de bénéficiaire invalide').optional(),
  formateurId: z.string().uuid('ID de formateur invalide').optional(),
  programmeSourId: z.string().uuid('ID de programme source invalide').optional(),
});

// Schéma de validation des paramètres de requête
const queryParamsSchema = z.object({
  type: z.enum(['catalogue', 'sur-mesure']).optional(),
  version: z.string().regex(/^\d+$/).optional(),
  fields: z.string().optional().transform(fields => 
    fields ? fields.split(',').map(f => f.trim()) : []
  ),
  categorieId: z.string().uuid('ID de catégorie invalide').optional(),
  estActif: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  search: z.string().optional(),
  page: z.preprocess(
    val => parseInt(String(val || '1'), 10),
    z.number().int().positive()
  ).default(1),
  limit: z.preprocess(
    val => Math.min(100, parseInt(String(val || '20'), 10)),
    z.number().int().min(1).max(100)
  ).default(20),
  includeInactive: z.string().transform(val => val === 'true').optional(),
});

/**
 * @swagger
 * /api/programmes-formation:
 *   get:
 *     summary: Récupère la liste des programmes de formation
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [catalogue, sur-mesure]
 *         description: Type de programme (catalogue ou sur-mesure)
 *       - in: query
 *         name: version
 *         schema:
 *           type: integer
 *         description: Numéro de version spécifique
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Champs supplémentaires à inclure (séparés par des virgules)
 *       - in: query
 *         name: categorieId
 *         schema:
 *           type: string
 *         description: ID de catégorie
 *       - in: query
 *         name: estActif
 *         schema:
 *           type: boolean
 *         description: Filtre les programmes actifs
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Recherche par mots-clés
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de résultats par page
 *       - in: query
 *         name: includeInactive
 *         schema:
 *           type: boolean
 *         description: Inclut les programmes inactifs
 *     responses:
 *       200:
 *         description: Liste des programmes de formation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProgrammeFormation'
 */
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
    
    // Construire le filtre Prisma
    const where: Prisma.ProgrammeFormationWhereInput = {};
    
    if (params.type) where.type = params.type;
    if (params.categorieId) where.categorieId = params.categorieId;
    if (params.estActif !== undefined) where.estActif = params.estActif;
    
    if (params.search) {
      const search = params.search.toLowerCase();
      where.OR = [
        { titre: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    if (params.includeInactive !== true) {
      where.estActif = true;
    }

    // Sélection des champs
    const select: Prisma.ProgrammeFormationSelect = {
      id: true,
      code: true,
      titre: true,
      description: true,
      type: true,
      version: true,
      estActif: true,
      estVisible: true,  // Ajouté pour la gestion de visibilité
      dateCreation: true,  // Ajouté pour le tri
      categorie: {
        select: { id: true, titre: true }
      }
    };

    // Ajouter les champs optionnels si demandés
    if (Array.isArray(params.fields) && params.fields.includes('details')) {
      select.contenuDetailleJours = true;
      select.objectifs = true;
      select.prerequis = true;
      select.modalites = true;
    }

    // Pagination avec valeurs par défaut robustes
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    // Exécuter les requêtes en parallèle
    const [items, total] = await Promise.all([
      prisma.programmeFormation.findMany({
        where,
        select,
        skip,
        take,
        orderBy: { dateCreation: 'desc' },
      }),
      prisma.programmeFormation.count({ where })
    ]);

    // Calculer le nombre total de pages
    const totalPages = Math.ceil(total / params.limit);

    // Créer la réponse avec une structure claire
    const responseData = {
      data: items,
      pagination: {
        total,
        totalPages,
        currentPage: params.page,
        itemsPerPage: params.limit,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1
      }
    };

    // Gestion du cache
    const etag = createHash('md5')
      .update(JSON.stringify(responseData))
      .digest('hex');

    const ifNoneMatch = request.headers.get('If-None-Match');
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    const response = NextResponse.json(responseData);
    
    // Configuration du cache
    const cacheControl = params.type === 'catalogue' 
      ? 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=3600'
      : 'public, max-age=300, s-maxage=900, stale-while-revalidate=300';
    
    response.headers.set('Cache-Control', cacheControl);
    response.headers.set('ETag', etag);
    response.headers.set('Last-Modified', new Date().toUTCString());

    return response;
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Paramètres de requête invalides', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des programmes' },
      { status: 500 }
    );
  }
}

// POST /api/programmes-formation - Créer un nouveau programme
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validation = programmeSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Vérifier si le code existe déjà
    const existingProgramme = await prisma.programmeFormation.findFirst({
      where: { code: data.code },
    });

    if (existingProgramme) {
      return NextResponse.json(
        { error: 'Un programme avec ce code existe déjà' },
        { status: 409 } // Conflict
      );
    }

    // Création du programme
    const { categorieId, programmeSourId, ...programmeData } = validation.data;
    
    // Préparation des données conformes au type ProgrammeFormationCreateInput
    // Tous les champs obligatoires sont validés par Zod
    const createData = {
      ...programmeData,
      code: programmeData.code,
      type: programmeData.type,
      titre: programmeData.titre,
      description: programmeData.description,
      duree: programmeData.duree,
      prix: programmeData.prix,
      niveau: programmeData.niveau,
      participants: programmeData.participants,
      objectifs: programmeData.objectifs,
      prerequis: programmeData.prerequis,
      publicConcerne: programmeData.publicConcerne,
      contenuDetailleJours: programmeData.contenuDetailleJours,
      modalites: programmeData.modalites,
      modalitesAcces: programmeData.modalitesAcces,
      modalitesTechniques: programmeData.modalitesTechniques,
      modalitesReglement: programmeData.modalitesReglement,
      formateur: programmeData.formateur,
      ressourcesDisposition: programmeData.ressourcesDisposition,
      modalitesEvaluation: programmeData.modalitesEvaluation,
      sanctionFormation: programmeData.sanctionFormation,
      niveauCertification: programmeData.niveauCertification,
      delaiAcceptation: programmeData.delaiAcceptation,
      accessibiliteHandicap: programmeData.accessibiliteHandicap,
      cessationAbandon: programmeData.cessationAbandon,
      dateCreation: new Date(),
      dateModification: new Date(),
      categorie: categorieId ? { connect: { id: categorieId } } : undefined,
      programmeSource: programmeSourId ? { connect: { id: programmeSourId } } : undefined,
    } satisfies Prisma.ProgrammeFormationCreateInput;

    const programme = await prisma.programmeFormation.create({
      data: createData,
      include: {
        categorie: true,
        ...(programmeSourId ? { programmeSour: true } : {}),
      },
    });

    return NextResponse.json(programme, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du programme:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la création du programme' },
      { status: 500 }
    );
  }
}
