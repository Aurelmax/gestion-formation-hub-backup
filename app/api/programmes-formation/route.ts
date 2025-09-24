import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { createHash } from 'crypto';
import { PROGRAMME_TYPE_ENUM } from '@/types/programmes';
import { prisma } from '@/lib/prisma';

// Schéma de validation avec Zod - Version assouplie pour compatibilité frontend
const programmeSchema = z.object({
  // Champs essentiels obligatoires
  code: z.string().min(1, 'Le code est requis'),
  type: z.enum(PROGRAMME_TYPE_ENUM),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().default(''),
  duree: z.string().min(1, 'La durée est requise'),
  prix: z.string().min(1, 'Le prix est requis'),
  
  // Champs de base optionnels avec valeurs par défaut
  typeProgramme: z.string().optional(),
  niveau: z.string().optional().default('Non spécifié'),
  participants: z.string().optional().default('Non spécifié'),
  objectifs: z.array(z.string()).optional().default([]),
  prerequis: z.string().optional().default('Aucun prérequis spécifique'),
  publicConcerne: z.string().optional().default('Tout public'),
  contenuDetailleJours: z.string().default(''),
  
  // Champs de modalités optionnels avec valeurs par défaut
  modalites: z.string().optional().default('En présentiel individuel'),
  modalitesAcces: z.string().optional().default('Inscription en ligne ou par téléphone'),
  modalitesTechniques: z.string().optional().default('Matériel fourni sur place'),
  modalitesReglement: z.string().optional().default('Paiement par virement bancaire'),
  
  // Champs pédagogiques optionnels
  formateur: z.string().optional().default('Formateur expert'),
  ressourcesDisposition: z.string().optional().default('Support de cours et exercices pratiques'),
  modalitesEvaluation: z.string().optional().default('Évaluation continue et QCM final'),
  sanctionFormation: z.string().optional().default('Attestation de fin de formation'),
  niveauCertification: z.string().optional().default(''),
  
  // Champs administratifs optionnels
  delaiAcceptation: z.string().optional().default('15 jours avant le début de formation'),
  accessibiliteHandicap: z.string().optional().default('Locaux accessibles PMR - Nous consulter pour adaptations spécifiques'),
  cessationAbandon: z.string().optional().default('Remboursement au prorata selon conditions générales'),
  
  // Champs de configuration
  categorieId: z.string().uuid('ID de catégorie invalide').optional().nullable(),
  pictogramme: z.string().optional().default('📚'),
  estActif: z.boolean().optional().default(true),
  estVisible: z.boolean().optional().default(true),
  version: z.number().int().positive().optional().default(1),
  objectifsSpecifiques: z.string().optional().nullable(),
  programmeUrl: z.string().url('URL de programme invalide').optional().nullable(),
  ressourcesAssociees: z.array(z.string()).optional().default([]),
  beneficiaireId: z.string().uuid('ID de bénéficiaire invalide').optional().nullable(),
  formateurId: z.string().uuid('ID de formateur invalide').optional().nullable(),
  programmeCatalogueId: z.string().uuid('ID de programme catalogue invalide').optional().nullable(),
  positionnementRequestId: z.string().uuid('ID de demande de positionnement invalide').optional().nullable(),
});

// Schéma de validation des paramètres de requête
const queryParamsSchema = z.object({
  type: z.enum(PROGRAMME_TYPE_ENUM).optional(),
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
 *           enum: [catalogue, personnalise]
 *         description: Type de programme (catalogue ou personnalise)
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
      modalites: true,  // Ajouté pour afficher les modalités
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
    // Debug: Log des headers reçus
    const contentType = request.headers.get('content-type');
    console.log('📄 Content-Type reçu:', contentType);

    const data = await request.json();

    // Debug: Log des données reçues et leur type
    console.log('📋 Données reçues pour création programme:', JSON.stringify(data, null, 2));
    console.log('🔍 Type des données:', typeof data);

    // Validation des données
    const validation = programmeSchema.safeParse(data);

    if (!validation.success) {
      console.error('❌ Validation échouée:', validation.error.errors);
      return NextResponse.json(
        {
          error: 'Données invalides',
          details: validation.error.errors
        },
        { status: 400 }
      );
    }

    // Vérifier si le code existe déjà (utiliser findFirst car code n'est plus unique)
    const existingProgramme = await prisma.programmeFormation.findFirst({
      where: { code: validation.data.code },
    });

    if (existingProgramme) {
      return NextResponse.json(
        { error: 'Un programme avec ce code existe déjà' },
        { status: 409 } // Conflict
      );
    }

    // Création du programme
    const programme = await prisma.programmeFormation.create({
      data: validation.data as any, // Type cast temporaire pour éviter les conflits de types
      include: {
        categorie: true,
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
