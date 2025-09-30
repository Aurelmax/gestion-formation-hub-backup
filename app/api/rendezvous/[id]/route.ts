import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour d'un rendez-vous
const updateRendezvousSchema = z.object({
  type: z.string().min(1, 'Le type est requis').optional(),
  status: z.string().optional(),
  prenom: z.string().min(2, 'Le prénom doit comporter au moins 2 caractères').optional(),
  nom: z.string().min(2, 'Le nom doit comporter au moins 2 caractères').optional(),
  email: z.string().email('Adresse email invalide').optional(),
  telephone: z.string().optional(),
  entreprise: z.string().optional(),
  formationTitre: z.string().optional(),
  formationSelectionnee: z.string().optional(),
  commentaires: z.string().optional(),
  notes: z.string().optional(),
  dateContact: z.string().datetime('Date de contact invalide').optional(),
  dateRdv: z.string().datetime().optional(),
  dureeRdv: z.number().optional(),
  formatRdv: z.string().optional(),
  lieuRdv: z.string().optional(),
  lienVisio: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rendezvous = await prisma.rendezvous.findUnique({
      where: { id },
    });

    if (!rendezvous) {
      return NextResponse.json(
        { success: false, error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Formater les données pour l'interface
    const formattedRendezvous = {
      id: rendezvous.id,
      type: rendezvous.type,
      status: rendezvous.status,
      prenom: rendezvous.prenom,
      nom: rendezvous.nom,
      email: rendezvous.email,
      telephone: rendezvous.telephone,
      entreprise: rendezvous.entreprise,
      dateRdv: rendezvous.dateRdv?.toISOString(),
      formationTitre: rendezvous.formationTitre,
      formationSelectionnee: rendezvous.formationSelectionnee,
      notes: rendezvous.notes,
      commentaires: rendezvous.commentaires,
      dureeRdv: rendezvous.dureeRdv,
      formatRdv: rendezvous.formatRdv,
      lieuRdv: rendezvous.lieuRdv,
      lienVisio: rendezvous.lienVisio,
      dateContact: rendezvous.dateContact?.toISOString(),
      createdAt: rendezvous.createdAt.toISOString(),
      updatedAt: rendezvous.updatedAt?.toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: formattedRendezvous
    });

  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la récupération du rendez-vous'
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validation des données
    const validation = updateRendezvousSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Données invalides',
          details: validation.error.format()
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Vérifier que le rendez-vous existe
    const existingRendezvous = await prisma.rendezvous.findUnique({
      where: { id }
    });

    if (!existingRendezvous) {
      return NextResponse.json(
        { success: false, error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};

    if (data.type !== undefined) updateData.type = data.type;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.prenom !== undefined) updateData.prenom = data.prenom;
    if (data.nom !== undefined) updateData.nom = data.nom;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.telephone !== undefined) updateData.telephone = data.telephone;
    if (data.entreprise !== undefined) updateData.entreprise = data.entreprise;
    if (data.formationTitre !== undefined) updateData.formationTitre = data.formationTitre;
    if (data.formationSelectionnee !== undefined) updateData.formationSelectionnee = data.formationSelectionnee;
    if (data.commentaires !== undefined) updateData.commentaires = data.commentaires;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.dateContact !== undefined) updateData.dateContact = new Date(data.dateContact);
    if (data.dateRdv !== undefined) updateData.dateRdv = data.dateRdv ? new Date(data.dateRdv) : null;
    if (data.dureeRdv !== undefined) updateData.dureeRdv = data.dureeRdv;
    if (data.formatRdv !== undefined) updateData.formatRdv = data.formatRdv;
    if (data.lieuRdv !== undefined) updateData.lieuRdv = data.lieuRdv;
    if (data.lienVisio !== undefined) updateData.lienVisio = data.lienVisio;

    // Mettre à jour le rendez-vous
    const updatedRendezvous = await prisma.rendezvous.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      data: updatedRendezvous,
      message: 'Rendez-vous mis à jour avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la mise à jour du rendez-vous',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Vérifier que le rendez-vous existe
    const existingRendezvous = await prisma.rendezvous.findUnique({
      where: { id }
    });

    if (!existingRendezvous) {
      return NextResponse.json(
        { success: false, error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le rendez-vous
    await prisma.rendezvous.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Rendez-vous supprimé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur serveur lors de la suppression du rendez-vous',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}