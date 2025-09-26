import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { z } from 'zod';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// Schéma de validation pour les apprenants (adapté au schéma Prisma)
const apprenantSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  telephone: z.string().optional(),
});

export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    const apprenants = await prisma.apprenant.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(apprenants);

  );
  }
}

    );
  }
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    const data = await request.json();
    
    // Validation des données
    const validation = apprenantSchema.safeParse(data);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Données invalides',
          details: validation.error.format() 
        },
        { status: 400 }
      );
    }

    );
  }
    // Vérifier si l'apprenant existe déjà (par email s'il n'y a pas d'unicité sur email)
    const existingApprenant = await prisma.apprenant.findFirst({
      where: { email: validation.data.email },
    });

    if (existingApprenant) {
      return NextResponse.json(
        { error: 'Un apprenant avec cet email existe déjà' },
        { status: 409 }
      );
    }

    // Création de l'apprenant
    const nouvelApprenant = await prisma.apprenant.create({
      data: validation.data,
    });

    return NextResponse.json(nouvelApprenant, { status: 201 });

    );
  }
}
