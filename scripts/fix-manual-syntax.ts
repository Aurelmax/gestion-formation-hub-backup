import * as fs from 'fs';
import * as path from 'path';

/**
 * Script de réparation manuelle des erreurs de syntaxe
 * Problème: blocs catch orphelins et structures malformées
 */

function fixManualSyntax() {
  console.log('🔧 RÉPARATION MANUELLE DES ERREURS DE SYNTAXE');
  console.log('============================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier spécifique
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      console.log(`\n🔍 Analyse de ${path.relative(process.cwd(), filePath)}:`);

      // 1. Supprimer les blocs catch orphelins
      const orphanCatchRegex = /^\s*}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}\s*$/gm;
      const orphanCatches = content.match(orphanCatchRegex);
      if (orphanCatches) {
        content = content.replace(orphanCatchRegex, '');
        modified = true;
        console.log(`  ✅ ${orphanCatches.length} blocs catch orphelins supprimés`);
      }

      // 2. Corriger les structures try/catch malformées
      const malformedTryCatchRegex = /try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}/g;
      if (malformedTryCatchRegex.test(content)) {
        content = content.replace(malformedTryCatchRegex, (match) => {
          // Garder seulement le premier try/catch
          const firstTryCatch = match.split('} catch')[0] + '} catch (error) {\n    console.error("Erreur serveur:", error);\n    return NextResponse.json(\n      { error: "Erreur interne du serveur" },\n      { status: 500 }\n    );\n  }';
          return firstTryCatch;
        });
        modified = true;
        console.log(`  ✅ Structures try/catch dupliquées corrigées`);
      }

      // 3. Corriger les accolades manquantes ou en trop
      const missingBracesRegex = /export async function [^{]*\{[\s\S]*?try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}\s*(?=\n\s*export|\n\s*$)/g;
      if (missingBracesRegex.test(content)) {
        content = content.replace(missingBracesRegex, (match) => {
          // Compter les accolades ouvrantes et fermantes
          const openBraces = (match.match(/\{/g) || []).length;
          const closeBraces = (match.match(/\}/g) || []).length;
          
          if (openBraces > closeBraces) {
            return match + '\n}';
          }
          return match;
        });
        modified = true;
        console.log(`  ✅ Accolades manquantes ajoutées`);
      }

      // 4. Nettoyer les lignes vides en trop
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
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

  // Liste des fichiers problématiques identifiés
  const problematicFiles = [
    'app/api/accessibilite/demandes/[id]/route.ts',
    'app/api/accessibilite/demandes/route.ts',
    'app/api/accessibilite/plans/[id]/route.ts',
    'app/api/accessibilite/plans/route.ts',
    'app/api/actions-correctives/[id]/route.ts',
    'app/api/actions-correctives/route.ts',
    'app/api/apprenants/route.ts',
    'app/api/auth/[...nextauth]/route.ts',
    'app/api/categories/programmes/route.ts',
    'app/api/categories/route.ts',
    'app/api/competences/[id]/route.ts',
    'app/api/competences/route.ts',
    'app/api/conformite/route.ts',
    'app/api/debug/route.ts',
    'app/api/documents/route.ts',
    'app/api/dossiers-formation/route.ts',
    'app/api/formations/route.ts',
    'app/api/health/route.ts',
    'app/api/positionnement/route.ts',
    'app/api/programmes-formation/[id]/route.ts',
    'app/api/programmes-formation/duplicate/route.ts',
    'app/api/programmes-formation/par-categorie/groupes/route.ts',
    'app/api/programmes-formation/par-categorie/route.ts',
    'app/api/programmes-formation/route.ts',
    'app/api/protected/example/route.ts',
    'app/api/reclamations/[id]/route.ts',
    'app/api/reclamations/route.ts',
    'app/api/rendezvous/[id]/route.ts',
    'app/api/rendezvous/route.ts',
    'app/api/test-route/route.ts',
    'app/api/veille/[id]/documents/route.ts',
    'app/api/veille/route.ts',
    'app/api/webhooks/clerk/route.ts'
  ];

  console.log('🔧 Réparation manuelle des erreurs de syntaxe...');
  
  problematicFiles.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      fixFile(fullPath);
    }
  });

  console.log(`\n📊 RÉSUMÉ DE LA RÉPARATION MANUELLE`);
  console.log('====================================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Erreurs de syntaxe réparées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npx tsc --noEmit');
    console.log('  2. Tester avec: npm run audit:standardized');
  }

  return fixedCount > 0;
}

// Exécution de la réparation manuelle
const success = fixManualSyntax();
process.exit(success ? 0 : 1);
