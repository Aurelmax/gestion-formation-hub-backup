import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { statut } = await request.json();

    if (!statut) {
      return NextResponse.json(
        { error: 'Le statut est requis' },
        { status: 400 }
      );
    }

    const rendezvous = await prisma.rendezvous.update({
      where: { id },
      data: {
        status: statut,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      message: 'Statut mis à jour avec succès',
      data: rendezvous
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du statut' },
      { status: 500 }
    );
  }
}