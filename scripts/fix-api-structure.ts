import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger les problèmes de structure dans les endpoints API
 */

function fixAPIStructure() {
  console.log('🔧 CORRECTION DE LA STRUCTURE DES ENDPOINTS API');
  console.log('==============================================');

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

      // 2. Corriger les fonctions sans protection d'authentification
      const functionRegex = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*{\s*try\s*{/g;
      content = content.replace(functionRegex, (match, method) => {
        // Vérifier si la protection d'authentification existe déjà
        const functionStart = content.indexOf(match);
        const nextLines = content.substring(functionStart, functionStart + 500);
        
        if (!nextLines.includes('requireAuth') && !nextLines.includes('requireAuthWithRole')) {
          const protectedFunction = match.replace('try {', `try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    `);
          modified = true;
          return protectedFunction;
        }
        return match;
      });

      // 3. Corriger les fonctions de modification sans protection admin
      const modifyFunctionRegex = /export async function (POST|PUT|DELETE|PATCH)\([^)]*\)\s*{\s*try\s*{/g;
      content = content.replace(modifyFunctionRegex, (match, method) => {
        const functionStart = content.indexOf(match);
        const nextLines = content.substring(functionStart, functionStart + 500);
        
        if (!nextLines.includes('requireAuthWithRole')) {
          const protectedFunction = match.replace('try {', `try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    `);
          modified = true;
          return protectedFunction;
        }
        return match;
      });

      // 4. Corriger les endpoints spéciaux
      if (filePath.includes('webhooks/clerk')) {
        // Les webhooks Clerk ne doivent pas avoir de protection
        console.log(`  ℹ️ ${path.relative(process.cwd(), filePath)} - Webhook Clerk (protection non nécessaire)`);
      } else if (filePath.includes('health')) {
        // L'endpoint health peut rester public
        console.log(`  ℹ️ ${path.relative(process.cwd(), filePath)} - Endpoint health (protection non nécessaire)`);
      }

      if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        fixedCount++;
      }

    } catch (error: any) {
      console.log(`  ❌ ${path.relative(process.cwd(), filePath)} - Erreur: ${error.message}`);
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

  // Démarrer la correction
  console.log('🔧 Correction de la structure des endpoints...');
  scanAllRoutes(apiDir);

  console.log(`\n📊 RÉSUMÉ DES CORRECTIONS`);
  console.log('========================');
  console.log(`✅ Fichiers corrigés: ${fixedCount}`);

  if (fixedCount > 0) {
    console.log('\n🎉 Corrections de structure appliquées !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Tester avec: npm run audit:api');
    console.log('  2. Vérifier la compilation: npm run test:typescript');
  }

  return fixedCount > 0;
}

// Exécution des corrections
const success = fixAPIStructure();
process.exit(success ? 0 : 1);
