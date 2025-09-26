import * as fs from 'fs';
import * as path from 'path';

/**
 * Script final pour atteindre 100% de protection
 */

function fix100Percent() {
  console.log('🔧 CORRECTION FINALE POUR 100% DE PROTECTION');
  console.log('============================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Ajouter les blocs try/catch manquants
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

      // 2. Ajouter les retours d'erreur manquants dans les catch
      const catchWithoutErrorRegex = /} catch \(error\) \{\s*console\.error\([^)]*\);\s*\}/g;
      if (catchWithoutErrorRegex.test(content)) {
        content = content.replace(catchWithoutErrorRegex, `} catch (error) {
  console.error("Erreur interne du serveur:", error);
  return NextResponse.json(
    { error: "Erreur interne du serveur" },
    { status: 500 }
  );
}`);
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Catch sans retour d'erreur corrigé`);
      }

      // 3. Standardiser les réponses d'erreur serveur
      const serverErrorRegex = /return\s+NextResponse\.json\(\s*{\s*error:\s*["'][^"']*["']\s*},\s*{\s*status:\s*500\s*}\s*\)/g;
      if (serverErrorRegex.test(content)) {
        content = content.replace(serverErrorRegex, `return NextResponse.json(
    { error: "Erreur interne du serveur" },
    { status: 500 }
  )`);
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Format erreur serveur standardisé`);
      }

      // 4. S'assurer que tous les imports sont présents
      if (!content.includes('import { NextRequest, NextResponse }')) {
        const lines = content.split('\n');
        const importLine = "import { NextRequest, NextResponse } from 'next/server';";
        lines.splice(0, 0, importLine);
        content = lines.join('\n');
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Import NextResponse ajouté`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }

    } catch (error: any) {
      console.log(`  ❌ ${path.relative(process.cwd(), filePath)} - Erreur: ${error.message}`);
    }
  }

  // Endpoints à corriger pour atteindre 100%
  const endpointsToFix = [
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

  console.log('🔧 Correction finale pour 100% de protection...');
  endpointsToFix.forEach(endpoint => {
    const fullPath = path.join(process.cwd(), endpoint);
    if (fs.existsSync(fullPath)) {
      fixFile(fullPath);
    } else {
      console.log(`  ⚠️ ${endpoint} - Fichier non trouvé`);
    }
  });

  console.log(`\n📊 RÉSUMÉ DE LA CORRECTION FINALE`);
  console.log('==================================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections finales appliquées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npm run audit:standardized');
    console.log('  2. Tester avec: npm run verify:protections');
  }

  return fixedCount > 0;
}

// Exécution de la correction finale
const success = fix100Percent();
process.exit(success ? 0 : 1);
