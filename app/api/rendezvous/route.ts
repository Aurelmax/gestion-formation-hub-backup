import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import { z } from 'zod';

// Instance Prisma avec Accelerate et gestion de reconnexion
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Configuration pour gérer les déconnexions
  __internal: {
    engine: {
      connectTimeout: 60000,
      queryTimeout: 60000,
    },
  },
}).$extends(withAccelerate());

// Schéma de validation pour la création d'un rendez-vous
const rendezvousSchema = z.object({
  type: z.string().min(1, 'Le type est requis'),
  status: z.string().default('nouveau'),
  prenom: z.string().min(2, 'Le prénom doit comporter au moins 2 caractères'),
  nom: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  formation_titre: z.string().optional(),
  formationTitre: z.string().optional(),
  formationSelectionnee: z.string().optional(),
  // Champs optionnels du positionnement
  dateNaissance: z.string().optional(),
  sexe: z.string().optional(),
  hasHandicap: z.boolean().optional(),
  detailsHandicap: z.string().optional(),
  adresse: z.string().optional(),
  codePostal: z.string().optional(),
  ville: z.string().optional(),
  statut: z.string().optional(),
  experience: z.string().optional(),
  objectifs: z.string().optional(),
  niveau: z.string().optional(),
  dateRdv: z.union([z.date(), z.string().datetime(), z.string()]).optional(),
  source: z.string().optional(),
  // Commentaires optionnel pour le positionnement
  commentaires: z.string().optional(),
  dateContact: z.string().datetime().optional(),
});

export async function GET() {
  try {
    // Vérification de la connexion
    try {
      await prisma.$connect();
    } catch (connectError) {
      console.warn('Reconnexion Prisma nécessaire:', connectError);
    }

    const rendezvous = await prisma.rendezvous.findMany({
      orderBy: { dateContact: 'desc' },
      take: 100,
    });
    return NextResponse.json(rendezvous);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des rendez-vous' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Headers CORS
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://gestion-formation-hub-backup.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];
  
  try {
    const data = await request.json();
    console.log('📋 Données reçues:', JSON.stringify(data, null, 2));
    
    // Validation des données
    const validation = rendezvousSchema.safeParse(data);
    
    if (!validation.success) {
      console.error('❌ Erreur de validation Zod:', validation.error.format());
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format(),
          receivedData: data
        },
        { status: 400 }
      );
    }

    // Tentative de reconnexion si nécessaire
    try {
      await prisma.$connect();
    } catch (connectError) {
      console.warn('Reconnexion Prisma nécessaire:', connectError);
    }

    // Création du rendez-vous dans la base de données avec retry
    let nouveauRendezvous: any;
    let retryCount = 0;
    const maxRetries = 3;

    while (retryCount < maxRetries) {
      try {
        nouveauRendezvous = await prisma.rendezvous.create({
          data: {
            type: data.type,
            status: data.status || 'nouveau',
            prenom: data.prenom,
            nom: data.nom,
            email: data.email,
            telephone: data.telephone,
            objectifs: data.objectifs,
            commentaires: data.commentaires || `Formation: ${data.formationTitre || data.formationSelectionnee || 'Non spécifiée'} - Objectifs: ${data.objectifs || 'Non spécifiés'}`,
            dateContact: data.dateContact ? new Date(data.dateContact) : new Date(),
          },
        });
        break;
      } catch (dbError: any) {
        retryCount++;
        console.error(`Tentative ${retryCount} échouée:`, dbError);
        
        if (retryCount >= maxRetries) {
          throw dbError;
        }
        
        // Attendre avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
        
        // Reconnexion forcée
        try {
          await prisma.$disconnect();
          await prisma.$connect();
        } catch (reconnectError) {
          console.warn('Erreur de reconnexion:', reconnectError);
        }
      }
    }

    // Envoyer un email de confirmation (à implémenter)
    // await sendConfirmationEmail(data.email, data.prenom);

    const response = NextResponse.json(
      { 
        message: 'Demande de contact enregistrée avec succès',
        data: nouveauRendezvous 
      },
      { status: 201 }
    );
    
    // Ajouter headers CORS
    if (origin && allowedOrigins.includes(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return response;
    
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    return NextResponse.json(
      { 
        error: 'Une erreur est survenue lors de la création du rendez-vous',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'ID du rendez-vous requis' },
        { status: 400 }
      );
    }

    console.log('🗑️ Suppression du rendez-vous ID:', id);

    // Tentative de reconnexion si nécessaire
    try {
      await prisma.$connect();
    } catch (connectError) {
      console.warn('Reconnexion Prisma nécessaire:', connectError);
    }

    // Vérifier si le rendez-vous existe
    const existingRendezvous = await prisma.rendezvous.findUnique({
      where: { id }
    });

    if (!existingRendezvous) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le rendez-vous
    await prisma.rendezvous.delete({
      where: { id }
    });

    console.log('✅ Rendez-vous supprimé avec succès:', id);

    return NextResponse.json(
      { message: 'Rendez-vous supprimé avec succès' },
      { status: 200 }
    );

  } catch (error) {
    console.error('❌ Erreur lors de la suppression:', error);
    return NextResponse.json(
      { 
        error: 'Erreur lors de la suppression du rendez-vous',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin');
  const allowedOrigins = [
    'https://gestion-formation-hub-backup.vercel.app',
    'http://localhost:3000',
    'http://localhost:3001'
  ];

  const response = new NextResponse(null, { status: 200 });
  
  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}
