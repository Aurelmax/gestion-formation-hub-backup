import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// Schéma de validation pour la création d'une action corrective
const actionCorrectiveSchema = z.object({
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  statut: z.enum(['planifiee', 'en_cours', 'terminee', 'annulee']).default('planifiee'),
  origineType: z.enum(['reclamation', 'incident', 'audit', 'veille']).default('audit'),
  origineRef: z.string().optional(),
  origineDate: z.string().datetime().optional(),
  origineResume: z.string().optional(),
  priorite: z.enum(['faible', 'moyenne', 'haute', 'critique']).default('moyenne'),
  avancement: z.number().min(0).max(100).default(0),
  responsableNom: z.string().optional(),
  responsableEmail: z.string().email('Email du responsable invalide').optional(),
  dateEcheance: z.string().datetime('Date d\'échéance invalide').optional(),
  indicateurEfficacite: z.string().optional(),
  reclamationId: z.string().uuid('ID de réclamation invalide').optional(),
});

/**
 * @swagger
 * /api/actions-correctives:
 *   get:
 *     summary: Récupère la liste des actions correctives
 *     tags: [Actions Correctives]
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *           enum: [planifiee, en_cours, terminee, abandonnee]
 *         description: Filtre par statut
 *       - in: query
 *         name: priorite
 *         schema:
 *           type: string
 *           enum: [basse, moyenne, haute, critique]
 *         description: Filtre par priorité
 *     responses:
 *       200:
 *         description: Liste des actions correctives
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ActionCorrective'
 */
export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut');
    const priorite = searchParams.get('priorite');

    const where: any = {};
    
    if (statut) where.statut = statut;
    if (priorite) where.priorite = priorite;

    const actions = await prisma.actionCorrective.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        reclamation: {
          select: {
            id: true,
            sujet: true,
            statut: true,
          },
        },
        historiqueActions: {
          orderBy: { dateAction: 'desc' },
          take: 5,
        },
      },
    });

    return NextResponse.json(actions);

  );
  }
}

/**
 * @swagger
 * /api/actions-correctives:
 *   post:
 *     summary: Crée une nouvelle action corrective
 *     tags: [Actions Correctives]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ActionCorrective'
 *     responses:
 *       201:
 *         description: Action corrective créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActionCorrective'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    const data = await request.json();
    
    // Validation des données
    const validation = actionCorrectiveSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    );
  }
    // Création de l'action corrective
    const nouvelleAction = await prisma.actionCorrective.create({
      data: {
        titre: data.titre,
        description: data.description,
        statut: data.statut || 'planifiee',
        origineType: data.origineType,
        origineRef: data.origineRef,
        origineDate: data.origineDate ? new Date(data.origineDate) : null,
        origineResume: data.origineResume,
        priorite: data.priorite || 'moyenne',
        avancement: data.avancement || 0,
        responsableNom: data.responsableNom,
        responsableEmail: data.responsableEmail,
        dateEcheance: data.dateEcheance ? new Date(data.dateEcheance) : null,
        indicateurEfficacite: data.indicateurEfficacite,
        reclamationId: data.reclamationId,
      },
    });

    // Ajout d'une entrée dans l'historique
    await prisma.historiqueActionCorrective.create({
      data: {
        actionCorrectiveId: nouvelleAction.id,
        action: 'Création',
        utilisateur: 'Système',
        commentaire: 'Action corrective créée',
      },
    });

    return NextResponse.json(nouvelleAction, { status: 201 });

    );
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     ActionCorrective:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         titre:
 *           type: string
 *         description:
 *           type: string
 *         statut:
 *           type: string
 *           enum: [planifiee, en_cours, terminee, abandonnee]
 *         origineType:
 *           type: string
 *         priorite:
 *           type: string
 *           enum: [basse, moyenne, haute, critique]
 *         avancement:
 *           type: integer
 *           minimum: 0
 *           maximum: 100
 *         responsableNom:
 *           type: string
 *         responsableEmail:
 *           type: string
 *           format: email
 *         dateEcheance:
 *           type: string
 *           format: date-time
 *         indicateurEfficacite:
 *           type: string
 *         reclamationId:
 *           type: string
 *           format: uuid
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
