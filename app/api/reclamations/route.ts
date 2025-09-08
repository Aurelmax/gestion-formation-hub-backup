import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour les réclamations
const reclamationSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
  sujet: z.string().min(1, 'Le sujet est requis'),
  message: z.string().min(1, 'Le message est requis'),
  statut: z.enum(['nouvelle', 'en-cours', 'resolue', 'fermee']).optional().default('nouvelle'),
  priorite: z.enum(['basse', 'normale', 'haute', 'critique']).optional().default('normale'),
  assigneeId: z.string().uuid().optional(),
  notesInternes: z.string().optional(),
});

// Schéma pour les paramètres de requête
const queryParamsSchema = z.object({
  statut: z.enum(['nouvelle', 'en-cours', 'resolue', 'fermee']).optional(),
  priorite: z.enum(['basse', 'normale', 'haute', 'critique']).optional(),
  assigneeId: z.string().uuid().optional(),
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
    if (params.statut) where.statut = params.statut;
    if (params.priorite) where.priorite = params.priorite;
    if (params.assigneeId) where.assigneeId = params.assigneeId;

    // Pagination
    const skip = (params.page - 1) * params.limit;
    const take = params.limit;

    // Récupérer les réclamations
    const [reclamations, total] = await Promise.all([
      prisma.reclamation.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          assignee: {
            select: { id: true, nom: true, prenom: true, email: true }
          },
          actionsCorrectives: {
            select: { id: true, titre: true, statut: true }
          }
        }
      }),
      prisma.reclamation.count({ where })
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

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validation = reclamationSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.errors 
        },
        { status: 400 }
      );
    }

    // Créer la réclamation
    const reclamation = await prisma.reclamation.create({
      data: validation.data as any, // Type cast temporaire pour éviter les conflits de types Prisma
      include: {
        assignee: {
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
