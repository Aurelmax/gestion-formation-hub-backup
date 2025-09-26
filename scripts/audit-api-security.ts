import * as fs from 'fs';
import * as path from 'path';

/**
 * Audit de sécurité des endpoints API
 */

interface APISecurityIssue {
  file: string;
  endpoint: string;
  method: string;
  issue: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  line: number;
}

function auditAPISecurity() {
  console.log('🔍 AUDIT DE SÉCURITÉ DES ENDPOINTS API');
  console.log('======================================');

  const issues: APISecurityIssue[] = [];
  const apiDir = path.join(process.cwd(), 'app/api');

  // Fonction pour analyser un fichier route.ts
  function analyzeRouteFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      // Extraire le chemin de l'endpoint
      const relativePath = path.relative(apiDir, filePath);
      const endpoint = '/' + relativePath.replace(/\/route\.ts$/, '').replace(/\\/g, '/');
      
      // Vérifier les imports d'authentification
      const hasAuthImport = content.includes('requireAuth') || content.includes('requireAuthWithRole');
      const hasApiAuthImport = content.includes('@/lib/api-auth');
      
      // Analyser chaque fonction exportée
      lines.forEach((line, index) => {
        const lineNum = index + 1;
        
        // Détecter les fonctions GET, POST, PUT, DELETE
        if (line.match(/export async function (GET|POST|PUT|DELETE|PATCH)/)) {
          const method = line.match(/export async function (GET|POST|PUT|DELETE|PATCH)/)?.[1] || 'UNKNOWN';
          
          // Vérifier si la fonction a une protection d'authentification
          const functionStart = index;
          const functionEnd = findFunctionEnd(lines, functionStart);
          const functionContent = lines.slice(functionStart, functionEnd).join('\n');
          
          if (!hasAuthImport || !hasApiAuthImport) {
            issues.push({
              file: filePath,
              endpoint,
              method,
              issue: 'Import d\'authentification manquant',
              severity: 'CRITICAL',
              line: lineNum
            });
          } else if (!functionContent.includes('requireAuth') && !functionContent.includes('requireAuthWithRole')) {
            issues.push({
              file: filePath,
              endpoint,
              method,
              issue: 'Protection d\'authentification manquante',
              severity: 'CRITICAL',
              line: lineNum
            });
          }
        }
      });
      
    } catch (error) {
      console.log(`❌ Erreur lors de l'analyse de ${filePath}: ${error}`);
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

  // Parcourir tous les fichiers route.ts
  function scanAPIDirectory(dir: string) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanAPIDirectory(fullPath);
      } else if (item === 'route.ts') {
        analyzeRouteFile(fullPath);
      }
    });
  }

  // Démarrer l'audit
  console.log('🔍 Analyse des endpoints API...');
  scanAPIDirectory(apiDir);

  // Afficher les résultats
  console.log(`\n📊 RÉSULTATS DE L'AUDIT API`);
  console.log('============================');

  if (issues.length === 0) {
    console.log('✅ Aucun problème de sécurité détecté !');
    console.log('🛡️ Tous les endpoints API sont correctement protégés.');
  } else {
    console.log(`\n⚠️ ${issues.length} problème(s) de sécurité détecté(s):\n`);

    // Grouper par sévérité
    const criticalIssues = issues.filter(i => i.severity === 'CRITICAL');
    const highIssues = issues.filter(i => i.severity === 'HIGH');
    const mediumIssues = issues.filter(i => i.severity === 'MEDIUM');
    const lowIssues = issues.filter(i => i.severity === 'LOW');

    if (criticalIssues.length > 0) {
      console.log('🔴 PROBLÈMES CRITIQUES:');
      criticalIssues.forEach(issue => {
        console.log(`  ❌ ${issue.endpoint} [${issue.method}] - ${issue.issue}`);
        console.log(`     Fichier: ${issue.file}:${issue.line}`);
      });
      console.log('');
    }

    if (highIssues.length > 0) {
      console.log('🟠 PROBLÈMES ÉLEVÉS:');
      highIssues.forEach(issue => {
        console.log(`  ⚠️ ${issue.endpoint} [${issue.method}] - ${issue.issue}`);
        console.log(`     Fichier: ${issue.file}:${issue.line}`);
      });
      console.log('');
    }

    if (mediumIssues.length > 0) {
      console.log('🟡 PROBLÈMES MOYENS:');
      mediumIssues.forEach(issue => {
        console.log(`  ⚠️ ${issue.endpoint} [${issue.method}] - ${issue.issue}`);
        console.log(`     Fichier: ${issue.file}:${issue.line}`);
      });
      console.log('');
    }

    if (lowIssues.length > 0) {
      console.log('🟢 PROBLÈMES FAIBLES:');
      lowIssues.forEach(issue => {
        console.log(`  ℹ️ ${issue.endpoint} [${issue.method}] - ${issue.issue}`);
        console.log(`     Fichier: ${issue.file}:${issue.line}`);
      });
      console.log('');
    }

    // Statistiques
    console.log('📈 STATISTIQUES:');
    console.log(`  🔴 Problèmes critiques: ${criticalIssues.length}`);
    console.log(`  🟠 Problèmes élevés: ${highIssues.length}`);
    console.log(`  🟡 Problèmes moyens: ${mediumIssues.length}`);
    console.log(`  🟢 Problèmes faibles: ${lowIssues.length}`);
    console.log(`  📊 Total: ${issues.length}`);

    // Score de sécurité API
    const totalWeight = criticalIssues.length * 4 + highIssues.length * 3 + mediumIssues.length * 2 + lowIssues.length * 1;
    const maxWeight = issues.length * 4;
    const securityScore = Math.max(0, 100 - Math.round((totalWeight / maxWeight) * 100));
    
    console.log(`\n🎯 Score de sécurité API: ${securityScore}/100`);

    if (securityScore >= 90) {
      console.log('🟢 Niveau de sécurité API: EXCELLENT');
    } else if (securityScore >= 70) {
      console.log('🟡 Niveau de sécurité API: BON');
    } else if (securityScore >= 50) {
      console.log('🟠 Niveau de sécurité API: MOYEN');
    } else {
      console.log('🔴 Niveau de sécurité API: FAIBLE');
    }

    console.log('\n🛡️ RECOMMANDATIONS:');
    console.log('  - Ajouter requireAuth() à tous les endpoints GET');
    console.log('  - Ajouter requireAuthWithRole() aux endpoints de modification');
    console.log('  - Importer @/lib/api-auth dans tous les fichiers route.ts');
    console.log('  - Vérifier la protection de tous les endpoints sensibles');
  }

  return issues.length === 0;
}

// Exécution de l'audit
const isSecure = auditAPISecurity();
process.exit(isSecure ? 0 : 1);
