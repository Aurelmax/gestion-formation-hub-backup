import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // En production, générer le document PDF et le sauvegarder
    console.log('Génération du document pour le programme personnalisé:', id);

    // Pour la démonstration, utiliser un fichier PDF existant
    // En production, ici on génèrerait un vrai PDF personnalisé
    const documentUrl = `/documents/demo-programme.pdf`;

    return NextResponse.json({
      success: true,
      url: documentUrl,
      message: `Document généré avec succès pour le programme ${id}`
    });

  } catch (error) {
    console.error('Erreur lors de la génération du document:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la génération du document'
      },
      { status: 500 }
    );
  }
}