import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { isCurrentUserAdmin, updateUserRole } from '@/lib/clerk-sync';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Vérifier si l'utilisateur actuel est admin
    const isAdmin = await isCurrentUserAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Accès non autorisé - Admin requis' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { role, isActive } = body;

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: id }
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Préparer les données de mise à jour
    const updateData: any = {};
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedUser = await prisma.user.update({
      where: { clerkId: id },
      data: updateData,
      select: {
        id: true,
        clerkId: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        role: true,
        isActive: true,
        emailVerifiedBoolean: true,
        image: true,
        lastLoginAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    const formattedUser = {
      id: updatedUser.id,
      clerkId: updatedUser.clerkId,
      email: updatedUser.email || '',
      firstName: updatedUser.firstName || '',
      lastName: updatedUser.lastName || '',
      name: updatedUser.name || '',
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      emailVerified: updatedUser.emailVerifiedBoolean,
      image: updatedUser.image,
      lastLoginAt: updatedUser.lastLoginAt?.toISOString(),
      createdAt: updatedUser.createdAt.toISOString(),
      updatedAt: updatedUser.updatedAt.toISOString()
    };

    console.log('Utilisateur modifié:', formattedUser);

    return NextResponse.json({
      success: true,
      data: formattedUser,
      message: `Utilisateur ${id} modifié avec succès`
    });

  } catch (error) {
    console.error('Erreur lors de la modification de l\'utilisateur:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la modification de l\'utilisateur'
      },
      { status: 500 }
    );
  }
}

// La suppression d'utilisateurs se fait via Clerk Dashboard
// On peut seulement désactiver localement avec isActive: false