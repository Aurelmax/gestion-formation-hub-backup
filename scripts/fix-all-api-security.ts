import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger automatiquement TOUS les endpoints API restants
 */

interface FixResult {
  file: string;
  fixed: boolean;
  errors: string[];
  changes: string[];
}

function fixAllAPISecurity() {
  console.log('🔧 CORRECTION COMPLÈTE DE TOUS LES ENDPOINTS API');
  console.log('===============================================');

  const results: FixResult[] = [];
  const apiDir = path.join(process.cwd(), 'app/api');

  // Fonction pour corriger un fichier de manière avancée
  function fixFileAdvanced(filePath: string): FixResult {
    const result: FixResult = {
      file: filePath,
      fixed: false,
      errors: [],
      changes: []
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
        result.changes.push('Import d\'authentification ajouté');
      }

      // 2. Corriger les fonctions GET avec protection d'authentification
      const getFunctionRegex = /export async function GET\([^)]*\)\s*{/g;
      content = content.replace(getFunctionRegex, (match, offset) => {
        const beforeMatch = content.substring(0, offset);
        const afterMatch = content.substring(offset + match.length);
        
        // Vérifier si la protection existe déjà
        if (!beforeMatch.includes('requireAuth') && !afterMatch.includes('requireAuth')) {
          const protectedFunction = match + '\n  try {\n    // Vérifier l\'authentification\n    const authResult = await requireAuth();\n    if (!authResult.isAuthenticated) {\n      return authResult.error!;\n    }\n\n    ';
          modified = true;
          result.changes.push('Protection GET ajoutée');
          return protectedFunction;
        }
        return match;
      });

      // 3. Corriger les fonctions POST/PUT/DELETE/PATCH avec protection admin
      const modifyFunctionRegex = /export async function (POST|PUT|DELETE|PATCH)\([^)]*\)\s*{/g;
      content = content.replace(modifyFunctionRegex, (match, offset) => {
        const beforeMatch = content.substring(0, offset);
        const afterMatch = content.substring(offset + match.length);
        
        // Vérifier si la protection existe déjà
        if (!beforeMatch.includes('requireAuth') && !afterMatch.includes('requireAuth')) {
          const protectedFunction = match + '\n  try {\n    // Vérifier l\'authentification et les permissions admin\n    const authResult = await requireAuthWithRole(\'admin\');\n    if (!authResult.isAuthenticated) {\n      return authResult.error!;\n    }\n\n    ';
          modified = true;
          result.changes.push('Protection modification ajoutée');
          return protectedFunction;
        }
        return match;
      });

      // 4. Corriger les fonctions qui n'ont pas de structure try/catch appropriée
      const functionsWithoutProperStructure = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*{\s*$/gm;
      content = content.replace(functionsWithoutProperStructure, (match) => {
        if (!match.includes('try {')) {
          modified = true;
          result.changes.push('Structure try/catch ajoutée');
          return match + '\n  try {';
        }
        return match;
      });

      // 5. Corriger les endpoints spéciaux (health, debug, csrf, webhooks)
      const specialEndpoints = ['health', 'debug', 'csrf', 'webhooks'];
      const isSpecialEndpoint = specialEndpoints.some(endpoint => filePath.includes(endpoint));
      
      if (isSpecialEndpoint) {
        // Pour les endpoints spéciaux, ajouter une protection basique ou les exclure
        if (filePath.includes('webhooks/clerk')) {
          // Les webhooks Clerk ne doivent pas avoir de protection d'authentification
          result.changes.push('Endpoint webhook - protection non nécessaire');
        } else if (filePath.includes('health')) {
          // L'endpoint health peut rester public pour les checks de santé
          result.changes.push('Endpoint health - protection non nécessaire');
        } else {
          // Ajouter une protection basique pour les autres endpoints spéciaux
          const basicProtectionRegex = /export async function (GET|POST)\([^)]*\)\s*{/g;
          content = content.replace(basicProtectionRegex, (match) => {
            if (!content.includes('requireAuth')) {
              modified = true;
              result.changes.push('Protection basique ajoutée');
              return match + '\n  try {\n    // Vérifier l\'authentification\n    const authResult = await requireAuth();\n    if (!authResult.isAuthenticated) {\n      return authResult.error!;\n    }\n\n    ';
            }
            return match;
          });
        }
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        result.fixed = true;
      }

    } catch (error: any) {
      result.errors.push(`Erreur lors de la correction: ${error.message}`);
    }

    return result;
  }

  // Fonction pour scanner et corriger tous les fichiers route.ts
  function scanAndFixAllRoutes(dir: string) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanAndFixAllRoutes(fullPath);
      } else if (item === 'route.ts') {
        const result = fixFileAdvanced(fullPath);
        results.push(result);
        
        const relativePath = path.relative(process.cwd(), fullPath);
        if (result.fixed) {
          console.log(`  ✅ ${relativePath} - Corrigé`);
          if (result.changes.length > 0) {
            console.log(`     Modifications: ${result.changes.join(', ')}`);
          }
        } else {
          console.log(`  ⚠️ ${relativePath} - Aucune modification nécessaire`);
        }
        
        if (result.errors.length > 0) {
          console.log(`  ❌ ${relativePath} - Erreurs: ${result.errors.join(', ')}`);
        }
      }
    });
  }

  // Démarrer la correction complète
  console.log('🔧 Correction de tous les endpoints API...');
  scanAndFixAllRoutes(apiDir);

  // Résumé des corrections
  console.log('\n📊 RÉSUMÉ COMPLET DES CORRECTIONS');
  console.log('==================================');

  const fixedCount = results.filter(r => r.fixed).length;
  const errorCount = results.filter(r => r.errors.length > 0).length;
  const totalFiles = results.length;

  console.log(`📁 Fichiers traités: ${totalFiles}`);
  console.log(`✅ Fichiers corrigés: ${fixedCount}/${totalFiles}`);
  console.log(`❌ Fichiers avec erreurs: ${errorCount}/${totalFiles}`);

  // Détail des modifications
  const allChanges = results.flatMap(r => r.changes);
  const changeCounts = allChanges.reduce((acc, change) => {
    acc[change] = (acc[change] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (Object.keys(changeCounts).length > 0) {
    console.log('\n📝 Types de modifications appliquées:');
    Object.entries(changeCounts).forEach(([change, count]) => {
      console.log(`  - ${change}: ${count} fois`);
    });
  }

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections appliquées avec succès !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Tester les endpoints avec: npm run audit:api');
    console.log('  2. Vérifier la compilation: npm run test:typescript');
    console.log('  3. Valider la sécurité: npm run validate:final');
  }

  if (errorCount > 0) {
    console.log('\n⚠️ Certains fichiers ont des erreurs et nécessitent une correction manuelle.');
    console.log('📋 Fichiers avec erreurs:');
    results.filter(r => r.errors.length > 0).forEach(result => {
      console.log(`  - ${result.file}: ${result.errors.join(', ')}`);
    });
  }

  return fixedCount > 0;
}

// Exécution des corrections complètes
const success = fixAllAPISecurity();
process.exit(success ? 0 : 1);
