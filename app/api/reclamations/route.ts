import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit';
import { withSecurity, secureLogger, getSecurityHeaders } from '@/lib/security';
import { withCSRFProtection } from '@/lib/csrf';



// Schéma de validation pour les réclamations
const reclamationSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
  sujet: z.string().min(1, 'Le sujet est requis'),
  message: z.string().min(1, 'Le message est requis'),
  statut: z.enum(['nouvelle', 'en_cours', 'resolue', 'fermee']).optional().default('nouvelle'),
  priorite: z.enum(['basse', 'normale', 'haute', 'urgente']).optional().default('normale'),
  assignee_id: z.string().uuid().optional(),
  notes_internes: z.string().optional(),
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
    const where: Prisma.ReclamationsWhereInput = {};
    if (params.statut) where.statut = params.statut;
    if (params.priorite) where.priorite = params.priorite;
    if (params.assignee_id) where.assignee_id = params.assignee_id;

    // Pagination
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    // Récupérer les réclamations
    const [reclamations, total] = await Promise.all([
      prisma.reclamations.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          users: {
            select: { id: true, nom: true, prenom: true, email: true }
          },
          actions_correctives: {
            select: { id: true, titre: true, statut: true }
          }
        }
      }),
      prisma.reclamations.count({ where })
    ]);

    const totalPages = Math.ceil(total / params.limit);

    return NextResponse.json({
      data: reclamations,
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
    console.error('Erreur lors de la récupération des réclamations:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des réclamations' },
      { status: 500 }
    );
  }
}

// Handler interne pour POST avec sécurité
async function postHandler(request: NextRequest, context: any, data: z.infer<typeof reclamationSchema>) {
  try {
    secureLogger.info('Creating new reclamation', {
      route: '/api/reclamations',
      method: 'POST',
      userAgent: request.headers.get('user-agent')
    });

    // Créer la réclamation
    const reclamation = await prisma.reclamations.create({
      data: validation.data as Prisma.ReclamationsCreateInput,
      include: {
        users: {
          select: { id: true, nom: true, prenom: true, email: true }
        }
      }
    });

    return NextResponse.json(reclamation, { status: 201 });
    
  } catch (error) {
    console.error('Erreur lors de la création de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réclamation' },
      { status: 500 }
    );
  }
}
