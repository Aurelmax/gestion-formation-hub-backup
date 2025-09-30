import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // En production, supprimer de la base de données
    console.log('Suppression du programme personnalisé:', id);

    return NextResponse.json({
      success: true,
      message: `Programme personnalisé ${id} supprimé avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la suppression du programme personnalisé:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la suppression du programme personnalisé'
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

    // En production, mettre à jour en base de données
    console.log('Mise à jour du programme personnalisé:', id, body);

    return NextResponse.json({
      success: true,
      data: { id, ...body, dateModification: new Date().toISOString() },
      message: `Programme personnalisé ${id} mis à jour avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du programme personnalisé:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour du programme personnalisé'
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // En production, mettre à jour en base de données
    console.log('Mise à jour partielle du programme personnalisé:', id, body);

    return NextResponse.json({
      success: true,
      data: { id, ...body, dateModification: new Date().toISOString() },
      message: `Programme personnalisé ${id} mis à jour avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la mise à jour du programme personnalisé:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la mise à jour du programme personnalisé'
      },
      { status: 500 }
    );
  }
}