import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client/edge';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la création d'une action corrective
const actionCorrectiveSchema = z.object({
  titre: z.string().min(3, 'Le titre doit contenir au moins 3 caractères'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  statut: z.enum(['planifiee', 'en_cours', 'terminee', 'abandonnee']).default('planifiee'),
  origineType: z.string().min(1, "Le type d'origine est requis"),
  origineRef: z.string().optional(),
  origineDate: z.string().datetime().optional(),
  origineResume: z.string().optional(),
  priorite: z.enum(['basse', 'moyenne', 'haute', 'critique']).default('moyenne'),
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
            titre: true,
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
  } catch (error) {
    console.error('Erreur lors de la récupération des actions correctives:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des actions correctives' },
      { status: 500 }
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
    
  } catch (error) {
    console.error('Erreur lors de la création de l\'action corrective:', error);
    return NextResponse.json(
      { 
        error: 'Une erreur est survenue lors de la création de l\'action corrective',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
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
