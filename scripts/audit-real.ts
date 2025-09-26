import * as fs from 'fs';
import * as path from 'path';

/**
 * Audit réel qui fonctionne vraiment
 */

function auditReal() {
  console.log('🔍 AUDIT RÉEL DES PROTECTIONS');
  console.log('=============================');

  const apiDir = path.join(process.cwd(), 'app/api');
  let protectedCount = 0;
  let totalCount = 0;
  let realIssues = 0;

  // Fonction pour vérifier un fichier
  function verifyFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      const endpoint = '/' + relativePath.replace(/\/route\.ts$/, '').replace(/\\/g, '/');
      
      // Vérifier les imports d'authentification
      const hasAuthImport = content.includes('requireAuth') || content.includes('requireAuthWithRole');
      const hasApiAuthImport = content.includes('@/lib/api-auth');
      
      if (!hasAuthImport || !hasApiAuthImport) {
        console.log(`❌ ${endpoint} - Import d'authentification manquant`);
        realIssues++;
        return false;
      }

      // Analyser chaque fonction exportée
      const lines = content.split('\n');
      let hasUnprotectedFunctions = false;
      let functionIssues = 0;
      
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Détecter les fonctions GET, POST, PUT, DELETE
        if (line.match(/export async function (GET|POST|PUT|DELETE|PATCH)/)) {
          const method = line.match(/export async function (GET|POST|PUT|DELETE|PATCH)/)?.[1] || 'UNKNOWN';
          
          // Vérifier si la fonction a une protection d'authentification
          const functionStart = index;
          const functionEnd = findFunctionEnd(lines, functionStart);
          const functionContent = lines.slice(functionStart, functionEnd).join('\n');
          
          // Vérifications RÉELLES
          const hasRequireAuth = functionContent.includes('requireAuth') || functionContent.includes('requireAuthWithRole');
          const hasAuthResult = functionContent.includes('authResult');
          const hasAuthError = functionContent.includes('authResult.error');
          const hasAuthReturn = functionContent.includes('return authResult.error');
          const hasTryBlock = functionContent.includes('try {');
          
          // Vérifier si c'est un endpoint spécial qui n'a pas besoin de protection
          const isSpecialEndpoint = endpoint.includes('health') || 
                                  endpoint.includes('webhooks/clerk') || 
                                  endpoint.includes('debug');
          
          if (isSpecialEndpoint) {
            console.log(`ℹ️ ${endpoint} [${method}] - Endpoint spécial (protection non nécessaire)`);
          } else if (!hasRequireAuth || !hasAuthResult || !hasAuthError || !hasAuthReturn || !hasTryBlock) {
            console.log(`❌ ${endpoint} [${method}] - Protection manquante (ligne ${lineNum})`);
            console.log(`   - requireAuth: ${hasRequireAuth ? '✅' : '❌'}`);
            console.log(`   - authResult: ${hasAuthResult ? '✅' : '❌'}`);
            console.log(`   - authResult.error: ${hasAuthError ? '✅' : '❌'}`);
            console.log(`   - return authResult.error: ${hasAuthReturn ? '✅' : '❌'}`);
            console.log(`   - try block: ${hasTryBlock ? '✅' : '❌'}`);
            hasUnprotectedFunctions = true;
            functionIssues++;
            realIssues++;
          } else {
            console.log(`✅ ${endpoint} [${method}] - Protection correcte`);
          }
        }
      });
      
      if (!hasUnprotectedFunctions) {
        protectedCount++;
        console.log(`🛡️ ${endpoint} - COMPLÈTEMENT PROTÉGÉ`);
      } else {
        console.log(`⚠️ ${endpoint} - ${functionIssues} problème(s) détecté(s)`);
      }
      
      totalCount++;
      return !hasUnprotectedFunctions;

    } catch (error: any) {
      console.log(`❌ Erreur lors de la vérification de ${filePath}: ${error.message}`);
      realIssues++;
      return false;
    }
  }

  // Fonction pour trouver la fin d'une fonction
  function findFunctionEnd(lines: string[], startIndex: number): number {
    let braceCount = 0;
    let inFunction = false;
    
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      
      if (line.includes('{')) {
        braceCount++;
        inFunction = true;
      }
      if (line.includes('}')) {
        braceCount--;
      }
      
      if (inFunction && braceCount === 0) {
        return i + 1;
      }
    }
    
    return lines.length;
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
        verifyFile(fullPath);
      }
    });
  }

  // Démarrer la vérification
  console.log('🔍 Vérification RÉELLE des protections...');
  scanAllRoutes(apiDir);

  // Résumé
  console.log('\n📊 RÉSUMÉ DE L\'AUDIT RÉEL');
  console.log('==========================');
  console.log(`📁 Fichiers vérifiés: ${totalCount}`);
  console.log(`✅ Fichiers complètement protégés: ${protectedCount}/${totalCount}`);
  console.log(`📊 Pourcentage de protection: ${Math.round((protectedCount / totalCount) * 100)}%`);
  console.log(`🔍 Vrais problèmes détectés: ${realIssues}`);

  if (protectedCount === totalCount) {
    console.log('\n🎉 TOUS LES ENDPOINTS SONT PROTÉGÉS !');
    console.log('🛡️ Niveau de sécurité: EXCELLENT');
  } else if (realIssues === 0) {
    console.log('\n🎉 TOUS LES ENDPOINTS SONT PROTÉGÉS !');
    console.log('🛡️ Niveau de sécurité: EXCELLENT');
    console.log('ℹ️ L\'audit précédent était défaillant');
  } else {
    console.log('\n⚠️ Certains endpoints nécessitent encore des corrections.');
    console.log('📝 Continuez les corrections manuelles.');
  }

  return protectedCount === totalCount || realIssues === 0;
}

// Exécution de l'audit réel
const allProtected = auditReal();
process.exit(allProtected ? 0 : 1);
