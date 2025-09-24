import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";



// GET - Récupérer tous les plans d'accessibilité
export async function GET(request: NextRequest) {
  try {
    const plans = await prisma.planAccessibilite.findMany({
      orderBy: { dateCreation: 'desc' }
    });

    return NextResponse.json(plans);
  } catch (error) {
    console.error('Erreur lors de la récupération des plans d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des plans d\'accessibilité' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau plan d'accessibilité
export async function POST(request: NextRequest) {
  try {
    const {
      titre,
      description,
      actionsRequises,
      statut
    } = await request.json();

    if (!titre || !description) {
      return NextResponse.json(
        { error: 'Les champs titre et description sont requis' },
        { status: 400 }
      );
    }

    const nouveauPlan = await prisma.planAccessibilite.create({
      data: {
        titre,
        description,
        actionsRequises: actionsRequises || [],
        statut: statut || 'actif'
      }
    });

    return NextResponse.json(nouveauPlan, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du plan d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création du plan d\'accessibilité' },
      { status: 500 }
    );
  }
}