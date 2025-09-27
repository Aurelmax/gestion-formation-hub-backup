import * as fs from 'fs';
import * as path from 'path';

/**
 * Script de test de l'intégration Clerk
 * Vérifie que la configuration Clerk est correcte
 */

function testClerkIntegration() {
  console.log('🧪 TEST D\'INTÉGRATION CLERK');
  console.log('============================');

  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Fonction pour tester un fichier
  function testFile(filePath: string, description: string, testFunction: () => boolean) {
    testResults.total++;
    console.log(`\n🔍 ${description}:`);
    
    try {
      if (testFunction()) {
        testResults.passed++;
        console.log(`  ✅ ${description} - RÉUSSI`);
      } else {
        testResults.failed++;
        console.log(`  ❌ ${description} - ÉCHEC`);
      }
    } catch (error: any) {
      testResults.failed++;
      console.log(`  ❌ ${description} - ERREUR: ${error.message}`);
    }
  }

  // Test 1: Vérifier que ClerkProvider est configuré
  testFile('app/providers.tsx', 'ClerkProvider configuré', () => {
    const content = fs.readFileSync(path.join(process.cwd(), 'app/providers.tsx'), 'utf8');
    return content.includes('ClerkProvider') && content.includes('@clerk/nextjs');
  });

  // Test 2: Vérifier que les pages d'authentification existent
  testFile('app/auth/sign-in/page.tsx', 'Page de connexion', () => {
    const filePath = path.join(process.cwd(), 'app/auth/sign-in/page.tsx');
    return fs.existsSync(filePath);
  });

  testFile('app/auth/sign-up/page.tsx', 'Page d\'inscription', () => {
    const filePath = path.join(process.cwd(), 'app/auth/sign-up/page.tsx');
    return fs.existsSync(filePath);
  });

  // Test 3: Vérifier le webhook Clerk
  testFile('app/api/webhooks/clerk/route.ts', 'Webhook Clerk', () => {
    const filePath = path.join(process.cwd(), 'app/api/webhooks/clerk/route.ts');
    if (!fs.existsSync(filePath)) return false;
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('@clerk/nextjs/server') && content.includes('WebhookEvent');
  });

  // Test 4: Vérifier le hook d'authentification
  testFile('app/hooks/useAuth.tsx', 'Hook d\'authentification', () => {
    const filePath = path.join(process.cwd(), 'app/hooks/useAuth.tsx');
    if (!fs.existsSync(filePath)) return false;
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('@clerk/nextjs') && content.includes('useUser');
  });

  // Test 5: Vérifier l'API d'authentification
  testFile('app/lib/api-auth.ts', 'API d\'authentification', () => {
    const filePath = path.join(process.cwd(), 'app/lib/api-auth.ts');
    if (!fs.existsSync(filePath)) return false;
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('@clerk/nextjs/server') && content.includes('auth()');
  });

  // Test 6: Vérifier le composant de navigation
  testFile('app/components/Navigation.tsx', 'Composant de navigation', () => {
    const filePath = path.join(process.cwd(), 'app/components/Navigation.tsx');
    if (!fs.existsSync(filePath)) return false;
    
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('@clerk/nextjs') && content.includes('UserButton');
  });

  // Test 7: Vérifier les variables d'environnement
  testFile('.env.local', 'Variables d\'environnement', () => {
    const envPath = path.join(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
      console.log('  ⚠️  Fichier .env.local non trouvé - utilisez clerk.env.example');
      return false;
    }
    
    const content = fs.readFileSync(envPath, 'utf8');
    return content.includes('NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY') && 
           content.includes('CLERK_SECRET_KEY');
  });

  console.log(`\n📊 RÉSULTATS DES TESTS`);
  console.log('======================');
  console.log(`✅ Tests réussis: ${testResults.passed}`);
  console.log(`❌ Tests échoués: ${testResults.failed}`);
  console.log(`📊 Total: ${testResults.total}`);
  console.log(`📈 Taux de réussite: ${Math.round((testResults.passed / testResults.total) * 100)}%`);

  if (testResults.failed === 0) {
    console.log('\n🎉 INTÉGRATION CLERK COMPLÈTE !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Configurer les variables d\'environnement');
    console.log('  2. Tester l\'authentification en local');
    console.log('  3. Configurer les webhooks en production');
  } else {
    console.log('\n⚠️  INTÉGRATION INCOMPLÈTE');
    console.log('📝 Actions requises:');
    console.log('  1. Corriger les tests échoués');
    console.log('  2. Vérifier la configuration');
    console.log('  3. Relancer les tests');
  }

  return testResults.failed === 0;
}

// Exécution des tests
const success = testClerkIntegration();
process.exit(success ? 0 : 1);
