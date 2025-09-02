import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la création d'un rendez-vous
const rendezvousSchema = z.object({
  type: z.string().min(1, 'Le type est requis'),
  status: z.string().default('nouveau'),
  prenom: z.string().min(2, 'Le prénom doit comporter au moins 2 caractères'),
  nom: z.string().min(2, ' nom doit comporter au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  formation_titre: z.string().optional(),
  commentaires: z.string().min(10, 'Le message doit comporter au moins 10 caractères'),
  dateContact: z.string().datetime('Date de contact invalide'),
});

export async function GET() {
  try {
    const rendezvous = await prisma.rendezvous.findMany({
      orderBy: { date_creation: 'desc' },
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
        status: data.status,
        prenom: data.prenom,
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        entreprise: data.entreprise,
        formation_titre: data.formation_titre,
        commentaires: data.commentaires,
        dateContact: data.dateContact ? new Date(data.dateContact) : new Date(),
      },
    });

    // Envoyer un email de confirmation (à implémenter)
    // await sendConfirmationEmail(data.email, data.prenom);

    return NextResponse.json(
      { 
        message: 'Demande de contact enregistrée avec succès',
        data: nouveauRendezvous 
      },
      { status: 201 }
    );
    
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
