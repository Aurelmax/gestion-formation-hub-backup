import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testClerkIntegration() {
  console.log('🧪 Test de l\'intégration Clerk...');

  try {
    // Test 1: Vérifier la connexion à la base de données
    console.log('1️⃣ Test de connexion à la base de données...');
    await prisma.$connect();
    console.log('✅ Connexion à la base de données réussie');

    // Test 2: Vérifier si la colonne clerkId existe
    console.log('2️⃣ Vérification de la colonne clerkId...');
    const result = await prisma.$queryRaw`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' 
      AND column_name = 'clerkId'
    `;

    if (Array.isArray(result) && result.length > 0) {
      console.log('✅ La colonne clerkId existe');
    } else {
      console.log('❌ La colonne clerkId n\'existe pas. Exécutez le script SQL: scripts/add-clerk-id.sql');
    }

    // Test 3: Compter les utilisateurs existants
    console.log('3️⃣ Comptage des utilisateurs existants...');
    const userCount = await prisma.user.count();
    console.log(`📊 Nombre d'utilisateurs: ${userCount}`);

    // Test 4: Vérifier les utilisateurs avec clerkId
    const usersWithClerkId = await prisma.user.count({
      where: {
        clerkId: {
          not: null
        }
      }
    });
    console.log(`📊 Utilisateurs avec clerkId: ${usersWithClerkId}`);

    console.log('🎉 Tests terminés avec succès !');

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testClerkIntegration();
