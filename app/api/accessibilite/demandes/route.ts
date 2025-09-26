import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';



// GET - Récupérer toutes les demandes d'accessibilité
export async function GET(request: NextRequest) {
  try {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
  try {
    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut');

    const where = statut ? { statut } : {};

    const demandes = await prisma.demandeAccessibilite.findMany({
      where,
      orderBy: { dateCreation: 'desc' }
    });

    return NextResponse.json(demandes);
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des demandes d\'accessibilité' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle demande d'accessibilité
export async function POST(request: NextRequest) {
  try {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
  try {
    const {
      nom,
      email,
      telephone,
      description,
      statut
    } = await request.json();

    if (!nom || !email || !description) {
      return NextResponse.json(
        { error: 'Les champs nom, email et description sont requis' },
        { status: 400 }
      );
    }

    const nouvelleDemande = await prisma.demandeAccessibilite.create({
      data: {
        nom,
        email,
        telephone,
        description,
        statut: statut || 'nouvelle'
      }
    });

    return NextResponse.json(nouvelleDemande, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la demande d\'accessibilité:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création de la demande d\'accessibilité' },
      { status: 500 }
    );
  }
}