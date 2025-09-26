import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
  try {
    const { id } = await params;
    const rendezvous = await prisma.rendezvous.findUnique({
      where: { id },
    });

    if (!rendezvous) {
      return NextResponse.json(
        { error: 'Rendez-vous non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(rendezvous);
  } catch (error) {
    console.error('Erreur lors de la récupération du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du rendez-vous' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
  try {
    const { id } = await params;
    const data = await request.json();

    const rendezvous = await prisma.rendezvous.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(rendezvous);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du rendez-vous' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
  try {
    const { id } = await params;
    await prisma.rendezvous.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Rendez-vous supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du rendez-vous' },
      { status: 500 }
    );
  }
}