import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Implémentation à compléter
    return NextResponse.json({ message: 'Route formations fonctionnelle' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Implémentation à compléter
    return NextResponse.json({ message: 'Création formations', data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur création' },
      { status: 500 }
    );
  }
}
