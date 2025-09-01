import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔗 Test de connexion à la base de données...');
    
    // Test simple de connexion
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Connexion BD réussie');
    
    // Test des données actions-correctives
    const count = await prisma.actionCorrective.count();
    console.log(`📊 ${count} actions correctives dans la base`);
    
  } catch (error) {
    console.error('❌ Erreur de connexion BD:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
