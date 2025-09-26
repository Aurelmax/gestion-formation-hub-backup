import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger automatiquement toutes les duplications finales
 */

function fixFinalDuplications() {
  console.log('🔧 CORRECTION FINALE DES DUPLICATIONS');
  console.log('=====================================');

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

      // 4. Corriger les duplications de requireAuthWithRole
      const requireAuthWithRoleDuplicationRegex = /const authResult = await requireAuthWithRole\('admin'\);\s*if \(!authResult\.isAuthenticated\) \{\s*return authResult\.error!;\s*\}\s*const authResult = await requireAuthWithRole\('admin'\);\s*if \(!authResult\.isAuthenticated\) \{\s*return authResult\.error!;\s*\}/g;
      if (requireAuthWithRoleDuplicationRegex.test(content)) {
        content = content.replace(requireAuthWithRoleDuplicationRegex, (match) => {
          const lines = match.split('\n');
          const firstAuthBlock = lines.slice(0, lines.indexOf('    }') + 1);
          return firstAuthBlock.join('\n');
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Duplication requireAuthWithRole corrigée`);
      }

      // 5. Corriger les espaces en trop
      const extraSpacesRegex = /\n\s*\n\s*\n/g;
      if (extraSpacesRegex.test(content)) {
        content = content.replace(extraSpacesRegex, '\n\n');
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Espaces en trop supprimés`);
      }

      // 6. Corriger les duplications de vérification d'authentification
      const authCheckDuplicationRegex = /if \(!authResult\.isAuthenticated\) \{\s*return authResult\.error!;\s*\}\s*if \(!authResult\.isAuthenticated\) \{\s*return authResult\.error!;\s*\}/g;
      if (authCheckDuplicationRegex.test(content)) {
        content = content.replace(authCheckDuplicationRegex, (match) => {
          const lines = match.split('\n');
          const firstAuthBlock = lines.slice(0, lines.indexOf('    }') + 1);
          return firstAuthBlock.join('\n');
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Duplication de vérification d'authentification corrigée`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }

    } catch (error: any) {
      console.log(`  ❌ ${path.relative(process.cwd(), filePath)} - Erreur: ${error.message}`);
    }
  }

  // Endpoints spécifiques à corriger
  const specificEndpoints = [
    'app/api/accessibilite/demandes/[id]/route.ts',
    'app/api/accessibilite/plans/[id]/route.ts',
    'app/api/actions-correctives/[id]/route.ts',
    'app/api/categories/[id]/route.ts',
    'app/api/competences/[id]/route.ts',
    'app/api/programmes-formation/[id]/route.ts',
    'app/api/reclamations/[id]/route.ts',
    'app/api/rendezvous/[id]/route.ts',
    'app/api/rendezvous/[id]/statut/route.ts',
    'app/api/veille/[id]/route.ts',
    'app/api/veille/[id]/commentaire/route.ts',
    'app/api/veille/[id]/commentaires/[commentaireId]/route.ts',
    'app/api/veille/[id]/documents/route.ts',
    'app/api/files/veille/[veilleId]/[filename]/route.ts',
    'app/api/programmes-formation/by-code/[code]/route.ts',
    'app/api/categories/route.ts',
    'app/api/categories-programme/route.ts',
    'app/api/programmes-formation/route.ts',
  ];

  console.log('🔧 Correction des duplications finales...');
  specificEndpoints.forEach(endpoint => {
    const fullPath = path.join(process.cwd(), endpoint);
    if (fs.existsSync(fullPath)) {
      fixFile(fullPath);
    } else {
      console.log(`  ⚠️ ${endpoint} - Fichier non trouvé`);
    }
  });

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
const success = fixFinalDuplications();
process.exit(success ? 0 : 1);
