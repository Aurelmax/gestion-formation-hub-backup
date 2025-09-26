import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    const reclamations = await prisma.reclamation.findMany({
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json(reclamations);
  } catch (error) {
    console.error('Erreur lors de la récupération des réclamations:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réclamations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const { nom, email, telephone, sujet, message, priorite = 'normale' } = data;
    
    // Validation des données requises
    if (!nom || !email || !sujet || !message) {
      return NextResponse.json(
        { error: 'Champs requis manquants (nom, email, sujet, message)' },
        { status: 400 }
      );
    }

    const reclamation = await prisma.reclamation.create({
      data: {
        nom: nom.trim(),
        email: email.trim(),
        telephone: telephone?.trim() || null,
        sujet: sujet.trim(),
        message: message.trim(),
        priorite,
        statut: 'nouvelle'
      }
    });

    return NextResponse.json(reclamation, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la réclamation:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la réclamation' },
      { status: 500 }
    );
  }
}
