import * as fs from 'fs';
import * as path from 'path';

/**
 * Script final pour corriger les derniers problèmes
 */

function fixFinalIssues() {
  console.log('🔧 CORRECTION FINALE DES DERNIERS PROBLÈMES');
  console.log('==========================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Corriger les retours d'erreur serveur qui ne sont pas au bon format
      const serverErrorRegex = /return\s+NextResponse\.json\(\s*{\s*error:\s*["'][^"']*["']\s*},\s*{\s*status:\s*500\s*}\s*\)/g;
      if (serverErrorRegex.test(content)) {
        content = content.replace(serverErrorRegex, `return NextResponse.json(
    { error: "Erreur serveur" },
    { status: 500 }
  )`);
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Format erreur serveur corrigé`);
      }

      // 2. Ajouter les retours d'erreur manquants dans les catch
      const catchWithoutErrorRegex = /} catch \(error\) \{\s*console\.error\([^)]*\);\s*\}/g;
      if (catchWithoutErrorRegex.test(content)) {
        content = content.replace(catchWithoutErrorRegex, `} catch (error) {
  console.error("Erreur serveur:", error);
  return NextResponse.json(
    { error: "Erreur serveur" },
    { status: 500 }
  );
}`);
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Catch sans retour d'erreur corrigé`);
      }

      // 3. Ajouter les blocs try/catch manquants
      const functionWithoutTryRegex = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{\s*\/\/ Vérifier l'authentification/g;
      if (functionWithoutTryRegex.test(content)) {
        content = content.replace(functionWithoutTryRegex, (match) => {
          return match.replace('{', `{
  try {
    // Vérifier l'authentification`);
        });
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Bloc try/catch ajouté`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }

    } catch (error: any) {
      console.log(`  ❌ ${path.relative(process.cwd(), filePath)} - Erreur: ${error.message}`);
    }
  }

  // Endpoints à corriger (ceux qui ont encore des problèmes)
  const endpointsToFix = [
    'app/api/accessibilite/demandes/route.ts',
    'app/api/accessibilite/plans/route.ts',
    'app/api/auth/[...nextauth]/route.ts',
    'app/api/categories/programmes/route.ts',
    'app/api/conformite/route.ts',
    'app/api/csrf/route.ts',
    'app/api/programmes-formation/by-code/[code]/route.ts',
    'app/api/programmes-formation/par-categorie/groupes/route.ts',
    'app/api/programmes-formation/par-categorie/groups/route.ts',
    'app/api/programmes-formation/par-categorie/route.ts',
    'app/api/rendezvous/route.ts',
    'app/api/test-route/route.ts',
  ];

  console.log('🔧 Correction des derniers problèmes...');
  endpointsToFix.forEach(endpoint => {
    const fullPath = path.join(process.cwd(), endpoint);
    if (fs.existsSync(fullPath)) {
      fixFile(fullPath);
    } else {
      console.log(`  ⚠️ ${endpoint} - Fichier non trouvé`);
    }
  });

  console.log(`\n📊 RÉSUMÉ DES CORRECTIONS FINALES`);
  console.log('==================================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections finales appliquées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npm run audit:functional');
    console.log('  2. Tester avec: npm run verify:protections');
  }

  return fixedCount > 0;
}

// Exécution des corrections finales
const success = fixFinalIssues();
process.exit(success ? 0 : 1);
