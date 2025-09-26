import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger les formats de réponse manquants
 */

function fixResponseFormats() {
  console.log('🔧 CORRECTION DES FORMATS DE RÉPONSE');
  console.log('====================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Corriger les retours d'erreur auth qui ne sont pas au bon format
      const authErrorRegex = /return\s+authResult\.error!/g;
      if (authErrorRegex.test(content)) {
        content = content.replace(authErrorRegex, `return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  )`);
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Format erreur auth corrigé`);
      }

      // 2. Corriger les retours d'erreur serveur qui ne sont pas au bon format
      const serverErrorRegex = /return\s+NextResponse\.json\(\s*{\s*error:\s*["'][^"']*["']\s*},\s*{\s*status:\s*500\s*}\s*\)/g;
      if (serverErrorRegex.test(content)) {
        content = content.replace(serverErrorRegex, `return NextResponse.json(
    { error: "Erreur serveur" },
    { status: 500 }
  )`);
        modified = true;
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Format erreur serveur corrigé`);
      }

      // 3. Ajouter les retours d'erreur manquants dans les catch
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

  // Endpoints à corriger (ceux qui ont des problèmes)
  const endpointsToFix = [
    'app/api/accessibilite/demandes/route.ts',
    'app/api/accessibilite/plans/route.ts',
    'app/api/actions-correctives/route.ts',
    'app/api/apprenants/route.ts',
    'app/api/auth/[...nextauth]/route.ts',
    'app/api/categories/programmes/route.ts',
    'app/api/competences/route.ts',
    'app/api/conformite/route.ts',
    'app/api/csrf/route.ts',
    'app/api/documents/route.ts',
    'app/api/dossiers-formation/route.ts',
    'app/api/formations/route.ts',
    'app/api/positionnement/route.ts',
    'app/api/programmes-formation/by-code/[code]/route.ts',
    'app/api/programmes-formation/duplicate/route.ts',
    'app/api/programmes-formation/par-categorie/groupes/route.ts',
    'app/api/programmes-formation/par-categorie/groups/route.ts',
    'app/api/programmes-formation/par-categorie/route.ts',
    'app/api/protected/example/route.ts',
    'app/api/reclamations/route.ts',
    'app/api/rendezvous/route.ts',
    'app/api/test-route/route.ts',
    'app/api/veille/route.ts',
  ];

  console.log('🔧 Correction des formats de réponse...');
  endpointsToFix.forEach(endpoint => {
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
    console.log('  1. Vérifier avec: npm run audit:functional');
    console.log('  2. Tester avec: npm run verify:protections');
  }

  return fixedCount > 0;
}

// Exécution des corrections
const success = fixResponseFormats();
process.exit(success ? 0 : 1);
