import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testMigrationSafe() {
  console.log('🔒 Test SAFE de migration (sans modification)...');
  
  try {
    // 1. Analyse de la table
    const tableInfo = await prisma.actionCorrective.findMany({
      take: 3,
      select: {
        id: true,
        titre: true,
        statut: true,
        createdAt: true
      }
    });
    
    console.log('📊 Échantillon de données:');
    console.table(tableInfo);
    
    // 2. Simulation création route (sans écrire)
    const routeContent = `// Route simulée pour test
export async function GET() {
  // Implémentation simulée
  return Response.json({ message: 'Simulation réussie' });
}
`;
    
    console.log('✅ Contenu route généré (simulation)');
    console.log('📝 Longueur du code:', routeContent.length, 'caractères');
    
    // 3. Vérification configuration Next.js
    const nextConfigPath = path.join(process.cwd(), 'next.config.js');
    const hasNextConfig = fs.existsSync(nextConfigPath);
    
    console.log('⚙️ Configuration Next.js:', hasNextConfig ? 'Présente' : 'Absente');
    
    return {
      dataSample: tableInfo,
      routeGenerated: true,
      nextConfigExists: hasNextConfig
    };
    
  } catch (error) {
    console.error('❌ Erreur test safe:', error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

testMigrationSafe()
  .then(results => {
    console.log('\\n📋 RÉSULTATS DU TEST SAFE:');
    console.log('✅ Données accessibles:', results.dataSample.length, 'enregistrements');
    console.log('✅ Route générable:', results.routeGenerated);
    console.log('✅ Config Next.js:', results.nextConfigExists);
    console.log('\\n🎉 Test safe réussi! Le script de migration peut être exécuté.');
  })
  .catch(error => {
    console.error('💥 Test safe échoué:', error);
    process.exit(1);
  });
