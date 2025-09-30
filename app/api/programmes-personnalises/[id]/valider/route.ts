import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // En production, mettre à jour le statut en base de données
    console.log('Validation du programme personnalisé:', id);

    const updatedProgramme = {
      id,
      statut: 'valide',
      estValide: true,
      dateValidation: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      data: updatedProgramme,
      message: `Programme personnalisé ${id} validé avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la validation du programme personnalisé:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la validation du programme personnalisé'
      },
      { status: 500 }
    );
  }
}