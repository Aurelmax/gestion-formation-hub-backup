import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger automatiquement la sécurité des endpoints API
 */

interface FixResult {
  file: string;
  fixed: boolean;
  errors: string[];
}

function fixAPISecurity() {
  console.log('🔧 CORRECTION AUTOMATIQUE DE LA SÉCURITÉ API');
  console.log('===========================================');

  const results: FixResult[] = [];
  const apiDir = path.join(process.cwd(), 'app/api');

  // Endpoints critiques à corriger en priorité
  const criticalEndpoints = [
    'app/api/accessibilite/demandes/route.ts',
    'app/api/accessibilite/plans/route.ts',
    'app/api/actions-correctives/route.ts',
    'app/api/categories/route.ts',
    'app/api/competences/[id]/route.ts',
    'app/api/documents/route.ts',
    'app/api/dossiers-formation/route.ts',
    'app/api/positionnement/route.ts',
    'app/api/programmes-formation/[id]/route.ts',
    'app/api/reclamations/[id]/route.ts',
    'app/api/rendezvous/[id]/route.ts',
    'app/api/veille/route.ts',
  ];

  // Fonction pour corriger un fichier
  function fixFile(filePath: string): FixResult {
    const result: FixResult = {
      file: filePath,
      fixed: false,
      errors: []
    };

    try {
      let content = fs.readFileSync(filePath, 'utf8');
      let modified = false;

      // 1. Ajouter l'import d'authentification s'il manque
      if (!content.includes('requireAuth') && !content.includes('requireAuthWithRole')) {
        const importLine = "import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';";
        
        // Trouver la position après les imports existants
        const lines = content.split('\n');
        let insertIndex = 0;
        
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('import ') || lines[i].startsWith("import ")) {
            insertIndex = i + 1;
          } else if (lines[i].trim() === '' && insertIndex > 0) {
            break;
          }
        }
        
        lines.splice(insertIndex, 0, importLine);
        content = lines.join('\n');
        modified = true;
      }

      // 2. Ajouter la protection aux fonctions GET
      const getFunctionRegex = /export async function GET\([^)]*\)\s*{/g;
      content = content.replace(getFunctionRegex, (match) => {
        if (!match.includes('requireAuth')) {
          return match + '\n  try {\n    // Vérifier l\'authentification\n    const authResult = await requireAuth();\n    if (!authResult.isAuthenticated) {\n      return authResult.error!;\n    }\n\n    ';
        }
        return match;
      });

      // 3. Ajouter la protection aux fonctions POST/PUT/DELETE
      const modifyFunctionRegex = /export async function (POST|PUT|DELETE|PATCH)\([^)]*\)\s*{/g;
      content = content.replace(modifyFunctionRegex, (match) => {
        if (!match.includes('requireAuth')) {
          return match + '\n  try {\n    // Vérifier l\'authentification et les permissions admin\n    const authResult = await requireAuthWithRole(\'admin\');\n    if (!authResult.isAuthenticated) {\n      return authResult.error!;\n    }\n\n    ';
        }
        return match;
      });

      // 4. Corriger les fonctions qui n'ont pas de try/catch
      const functionsWithoutTry = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*{\s*$/gm;
      content = content.replace(functionsWithoutTry, (match) => {
        if (!match.includes('try {')) {
          return match + '\n  try {';
        }
        return match;
      });

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        result.fixed = true;
      }

    } catch (error: any) {
      result.errors.push(`Erreur lors de la correction: ${error.message}`);
    }

    return result;
  }

  // Corriger les endpoints critiques
  console.log('🔧 Correction des endpoints critiques...');
  criticalEndpoints.forEach(endpoint => {
    const fullPath = path.join(process.cwd(), endpoint);
    if (fs.existsSync(fullPath)) {
      const result = fixFile(fullPath);
      results.push(result);
      
      if (result.fixed) {
        console.log(`  ✅ ${endpoint} - Corrigé`);
      } else {
        console.log(`  ⚠️ ${endpoint} - Aucune modification nécessaire`);
      }
      
      if (result.errors.length > 0) {
        console.log(`  ❌ ${endpoint} - Erreurs: ${result.errors.join(', ')}`);
      }
    } else {
      console.log(`  ⚠️ ${endpoint} - Fichier non trouvé`);
    }
  });

  // Résumé des corrections
  console.log('\n📊 RÉSUMÉ DES CORRECTIONS');
  console.log('==========================');

  const fixedCount = results.filter(r => r.fixed).length;
  const errorCount = results.filter(r => r.errors.length > 0).length;

  console.log(`✅ Fichiers corrigés: ${fixedCount}/${results.length}`);
  console.log(`❌ Fichiers avec erreurs: ${errorCount}/${results.length}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections appliquées avec succès !');
    console.log('📝 N\'oubliez pas de tester les endpoints après les corrections.');
  }

  if (errorCount > 0) {
    console.log('\n⚠️ Certains fichiers ont des erreurs et nécessitent une correction manuelle.');
  }

  return fixedCount > 0;
}

// Exécution des corrections
const success = fixAPISecurity();
process.exit(success ? 0 : 1);
