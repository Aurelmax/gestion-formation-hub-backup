import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Instance Prisma avec Accelerate
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
}).$extends(withAccelerate());
import { z } from 'zod';

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
  dateRdv: z.date().optional(),
  source: z.string().optional(),
  // Commentaires optionnel pour le positionnement
  commentaires: z.string().optional(),
  dateContact: z.string().datetime().optional(),
});

export async function GET() {
  try {
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
    
    // Validation des données
    const validation = rendezvousSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    // Création du rendez-vous dans la base de données
    const nouveauRendezvous = await prisma.rendezvous.create({
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
