import { PrismaClient } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';

const prisma = new PrismaClient();

async function migrateUsersToClerk() {
  console.log('🚀 Début de la migration vers Clerk...');

  try {
    // Récupérer tous les utilisateurs existants
    const users = await prisma.user.findMany({
      where: {
        clerkId: null, // Seulement les utilisateurs qui n'ont pas encore de clerkId
      },
    });

    console.log(`📊 ${users.length} utilisateurs à migrer`);

    for (const user of users) {
      try {
        // Générer un ID temporaire pour la migration
        const tempClerkId = `temp_${createId()}`;
        
        // Mettre à jour l'utilisateur avec un clerkId temporaire
        await prisma.user.update({
          where: { id: user.id },
          data: {
            clerkId: tempClerkId,
            // Marquer comme nécessitant une synchronisation manuelle
            name: user.name || `${user.nom || ''} ${user.prenom || ''}`.trim() || user.email,
          },
        });

        console.log(`✅ Utilisateur ${user.email} migré avec ID temporaire: ${tempClerkId}`);
      } catch (error) {
        console.error(`❌ Erreur lors de la migration de l'utilisateur ${user.email}:`, error);
      }
    }

    console.log('🎉 Migration terminée !');
    console.log('📝 Note: Vous devrez créer manuellement les utilisateurs dans Clerk et mettre à jour les clerkId dans la base de données.');
    
  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateUsersToClerk();
