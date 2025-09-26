import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { ProgrammeFormation } from '@prisma/client';

/**
 * API Formations - Convention Hybride Stricte
 * Accès Prisma Client typé avec mapping automatique camelCase <-> snake_case
 */

export async function GET(_request: NextRequest) {
  try {
    // ✅ Accès Prisma Client typé avec nom DB snake_case
    const formations = await prisma.programmes_formation.findMany({
      where: {
        est_actif: true,
        type: 'catalogue'
      },
      select: {
        id: true,
        code: true,
        titre: true,
        description: true,
        duree: true,
        prix: true,
        niveau: true,
        participants: true,
        objectifs: true,
        prerequis: true,
        public_concerne: true,
        modalites: true,
        formateur: true,
        pictogramme: true,
        date_creation: true,
        est_actif: true,
        est_visible: true,
        version: true,
        categories_programme: {
          select: {
            id: true,
            titre: true
          }
        }
      },
      orderBy: {
        date_creation: 'desc'
      }
    });

    // ✅ Données déjà au format camelCase via Prisma Client typé
    // Pas de transformation nécessaire - mapping automatique

    return NextResponse.json(formations);

  } catch (error) {
    console.error('Erreur lors de la récupération des formations:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des formations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // ✅ Validation des données d'entrée
    const programmeData = {
      ...data,
      type: 'catalogue' as const,
      estActif: true,
      estVisible: true
    };

    // ✅ Accès Prisma Client typé
    const programme = await prisma.programmeFormation.create({
      data: programmeData,
      include: {
        categorie: true
      }
    });

    return NextResponse.json(programme, { status: 201 });

  } catch (error) {
    console.error('Erreur lors de la création de la formation:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la formation' },
      { status: 500 }
    );
  }
}