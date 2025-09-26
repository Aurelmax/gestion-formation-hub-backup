import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger les erreurs de syntaxe TypeScript
 * Problème: blocs try sans catch correspondant
 */

function fixSyntaxErrors() {
  console.log('🔧 CORRECTION DES ERREURS DE SYNTAXE TYPESCRIPT');
  console.log('==============================================');

  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      console.log(`\n🔍 Analyse de ${path.relative(process.cwd(), filePath)}:`);

      // 1. Corriger les blocs try sans catch
      const tryWithoutCatchRegex = /try\s*\{[\s\S]*?\}\s*(?=\n\s*export|\n\s*$|\n\s*\/\/)/g;
      if (tryWithoutCatchRegex.test(content)) {
        content = content.replace(tryWithoutCatchRegex, (match) => {
          return match + `
  } catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }`;
        });
        modified = true;
        console.log(`  ✅ Blocs try sans catch corrigés`);
      }

      // 2. Corriger les structures try/catch malformées
      const malformedTryCatchRegex = /try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{\s*console\.error\([^)]*\);\s*\}/g;
      if (malformedTryCatchRegex.test(content)) {
        content = content.replace(malformedTryCatchRegex, (match) => {
          return match.replace(/} catch \([^)]*\) \{\s*console\.error\([^)]*\);\s*\}/, `} catch (error) {
    console.error("Erreur serveur:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }`);
        });
        modified = true;
        console.log(`  ✅ Structures try/catch malformées corrigées`);
      }

      // 3. Ajouter les accolades manquantes
      const missingBracesRegex = /export async function [^{]*\{[\s\S]*?try\s*\{[\s\S]*?\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}\s*(?=\n\s*export|\n\s*$)/g;
      if (missingBracesRegex.test(content)) {
        content = content.replace(missingBracesRegex, (match) => {
          if (!match.endsWith('}')) {
            return match + '\n}';
          }
          return match;
        });
        modified = true;
        console.log(`  ✅ Accolades manquantes ajoutées`);
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

  console.log('🔧 Correction des erreurs de syntaxe...');
  scanAllRoutes(path.join(process.cwd(), 'app/api'));

  console.log(`\n📊 RÉSUMÉ DE LA CORRECTION DES ERREURS DE SYNTAXE`);
  console.log('================================================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Erreurs de syntaxe corrigées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Vérifier avec: npx tsc --noEmit');
    console.log('  2. Tester avec: npm run audit:standardized');
  }

  return fixedCount > 0;
}

// Exécution de la correction des erreurs de syntaxe
const success = fixSyntaxErrors();
process.exit(success ? 0 : 1);
