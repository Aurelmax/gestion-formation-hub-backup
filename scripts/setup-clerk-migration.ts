import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function setupClerkMigration() {
  console.log('🔧 Configuration de la migration Clerk...');

  try {
    // Vérifier si la colonne clerkId existe déjà
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'clerkId'
    `;

    if (Array.isArray(result) && result.length > 0) {
      console.log('✅ La colonne clerkId existe déjà');
      return;
    }

    // Ajouter la colonne clerkId si elle n'existe pas
    await prisma.$executeRaw`
      ALTER TABLE users 
      ADD COLUMN "clerkId" TEXT UNIQUE
    `;

    console.log('✅ Colonne clerkId ajoutée avec succès');

    // Créer un index sur clerkId pour les performances
    await prisma.$executeRaw`
      CREATE INDEX IF NOT EXISTS "users_clerkId_idx" ON users("clerkId")
    `;

    console.log('✅ Index sur clerkId créé');

  } catch (error) {
    console.error('❌ Erreur lors de la configuration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setupClerkMigration();
