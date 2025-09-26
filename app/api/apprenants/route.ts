import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour un apprenant
const apprenantSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  telephone: z.string().optional(),
});

export async function GET() {
  try {
    const { userId, sessionClaims } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Seuls les admins peuvent voir la liste des apprenants
    const userRole = sessionClaims?.metadata?.role || 'user';
    if (userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Accès refusé - Permissions administrateur requises' },
        { status: 403 }
      );
    }

    // Récupérer tous les utilisateurs avec rôle 'apprenant'
    const apprenants = await prisma.user.findMany({
      where: {
        role: 'apprenant'
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transformer pour correspondre à l'interface frontend
    const apprenantsTransformed = apprenants.map(apprenant => ({
      id: apprenant.id,
      nom: apprenant.name,
      email: apprenant.email,
      telephone: apprenant.phone,
      createdAt: apprenant.createdAt,
    }));

    return NextResponse.json(apprenantsTransformed);
  } catch (error) {
    console.error('Erreur lors de la récupération des apprenants:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des apprenants' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validation des données
    const validation = apprenantSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Un utilisateur avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Créer un nouvel apprenant
    const nouvelApprenant = await prisma.user.create({
      data: {
        name: data.nom,
        email: data.email,
        phone: data.telephone,
        role: 'apprenant',
        password: null, // Sera défini lors de l'activation du compte
        emailVerified: null,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      }
    });

    // Transformer pour le frontend
    const apprenantResponse = {
      id: nouvelApprenant.id,
      nom: nouvelApprenant.name,
      email: nouvelApprenant.email,
      telephone: nouvelApprenant.phone,
      createdAt: nouvelApprenant.createdAt,
    };

    return NextResponse.json(apprenantResponse, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de l\'apprenant:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'apprenant' },
      { status: 500 }
    );
  }
}
