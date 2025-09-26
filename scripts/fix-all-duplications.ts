import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger automatiquement toutes les duplications d'authentification
 */

function fixAllDuplications() {
  console.log('🔧 CORRECTION DE TOUTES LES DUPLICATIONS');
  console.log('========================================');

  const apiDir = path.join(process.cwd(), 'app/api');
  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Corriger les try en double
      const doubleTryRegex = /try\s*{\s*try\s*{/g;
      if (doubleTryRegex.test(content)) {
        content = content.replace(doubleTryRegex, 'try {');
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Try en double corrigé`);
      }

      // 2. Corriger les duplications d'authentification
      const authDuplicationRegex = /\/\/ Vérifier l'authentification[\s\S]*?return authResult\.error!;\s*}\s*\/\/ Vérifier l'authentification[\s\S]*?return authResult\.error!;\s*}/g;
      if (authDuplicationRegex.test(content)) {
        content = content.replace(authDuplicationRegex, (match) => {
          const lines = match.split('\n');
          const firstAuthBlock = lines.slice(0, lines.indexOf('    }') + 1);
          return firstAuthBlock.join('\n');
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Duplication d'authentification corrigée`);
      }

      // 3. Corriger les duplications de requireAuth
      const requireAuthDuplicationRegex = /const authResult = await requireAuth\(\);\s*if \(!authResult\.isAuthenticated\) \{\s*return authResult\.error!;\s*\}\s*const authResult = await requireAuth\(\);\s*if \(!authResult\.isAuthenticated\) \{\s*return authResult\.error!;\s*\}/g;
      if (requireAuthDuplicationRegex.test(content)) {
        content = content.replace(requireAuthDuplicationRegex, (match) => {
          const lines = match.split('\n');
          const firstAuthBlock = lines.slice(0, lines.indexOf('    }') + 1);
          return firstAuthBlock.join('\n');
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Duplication requireAuth corrigée`);
      }

      // 4. Corriger les espaces en trop
      const extraSpacesRegex = /\n\s*\n\s*\n/g;
      if (extraSpacesRegex.test(content)) {
        content = content.replace(extraSpacesRegex, '\n\n');
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Espaces en trop supprimés`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }

    } catch (error: any) {
      console.log(`  ❌ ${path.relative(process.cwd(), filePath)} - Erreur: ${error.message}`);
    }
  }

  // Scanner tous les fichiers route.ts
  function scanAllRoutes(dir: string) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanAllRoutes(fullPath);
      } else if (item === 'route.ts') {
        fixFile(fullPath);
      }
    });
  }

  // Démarrer la correction
  console.log('🔧 Correction de toutes les duplications...');
  scanAllRoutes(apiDir);

  console.log(`\n📊 RÉSUMÉ DES CORRECTIONS`);
  console.log('========================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections appliquées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npm run verify:protections');
    console.log('  2. Tester avec: npm run audit:api');
  }

  return fixedCount > 0;
}

// Exécution des corrections
const success = fixAllDuplications();
process.exit(success ? 0 : 1);
