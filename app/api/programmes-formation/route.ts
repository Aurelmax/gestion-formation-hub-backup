import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { PROGRAMME_TYPE_ENUM } from '@/types/programmes';
import { createHash } from 'crypto';
import type { ProgrammeFormation, Prisma } from '@prisma/client';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// ✅ Convention Hybride Stricte - Client Prisma Typé

// ----------------------
// Schéma création/mise à jour
// ----------------------
const programmeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  type: z.enum(PROGRAMME_TYPE_ENUM),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional().default(''),
  duree: z.string().min(1, 'La durée est requise'),
  prix: z.string().min(1, 'Le prix est requis'),
  categorieId: z.string().uuid().optional().nullable(),
  estActif: z.boolean().optional().default(true),
  estVisible: z.boolean().optional().default(false),
  version: z.number().int().positive().optional().default(1),
  objectifs: z.array(z.string()).optional().default([]),
  modalites: z.string().optional().default(''),
  formateur: z.string().optional().default('Formateur expert'),
  ressourcesAssociees: z.array(z.string()).optional().default([]),
});

// ----------------------
// GET list programmes
// ----------------------
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
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    const params = Object.fromEntries(request.nextUrl.searchParams);

    // ✅ Typage strict Prisma avec noms DB snake_case
    const where: any = {};
    if (params.type) where.type = params.type;
    if (params.categorieId) where.categorie_id = params.categorieId;
    if (params.estActif) where.est_actif = params.estActif === 'true';

    const skip = ((params.page ? parseInt(params.page) : 1) - 1) * (params.limit ? parseInt(params.limit) : 20);
    const take = params.limit ? parseInt(params.limit) : 20;

    // ✅ Accès Prisma Client typé avec noms DB snake_case
    const [items, total] = await Promise.all([
      prisma.programmes_formation.findMany({
        where,
        skip,
        take,
        orderBy: { date_creation: 'desc' },
        include: { categories_programme: true },
      }),
      prisma.programmes_formation.count({ where }),
    ]);

    const totalPages = Math.ceil(total / take);
    const responseData = { data: items, pagination: { total, totalPages, currentPage: skip / take + 1, itemsPerPage: take } };

    const etag = createHash('md5').update(JSON.stringify(responseData)).digest('hex');
    if (request.headers.get('If-None-Match') === etag) return new NextResponse(null, { status: 304 });

    const response = NextResponse.json(responseData);
    response.headers.set('ETag', etag);
    response.headers.set('Cache-Control', 'public, max-age=300, s-maxage=900');
    return response;

  );
}
}

// ----------------------
// GET programme par ID
// ----------------------
export async function GET_BY_ID(id: string) {
  try {
    // ✅ Accès Prisma Client typé
    const programme = await prisma.programmeFormation.findUnique({
      where: { id },
      include: { categorie: true },
    });
    if (!programme) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });
    return NextResponse.json(programme);

  );
}
}

    );
  }
// ----------------------
// POST créer programme
// ----------------------
export async function POST(request: NextRequest) {
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
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    const data = await request.json();
    const validation = programmeSchema.safeParse(data);
    if (!validation.success) return NextResponse.json({ error: 'Données invalides', details: validation.error.errors }, { status: 400 });

    // ✅ Vérification unicité avec client typé
    const existing = await prisma.programmeFormation.findFirst({ where: { code: validation.data.code } });
    if (existing) return NextResponse.json({ error: 'Code déjà utilisé' }, { status: 409 });

    // ✅ Création avec client typé
    const programme = await prisma.programmeFormation.create({ data: validation.data, include: { categorie: true } });
    return NextResponse.json(programme, { status: 201 });

  );
}
}

// ----------------------
// PUT mettre à jour programme complet
// ----------------------
export async function PUT(id: string, request: NextRequest) {
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
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    // ✅ Vérification contraintes avec client typé
    const existing = await prisma.programmeFormation.findUnique({ where: { id }, include: { dossiers: true } });
    if (!existing) return NextResponse.json({ error: 'Programme non trouvé' }, { status: 404 });

    if (existing.dossiers?.length > 0) return NextResponse.json({ error: 'Programme utilisé dans des dossiers', usedInDossiers: existing.dossiers.length }, { status: 409 });

    // ✅ Suppression avec client typé
    await prisma.programmeFormation.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });

  );
}
}
  