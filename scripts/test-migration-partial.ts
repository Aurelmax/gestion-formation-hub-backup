import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testPartialMigration() {
  console.log('🧪 Test partiel de migration...');
  
  try {
    // 1. Test connexion BD
    const count = await prisma.actionCorrective.count();
    console.log(`✅ BD accessible: ${count} actions`);
    
    // 2. Test création structure
    const routeDir = path.join(process.cwd(), 'app', 'api', 'actions-correctives-test');
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
      console.log('✅ Dossier de route créé');
    }
    
    // 3. Test écriture fichier
    const testFile = path.join(routeDir, 'test-route.ts');
    fs.writeFileSync(testFile, '// Test de fichier');
    console.log('✅ Fichier de test créé');
    
    // Nettoyage
    fs.rmSync(routeDir, { recursive: true, force: true });
    console.log('✅ Nettoyage effectué');
    
    return true;
    
  } catch (error) {
    console.error('❌ Erreur test partiel:', error.message);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testPartialMigration().then(success => {
  console.log(success ? '�� Test partiel réussi!' : '💥 Test partiel échoué');
  process.exit(success ? 0 : 1);
});
