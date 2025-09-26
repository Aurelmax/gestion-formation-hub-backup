import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger automatiquement les duplications d'authentification
 */

function fixAuthDuplications() {
  console.log('🔧 CORRECTION DES DUPLICATIONS D\'AUTHENTIFICATION');
  console.log('=================================================');

  const apiDir = path.join(process.cwd(), 'app/api');
  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Corriger les duplications d'authentification
      const authDuplicationRegex = /\/\/ Vérifier l'authentification et les permissions admin[\s\S]*?return authResult\.error!;\s*}\s*\/\/ Vérifier l'authentification[\s\S]*?return authResult\.error!;\s*}/g;
      if (authDuplicationRegex.test(content)) {
        content = content.replace(authDuplicationRegex, (match) => {
          // Garder seulement la première vérification (admin)
          const lines = match.split('\n');
          const firstAuthBlock = lines.slice(0, lines.indexOf('    }') + 1);
          return firstAuthBlock.join('\n');
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Duplication d'authentification corrigée`);
      }

      // 2. Corriger les duplications de requireAuth
      const requireAuthDuplicationRegex = /\/\/ Vérifier l'authentification[\s\S]*?return authResult\.error!;\s*}\s*\/\/ Vérifier l'authentification[\s\S]*?return authResult\.error!;\s*}/g;
      if (requireAuthDuplicationRegex.test(content)) {
        content = content.replace(requireAuthDuplicationRegex, (match) => {
          const lines = match.split('\n');
          const firstAuthBlock = lines.slice(0, lines.indexOf('    }') + 1);
          return firstAuthBlock.join('\n');
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Duplication requireAuth corrigée`);
      }

      // 3. Corriger les espaces en trop après les corrections
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
  ];

  console.log('🔧 Correction des duplications d\'authentification...');
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
const success = fixAuthDuplications();
process.exit(success ? 0 : 1);
