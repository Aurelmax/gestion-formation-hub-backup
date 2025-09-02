import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const categories = await prisma.categorieProgramme.findMany({
      select: {
        id: true,
        titre: true,
        code: true,
        description: true,
        ordre: true
      },
      orderBy: {
        ordre: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur API catégories programme:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : String(error)
          : undefined
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    // Code pour créer une nouvelle catégorie de programme
  } catch (error) {
    console.error('Erreur API catégories programme:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : String(error)
          : undefined
      },
      { status: 500 }
    );
  }
}
