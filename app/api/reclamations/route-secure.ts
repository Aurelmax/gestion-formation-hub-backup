import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { withSecurity, secureLogger, getSecurityHeaders } from '@/lib/security';
import { withCSRFProtection } from '@/lib/csrf';

// Schéma de validation pour les réclamations
const reclamationSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(100, 'Nom trop long'),
  email: z.string().email('Email invalide').max(255, 'Email trop long'),
  telephone: z.string().max(20, 'Téléphone trop long').optional(),
  sujet: z.string().min(1, 'Le sujet est requis').max(200, 'Sujet trop long'),
  message: z.string().min(1, 'Le message est requis').max(2000, 'Message trop long'),
  statut: z.enum(['nouvelle', 'en_cours', 'resolue', 'fermee']).optional().default('nouvelle'),
  priorite: z.enum(['basse', 'normale', 'haute', 'urgente']).optional().default('normale'),
  assignee_id: z.string().uuid().optional(),
  notes_internes: z.string().max(1000, 'Notes trop longues').optional(),
});

// Schéma pour les paramètres de requête
const queryParamsSchema = z.object({
  statut: z.enum(['nouvelle', 'en_cours', 'resolue', 'fermee']).optional(),
  priorite: z.enum(['basse', 'normale', 'haute', 'urgente']).optional(),
  assignee_id: z.string().uuid().optional(),
  page: z.preprocess(
    val => parseInt(String(val || '1'), 10),
    z.number().int().positive()
  ).default(1),
  limit: z.preprocess(
    val => Math.min(50, parseInt(String(val || '20'), 10)), // Limite réduite pour la sécurité
    z.number().int().min(1).max(50)
  ).default(20),
});

// Handler GET avec rate limiting pour la lecture
export const GET = withRateLimit(async (request: NextRequest) => {
  try {
    secureLogger.info('Fetching reclamations', {
      route: '/api/reclamations',
      method: 'GET',
      userAgent: request.headers.get('user-agent')
    });

    // Valider les paramètres de requête
    const validation = queryParamsSchema.safeParse(
      Object.fromEntries(request.nextUrl.searchParams)
    );

    if (!validation.success) {
      secureLogger.warn('Invalid query parameters for reclamations', {
        errors: validation.error.errors
      });

      return NextResponse.json(
        {
          success: false,
          error: {
            type: 'validation_error',
            message: 'Paramètres invalides',
            details: validation.error.format()
          }
        },
        {
          status: 400,
          headers: getSecurityHeaders()
        }
      );
    }

    const params = validation.data;

    // Construire les conditions de filtre
    const where: Prisma.ReclamationsWhereInput = {};

    if (params.statut) where.statut = params.statut;
    if (params.priorite) where.priorite = params.priorite;
    if (params.assignee_id) where.assignee_id = params.assignee_id;

    // Calcul de la pagination
    const skip = (params.page - 1) * params.limit;

    // Requête avec pagination et comptage
    const [reclamations, total] = await Promise.all([
      prisma.reclamations.findMany({
        where,
        orderBy: { date_creation: 'desc' },
        skip,
        take: params.limit,
        include: {
          users: {
            select: { id: true, nom: true, prenom: true, email: true }
          }
        }
      }),
      prisma.reclamations.count({ where })
    ]);

    const totalPages = Math.ceil(total / params.limit);

    secureLogger.info('Reclamations fetched successfully', {
      count: reclamations.length,
      total,
      page: params.page
    });

    return NextResponse.json({
      success: true,
      data: reclamations,
      pagination: {
        total,
        totalPages,
        currentPage: params.page,
        itemsPerPage: params.limit,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1
      }
    }, {
      headers: getSecurityHeaders()
    });

  } catch (error) {
    secureLogger.error('Error fetching reclamations', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      {
        success: false,
        error: {
          type: 'internal_error',
          message: 'Erreur serveur lors de la récupération des réclamations'
        }
      },
      {
        status: 500,
        headers: getSecurityHeaders()
      }
    );
  }
}, rateLimitConfigs.read);

// Handler POST avec protection complète
const postHandler = async (request: NextRequest, context: any, data: z.infer<typeof reclamationSchema>) => {
  try {
    secureLogger.info('Creating new reclamation', {
      route: '/api/reclamations',
      method: 'POST',
      userAgent: request.headers.get('user-agent'),
      // Ne pas logger les données sensibles directement
      hasEmail: !!data.email,
      hasPhone: !!data.telephone
    });

    // Créer la réclamation avec les données validées
    const reclamation = await prisma.reclamations.create({
      data: {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone || null,
        sujet: data.sujet,
        message: data.message,
        statut: data.statut || 'nouvelle',
        priorite: data.priorite || 'normale',
        assignee_id: data.assignee_id || null,
        notes_internes: data.notes_internes || null,
        date_creation: new Date(),
        date_modification: new Date()
      },
      include: {
        users: {
          select: { id: true, nom: true, prenom: true, email: true }
        }
      }
    });

    secureLogger.info('Reclamation created successfully', {
      reclamationId: reclamation.id,
      statut: reclamation.statut,
      priorite: reclamation.priorite
    });

    return new Response(
      JSON.stringify({
        success: true,
        data: reclamation,
        message: 'Réclamation créée avec succès'
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          ...getSecurityHeaders()
        }
      }
    );

  } catch (error) {
    secureLogger.error('Error creating reclamation', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return new Response(
      JSON.stringify({
        success: false,
        error: {
          type: 'database_error',
          message: 'Erreur lors de la création de la réclamation'
        }
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...getSecurityHeaders()
        }
      }
    );
  }
};

// Export POST avec toutes les protections
export const POST = withRateLimit(
  withCSRFProtection(
    withSecurity(postHandler, reclamationSchema)
  ),
  rateLimitConfigs.forms
);