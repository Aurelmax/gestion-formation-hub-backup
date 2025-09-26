import { prisma } from '@/lib/prisma';
import { User } from '@clerk/nextjs/server';

export async function syncClerkUser(clerkUser: User) {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id }
    });

    if (existingUser) {
      // Mettre à jour l'utilisateur existant
      return await prisma.user.update({
        where: { clerkId: clerkUser.id },
        data: {
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || '',
          image: clerkUser.imageUrl || '',
          role: (clerkUser.publicMetadata?.role as string) || 'user',
          updatedAt: new Date(),
        }
      });
    } else {
      // Créer un nouvel utilisateur
      return await prisma.user.create({
        data: {
          clerkId: clerkUser.id,
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          name: clerkUser.fullName || '',
          image: clerkUser.imageUrl || '',
          role: (clerkUser.publicMetadata?.role as string) || 'user',
        }
      });
    }
  } catch (error) {
    console.error('Erreur lors de la synchronisation de l\'utilisateur Clerk:', error);
    throw error;
  }
}

export async function deleteClerkUser(clerkId: string) {
  try {
    return await prisma.user.delete({
      where: { clerkId }
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur Clerk:', error);
    throw error;
  }
}
