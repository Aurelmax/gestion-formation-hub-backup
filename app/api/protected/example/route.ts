import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Vérifier l'authentification avec Clerk
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Récupérer les informations de l'utilisateur
    const { user } = await auth();
    
    return NextResponse.json({
      message: 'Route protégée accessible',
      userId,
      user: user ? {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName,
        role: user.publicMetadata?.role
      } : null
    });

  } catch (error) {
    console.error('Erreur dans la route protégée:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Logique métier pour les requêtes POST
    return NextResponse.json({
      message: 'Action POST effectuée avec succès',
      userId
    });

  } catch (error) {
    console.error('Erreur dans la route POST protégée:', error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
