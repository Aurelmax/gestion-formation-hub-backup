import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * API Formations - Compatible avec l'ancienne interface
 * Redirige vers les données de programmes-formation pour maintenir la compatibilité
 */

export async function GET(request: NextRequest) {
  try {
    // Récupérer les programmes de formation actifs de type catalogue
    const prismaAny = prisma as any;
    const formations = await prismaAny.programmes_formation.findMany({
      where: {
        estActif: true,
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
        publicConcerne: true,
        modalites: true,
        formateur: true,
        pictogramme: true,
        dateCreation: true,
        estActif: true,
        estVisible: true,
        version: true,
        categorie: {
          select: {
            id: true,
            titre: true
          }
        }
      },
      orderBy: {
        dateCreation: 'desc'
      }
    });

    // Transformer les données pour la compatibilité avec l'ancienne API
    const formattedFormations = formations.map(formation => ({
      id: formation.id,
      code: formation.code,
      titre: formation.titre,
      description: formation.description,
      duree: formation.duree,
      prix: formation.prix,
      niveau: formation.niveau,
      participants: formation.participants,
      objectifs: formation.objectifs,
      prerequis: formation.prerequis,
      publicConcerne: formation.publicConcerne,
      modalites: formation.modalites,
      formateur: formation.formateur,
      pictogramme: formation.pictogramme,
      dateCreation: formation.dateCreation,
      estActif: formation.estActif,
      estVisible: formation.estVisible,
      version: formation.version,
      categorie: formation.categorie
    }));

    return NextResponse.json(formattedFormations);

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

    // Rediriger vers l'API programmes-formation avec le bon format
    const programmeData = {
      ...data,
      type: 'catalogue',
      estActif: true,
      estVisible: true
    };

    const prismaAny = prisma as any;
    const programme = await prismaAny.programmes_formation.create({
      data: programmeData,
      include: {
        categoriesProgramme: true
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