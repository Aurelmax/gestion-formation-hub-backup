import { auth, clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export interface ClerkUserData {
  id: string;
  emailAddresses: Array<{
    emailAddress?: string;
    email_address?: string;
    verification?: {
      status: string;
    };
  }>;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  lastSignInAt?: number;
}

/**
 * Synchronise un utilisateur Clerk avec notre base de données locale
 */
export async function syncClerkUser(clerkUser: ClerkUserData) {
  const primaryEmail = clerkUser.emailAddresses[0];
  const emailAddress = primaryEmail?.emailAddress || primaryEmail?.email_address;
  const fullName = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ');

  const userData = {
    clerkId: clerkUser.id,
    email: emailAddress || null,
    firstName: clerkUser.firstName || null,
    lastName: clerkUser.lastName || null,
    name: fullName || null,
    emailVerifiedBoolean: primaryEmail?.verification?.status === 'verified',
    image: clerkUser.imageUrl || null,
    lastLoginAt: clerkUser.lastSignInAt ? new Date(clerkUser.lastSignInAt) : null,
  };

  // Créer ou mettre à jour l'utilisateur
  return await prisma.user.upsert({
    where: { clerkId: clerkUser.id },
    update: {
      ...userData,
      updatedAt: new Date(),
    },
    create: {
      ...userData,
      role: 'user', // Rôle par défaut
    },
  });
}

/**
 * Récupère l'utilisateur actuel depuis Clerk et le synchronise
 */
export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  // Vérifier si l'utilisateur existe déjà en local
  let localUser = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  // Si l'utilisateur n'existe pas, le créer en récupérant les données de Clerk
  if (!localUser) {
    const client = await clerkClient();
    const clerkUser = await client.users.getUser(userId);
    localUser = await syncClerkUser(clerkUser);
  }

  return localUser;
}

/**
 * Vérifie si l'utilisateur actuel est admin
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === 'admin';
}

/**
 * Met à jour le rôle d'un utilisateur
 */
export async function updateUserRole(clerkId: string, role: 'admin' | 'user') {
  return await prisma.user.update({
    where: { clerkId },
    data: {
      role,
      updatedAt: new Date()
    }
  });
}