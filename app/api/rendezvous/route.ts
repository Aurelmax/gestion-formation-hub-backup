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
  formationTitre: z.string().optional(),
  formationSelectionnee: z.string().optional(),
  commentaires: z.string().optional(),
  dateContact: z.string().datetime('Date de contact invalide').optional(),
  // Champs spécifiques pour rendez-vous d'impact
  dateImpact: z.string().datetime().optional(),
  satisfactionImpact: z.number().min(1).max(5).optional(),
  competencesAppliquees: z.string().optional(),
  ameliorationsSuggeres: z.string().optional(),
  commentairesImpact: z.string().optional(),
  rendezvousParentId: z.string().optional(),
});

export async function GET() {
  try {
    const rendezvous = await prisma.rendezvous.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    // Formater les données pour l'interface
    const formattedRendezvous = rendezvous.map(rdv => ({
      id: rdv.id,
      type: rdv.type,
      status: rdv.status,
      prenom: rdv.prenom,
      nom: rdv.nom,
      email: rdv.email,
      telephone: rdv.telephone,
      dateRdv: rdv.dateRdv?.toISOString(),
      formationTitre: rdv.formationTitre,
      formationSelectionnee: rdv.formationSelectionnee,
      notes: rdv.notes,
      commentaires: rdv.commentaires,
      dureeRdv: rdv.dureeRdv,
      formatRdv: rdv.formatRdv,
      lieuRdv: rdv.lieuRdv,
      lienVisio: rdv.lienVisio,
      createdAt: rdv.createdAt.toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data: formattedRendezvous,
      total: formattedRendezvous.length
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des rendez-vous'
      },
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
        formationTitre: data.formationTitre || data.formation_titre,
        formationSelectionnee: data.formationSelectionnee,
        commentaires: data.commentaires,
        dateContact: data.dateContact ? new Date(data.dateContact) : new Date(),
        // Champs spécifiques impact
        ...(data.type === 'impact' && {
          dateImpact: data.dateImpact ? new Date(data.dateImpact) : undefined,
          satisfactionImpact: data.satisfactionImpact,
          competencesAppliquees: data.competencesAppliquees,
          ameliorationsSuggeres: data.ameliorationsSuggeres,
          commentairesImpact: data.commentairesImpact,
          rendezvousParentId: data.rendezvousParentId,
        }),
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
