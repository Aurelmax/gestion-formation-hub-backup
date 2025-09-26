import * as fs from 'fs';
import * as path from 'path';

/**
 * Script ultra-précis pour corriger les 10 endpoints restants
 * Objectif: 75% → 100% de protection
 */

function fixUltraPrecise() {
  console.log('🔧 CORRECTION ULTRA-PRÉCISE POUR 100% DE PROTECTION');
  console.log('==================================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier de manière ultra-précise
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      console.log(`\n🔍 Analyse de ${path.relative(process.cwd(), filePath)}:`);

      // 1. Détecter et corriger les handlers sans try/catch
      const functionWithoutTryRegex = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{\s*\/\/ Vérifier l'authentification/g;
      if (functionWithoutTryRegex.test(content)) {
        content = content.replace(functionWithoutTryRegex, (match) => {
          return match.replace('{', `{
  try {
    // Vérifier l'authentification`);
        });
        modified = true;
        console.log(`  ✅ Bloc try/catch ajouté`);
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
        console.log(`  ✅ Catch sans retour d'erreur corrigé`);
      }

      // 3. Uniformiser toutes les réponses d'erreur serveur
      const serverErrorRegex = /return\s+NextResponse\.json\(\s*{\s*error:\s*["'][^"']*["']\s*},\s*{\s*status:\s*500\s*}\s*\)/g;
      if (serverErrorRegex.test(content)) {
        content = content.replace(serverErrorRegex, `return NextResponse.json(
    { error: "Erreur interne du serveur" },
    { status: 500 }
  )`);
        modified = true;
        console.log(`  ✅ Format erreur serveur uniformisé`);
      }

      // 4. Ajouter les blocs try/catch manquants pour les fonctions sans protection
      const functionWithoutTryCatchRegex = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{\s*const\s+authResult/g;
      if (functionWithoutTryCatchRegex.test(content)) {
        content = content.replace(functionWithoutTryCatchRegex, (match) => {
          return match.replace('{', `{
  try {
    const authResult`);
        });
        modified = true;
        console.log(`  ✅ Bloc try/catch ajouté pour fonction sans protection`);
      }

      // 5. S'assurer que tous les imports sont présents
      if (!content.includes('import { NextRequest, NextResponse }')) {
        const lines = content.split('\n');
        const importLine = "import { NextRequest, NextResponse } from 'next/server';";
        lines.splice(0, 0, importLine);
        content = lines.join('\n');
        modified = true;
        console.log(`  ✅ Import NextResponse ajouté`);
      }

      // 6. Corriger les fonctions qui n'ont pas de structure try/catch complète
      const incompleteTryCatchRegex = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{\s*try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]*\);\s*\}/g;
      if (incompleteTryCatchRegex.test(content)) {
        content = content.replace(incompleteTryCatchRegex, (match) => {
          return match.replace(/} catch \([^)]*\) \{\s*console\.error\([^)]*\);\s*\}/, `} catch (error) {
  console.error("Erreur interne du serveur:", error);
  return NextResponse.json(
    { error: "Erreur interne du serveur" },
    { status: 500 }
  );
}`);
        });
        modified = true;
        console.log(`  ✅ Structure try/catch complétée`);
      }

      // 7. Ajouter les blocs try/catch manquants pour les fonctions sans protection
      const functionWithoutTryCatchRegex2 = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{\s*\/\/ Vérifier l'authentification/g;
      if (functionWithoutTryCatchRegex2.test(content)) {
        content = content.replace(functionWithoutTryCatchRegex2, (match) => {
          return match.replace('{', `{
  try {
    // Vérifier l'authentification`);
        });
        modified = true;
        console.log(`  ✅ Bloc try/catch ajouté pour fonction sans protection`);
      }

      // 8. Ajouter les retours d'erreur manquants dans les catch
      const catchWithoutErrorRegex2 = /} catch \(error\) \{\s*console\.error\([^)]*\);\s*\}/g;
      if (catchWithoutErrorRegex2.test(content)) {
        content = content.replace(catchWithoutErrorRegex2, `} catch (error) {
  console.error("Erreur interne du serveur:", error);
  return NextResponse.json(
    { error: "Erreur interne du serveur" },
    { status: 500 }
  );
}`);
        modified = true;
        console.log(`  ✅ Catch sans retour d'erreur corrigé`);
      }

      // 9. Corriger les fonctions qui n'ont pas de structure try/catch complète
      const incompleteTryCatchRegex2 = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*\{\s*try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]*\);\s*\}/g;
      if (incompleteTryCatchRegex2.test(content)) {
        content = content.replace(incompleteTryCatchRegex2, (match) => {
          return match.replace(/} catch \([^)]*\) \{\s*console\.error\([^)]*\);\s*\}/, `} catch (error) {
  console.error("Erreur interne du serveur:", error);
  return NextResponse.json(
    { error: "Erreur interne du serveur" },
    { status: 500 }
  );
}`);
        });
        modified = true;
        console.log(`  ✅ Structure try/catch complétée`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
        console.log(`  🎉 Fichier corrigé !`);
      } else {
        console.log(`  ℹ️ Aucune correction nécessaire`);
      }

    } catch (error: any) {
      console.log(`  ❌ Erreur: ${error.message}`);
    }
  }

  // Endpoints à corriger pour atteindre 100% (les 10 restants)
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

  console.log('🔧 Correction ultra-précise des 10 endpoints restants...');
  endpointsToFix.forEach(endpoint => {
    const fullPath = path.join(process.cwd(), endpoint);
    if (fs.existsSync(fullPath)) {
      fixFile(fullPath);
    } else {
      console.log(`  ⚠️ ${endpoint} - Fichier non trouvé`);
    }
  });

  console.log(`\n📊 RÉSUMÉ DE LA CORRECTION ULTRA-PRÉCISE`);
  console.log('==========================================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections ultra-précises appliquées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npm run audit:standardized');
    console.log('  2. Tester avec: npm run verify:protections');
    console.log('  3. Objectif: 100% de protection !');
  }

  return fixedCount > 0;
}

// Exécution de la correction ultra-précise
const success = fixUltraPrecise();
process.exit(success ? 0 : 1);
