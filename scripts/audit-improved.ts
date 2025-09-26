import * as fs from 'fs';
import * as path from 'path';

/**
 * Script d'audit amélioré pour détecter correctement les protections
 */

function auditImproved() {
  console.log('🔍 AUDIT AMÉLIORÉ DES PROTECTIONS');
  console.log('=================================');

  const apiDir = path.join(process.cwd(), 'app/api');
  let protectedCount = 0;
  let totalCount = 0;
  let issuesFound = 0;

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
        issuesFound++;
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
          
          // Vérifications améliorées
          const hasAuthCheck = functionContent.includes('requireAuth') || functionContent.includes('requireAuthWithRole');
          const hasAuthResult = functionContent.includes('authResult');
          const hasAuthError = functionContent.includes('authResult.error');
          const hasAuthReturn = functionContent.includes('return authResult.error');
          const hasTryBlock = functionContent.includes('try {');
          const hasProperStructure = hasAuthCheck && hasAuthResult && hasAuthError && hasAuthReturn && hasTryBlock;
          
          if (!hasProperStructure) {
            console.log(`❌ ${endpoint} [${method}] - Protection mal structurée (ligne ${lineNum})`);
            console.log(`   - requireAuth: ${hasAuthCheck ? '✅' : '❌'}`);
            console.log(`   - authResult: ${hasAuthResult ? '✅' : '❌'}`);
            console.log(`   - authResult.error: ${hasAuthError ? '✅' : '❌'}`);
            console.log(`   - return authResult.error: ${hasAuthReturn ? '✅' : '❌'}`);
            console.log(`   - try block: ${hasTryBlock ? '✅' : '❌'}`);
            hasUnprotectedFunctions = true;
            functionIssues++;
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
        issuesFound += functionIssues;
      }
      
      totalCount++;
      return !hasUnprotectedFunctions;

    } catch (error: any) {
      console.log(`❌ Erreur lors de la vérification de ${filePath}: ${error.message}`);
      issuesFound++;
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
  console.log('🔍 Vérification améliorée des protections...');
  scanAllRoutes(apiDir);

  // Résumé
  console.log('\n📊 RÉSUMÉ DE L\'AUDIT AMÉLIORÉ');
  console.log('==============================');
  console.log(`📁 Fichiers vérifiés: ${totalCount}`);
  console.log(`✅ Fichiers complètement protégés: ${protectedCount}/${totalCount}`);
  console.log(`📊 Pourcentage de protection: ${Math.round((protectedCount / totalCount) * 100)}%`);
  console.log(`🔍 Problèmes détectés: ${issuesFound}`);

  if (protectedCount === totalCount) {
    console.log('\n🎉 TOUS LES ENDPOINTS SONT PROTÉGÉS !');
    console.log('🛡️ Niveau de sécurité: EXCELLENT');
  } else {
    console.log('\n⚠️ Certains endpoints nécessitent encore des corrections.');
    console.log('📝 Continuez les corrections manuelles.');
  }

  return protectedCount === totalCount;
}

// Exécution de l'audit amélioré
const allProtected = auditImproved();
process.exit(allProtected ? 0 : 1);
