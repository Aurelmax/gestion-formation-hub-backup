import { validateSecrets, secureConfig } from '../app/lib/secure-env';

async function validateEnvironmentSecrets() {
  console.log('🔐 Validation des secrets d\'environnement');
  console.log('==========================================');

  try {
    // Valider tous les secrets
    validateSecrets();
    
    console.log('\n✅ Secrets validés avec succès:');
    console.log(`  - Clerk Publishable Key: ${secureConfig.clerk.publishableKey.substring(0, 10)}...`);
    console.log(`  - Clerk Secret Key: ${secureConfig.clerk.secretKey.substring(0, 10)}...`);
    console.log(`  - Database URL: ${secureConfig.database.url.substring(0, 20)}...`);
    console.log(`  - API Base URL: ${secureConfig.api.baseUrl}`);
    
    console.log('\n🛡️ Niveau de sécurité des secrets:');
    console.log('  ✅ Aucun fallback faible détecté');
    console.log('  ✅ Secrets de longueur suffisante');
    console.log('  ✅ URLs sécurisées en production');
    console.log('  ✅ Validation stricte des variables');
    
    console.log('\n🎯 Recommandations de sécurité:');
    console.log('  - Utilisez des secrets générés aléatoirement');
    console.log('  - Ne commitez jamais les fichiers .env');
    console.log('  - Utilisez des gestionnaires de secrets en production');
    console.log('  - Rotation régulière des secrets');
    
    console.log('\n🎉 Validation des secrets terminée avec succès !');
    
  } catch (error) {
    console.error('\n❌ Erreur de validation des secrets:', error);
    process.exit(1);
  }
}

validateEnvironmentSecrets();
