import * as fs from 'fs';
import * as path from 'path';

/**
 * Script de migration vers Clerk
 * Remplace NextAuth par Clerk dans tous les fichiers
 */

function migrateToClerk() {
  console.log('🔄 MIGRATION VERS CLERK');
  console.log('======================');

  let migratedCount = 0;

  // Fonction pour migrer un fichier
  function migrateFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      console.log(`\n🔍 Migration de ${path.relative(process.cwd(), filePath)}:`);

      // 1. Remplacer les imports NextAuth par Clerk
      if (content.includes('next-auth/react')) {
        content = content.replace(
          /import.*from ['"]next-auth\/react['"];?\s*/g,
          "import { useUser, useAuth } from '@clerk/nextjs';\n"
        );
        modified = true;
        console.log(`  ✅ Import NextAuth → Clerk`);
      }

      // 2. Remplacer SessionProvider par ClerkProvider
      if (content.includes('SessionProvider')) {
        content = content.replace(/SessionProvider/g, 'ClerkProvider');
        modified = true;
        console.log(`  ✅ SessionProvider → ClerkProvider`);
      }

      // 3. Remplacer useSession par useAuth
      if (content.includes('useSession')) {
        content = content.replace(/useSession\(\)/g, 'useAuth()');
        modified = true;
        console.log(`  ✅ useSession → useAuth`);
      }

      // 4. Remplacer les vérifications d'authentification
      if (content.includes('session?.user')) {
        content = content.replace(/session\?\.user/g, 'user');
        modified = true;
        console.log(`  ✅ session.user → user`);
      }

      if (content.includes('session?.user?.')) {
        content = content.replace(/session\?\.user\?\./g, 'user?.');
        modified = true;
        console.log(`  ✅ session.user. → user.`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        migratedCount++;
        console.log(`  🎉 Fichier migré !`);
      } else {
        console.log(`  ℹ️ Aucune migration nécessaire`);
      }

    } catch (error: any) {
      console.log(`  ❌ Erreur: ${error.message}`);
    }
  }

  // Scanner tous les fichiers à migrer
  const filesToMigrate = [
    'app/layout.tsx',
    'app/providers.tsx',
    'app/hooks/useAuth.tsx',
    'app/components/Navigation.tsx'
  ];

  console.log('🔄 Migration des fichiers...');
  
  filesToMigrate.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      migrateFile(fullPath);
    }
  });

  console.log(`\n📊 RÉSUMÉ DE LA MIGRATION`);
  console.log('=========================');
  console.log(`✅ Fichiers migrés: ${migratedCount}`);

  if (migratedCount > 0) {
    console.log('\n🎉 Migration vers Clerk terminée !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Configurer les variables d\'environnement Clerk');
    console.log('  2. Tester l\'authentification');
    console.log('  3. Vérifier les API routes');
  }

  return migratedCount > 0;
}

// Exécution de la migration
const success = migrateToClerk();
process.exit(success ? 0 : 1);
