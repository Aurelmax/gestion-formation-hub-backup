import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour corriger automatiquement les problèmes de structure des protections
 */

function fixStructureFinal() {
  console.log('🔧 CORRECTION FINALE DE LA STRUCTURE DES PROTECTIONS');
  console.log('===================================================');

  const apiDir = path.join(process.cwd(), 'app/api');
  let fixedCount = 0;

  // Fonction pour corriger un fichier
  function fixFile(filePath: string) {
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
        console.log(`  ✅ ${path.relative(process.cwd(), filePath)} - Import d'authentification ajouté`);
      }

      // 2. Corriger les fonctions GET avec protection d'authentification
      const getFunctionRegex = /export async function GET\([^)]*\)\s*{\s*try\s*{/g;
      content = content.replace(getFunctionRegex, (match) => {
        if (!match.includes('requireAuth')) {
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

      // 3. Corriger les fonctions POST/PUT/DELETE/PATCH avec protection admin
      const modifyFunctionRegex = /export async function (POST|PUT|DELETE|PATCH)\([^)]*\)\s*{\s*try\s*{/g;
      content = content.replace(modifyFunctionRegex, (match) => {
        if (!match.includes('requireAuth')) {
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

      // 4. Corriger les fonctions qui n'ont pas de structure try/catch
      const functionsWithoutTry = /export async function (GET|POST|PUT|DELETE|PATCH)\([^)]*\)\s*{\s*$/gm;
      content = content.replace(functionsWithoutTry, (match, method) => {
        if (!match.includes('try {')) {
          const protectedFunction = match + '\n  try {\n    // Vérifier l\'authentification\n    const authResult = await requireAuth();\n    if (!authResult.isAuthenticated) {\n      return authResult.error!;\n    }\n\n    ';
          modified = true;
          return protectedFunction;
        }
        return match;
      });

      // 5. Corriger les endpoints spéciaux
      const specialEndpoints = ['health', 'debug', 'csrf', 'webhooks'];
      const isSpecialEndpoint = specialEndpoints.some(endpoint => filePath.includes(endpoint));
      
      if (isSpecialEndpoint) {
        if (filePath.includes('webhooks/clerk')) {
          // Les webhooks Clerk ne doivent pas avoir de protection d'authentification
          console.log(`  ℹ️ ${path.relative(process.cwd(), filePath)} - Webhook Clerk (protection non nécessaire)`);
        } else if (filePath.includes('health')) {
          // L'endpoint health peut rester public pour les checks de santé
          console.log(`  ℹ️ ${path.relative(process.cwd(), filePath)} - Endpoint health (protection non nécessaire)`);
        }
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
    'app/api/categories/route.ts',
    'app/api/categories-programme/route.ts',
    'app/api/programmes-formation/route.ts',
  ];

  console.log('🔧 Correction de la structure des protections...');
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
    console.log('  1. Vérifier avec: npm run audit:improved');
    console.log('  2. Tester avec: npm run verify:protections');
  }

  return fixedCount > 0;
}

// Exécution des corrections
const success = fixStructureFinal();
process.exit(success ? 0 : 1);
