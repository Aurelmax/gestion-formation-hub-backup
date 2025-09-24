import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";



export async function GET() {
  try {
    // Implémentation à compléter
    return NextResponse.json({ message: 'Route conformite fonctionnelle' });
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
    return NextResponse.json({ message: 'Création conformite', data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur création' },
      { status: 500 }
    );
  }
}
