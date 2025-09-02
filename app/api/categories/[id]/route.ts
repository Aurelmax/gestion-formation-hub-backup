import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour la mise à jour d'une catégorie
const updateCategorieSchema = z.object({
  code: z.string().min(1, 'Le code est requis').optional(),
  titre: z.string().min(1, 'Le titre est requis').optional(),
  description: z.string().optional(),
  ordre: z.number().int().min(0).optional(),
});

// GET /api/categories/[id] - Récupérer une catégorie par son ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categorie = await prisma.categorieProgramme.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            programmes: {
              where: { estActif: true, estVisible: true }
            }
          }
        }
      }
    });

    if (!categorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(categorie);
  } catch (error) {
    console.error('Erreur lors de la récupération de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de la catégorie' },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/[id] - Mettre à jour une catégorie
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const validatedData = updateCategorieSchema.parse(data);

    // Vérifier si la catégorie existe
    const existing = await prisma.categorieProgramme.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si le code est déjà utilisé par une autre catégorie
    if (validatedData.code && validatedData.code !== existing.code) {
      const codeExists = await prisma.categorieProgramme.findFirst({
        where: {
          code: validatedData.code,
          id: { not: params.id }
        }
      });

      if (codeExists) {
        return NextResponse.json(
          { error: 'Une catégorie avec ce code existe déjà' },
          { status: 400 }
        );
      }
    }

    const updatedCategorie = await prisma.categorieProgramme.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        updatedAt: new Date()
      },
    });

    return NextResponse.json(updatedCategorie);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Erreur lors de la mise à jour de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la mise à jour de la catégorie' },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/[id] - Supprimer une catégorie
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier si la catégorie existe
    const categorie = await prisma.categorieProgramme.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            programmes: true
          }
        }
      }
    });

    if (!categorie) {
      return NextResponse.json(
        { error: 'Catégorie non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si la catégorie est utilisée par des programmes
    if (categorie._count.programmes > 0) {
      return NextResponse.json(
        { 
          error: 'Impossible de supprimer cette catégorie car elle est utilisée par un ou plusieurs programmes',
          count: categorie._count.programmes
        },
        { status: 400 }
      );
    }

    await prisma.categorieProgramme.delete({
      where: { id: params.id },
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erreur lors de la suppression de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression de la catégorie' },
      { status: 500 }
    );
  }
}
