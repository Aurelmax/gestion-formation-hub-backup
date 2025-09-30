import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { isCurrentUserAdmin } from '@/lib/clerk-sync';

export async function GET() {
  try {
    const { userId } = await auth();

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

    const users = await prisma.user.findMany({
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
        updatedAt: true,
        _count: {
          select: {
            sessions: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const formattedUsers = users.map(user => ({
      id: user.id,
      clerkId: user.clerkId,
      email: user.email || '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      name: user.name || '',
      role: user.role,
      isActive: user.isActive,
      emailVerified: user.emailVerifiedBoolean,
      image: user.image,
      lastLoginAt: user.lastLoginAt?.toISOString(),
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      _count: {
        sessions: user._count.sessions
      }
    }));

    return NextResponse.json(formattedUsers);

  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des utilisateurs'
      },
      { status: 500 }
    );
  }
}

// Les utilisateurs sont créés automatiquement par Clerk
// Cette API ne gère que la lecture et la synchronisation