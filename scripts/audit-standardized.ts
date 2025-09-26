import * as fs from 'fs';
import * as path from 'path';

/**
 * Audit Standardisé - Accepte les variantes de format
 */

function auditStandardized() {
  console.log('🔍 AUDIT STANDARDISÉ');
  console.log('====================');

  const apiDir = path.join(process.cwd(), 'app/api');
  let totalFiles = 0;
  let protectedFiles = 0;
  let totalIssues = 0;

  // Règles de sécurité standardisées (avec variantes acceptées)
  const securityRules = [
    { 
      name: "requireAuth présent", 
      regex: /requireAuth|requireAuthWithRole/, 
      must: true 
    },
    { 
      name: "Vérification isAuthenticated", 
      regex: /if\s*\(\s*!authResult\.isAuthenticated\s*\)/, 
      must: true 
    },
    { 
      name: "Retour NextResponse.json en cas d'erreur auth", 
      regex: /NextResponse\.json\(\s*{\s*error:\s*["'].*["']\s*},\s*{\s*status:\s*401\s*}\s*\)/, 
      must: true 
    },
    { 
      name: "Bloc try/catch", 
      regex: /try\s*\{[\s\S]*\}\s*catch\s*\(/, 
      must: true 
    },
    { 
      name: "Retour NextResponse.json en cas d'erreur serveur", 
      regex: /NextResponse\.json\(\s*{\s*error:\s*["'].*["']\s*},\s*{\s*status:\s*500\s*}\s*\)/, 
      must: true 
    }
  ];

  // Fonction pour vérifier un fichier
  function verifyFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(process.cwd(), filePath);
      const endpoint = '/' + relativePath.replace(/\/route\.ts$/, '').replace(/\\/g, '/');
      
      // Vérifier si c'est un endpoint spécial qui n'a pas besoin de protection
      const isSpecialEndpoint = endpoint.includes('health') || 
                              endpoint.includes('webhooks/clerk') || 
                              endpoint.includes('debug');
      
      if (isSpecialEndpoint) {
        console.log(`ℹ️ ${endpoint} - Endpoint spécial (protection non nécessaire)`);
        return true;
      }

      console.log(`\n🔎 Audit de sécurité de ${endpoint}:`);
      
      let fileIssues = 0;
      let allRulesPassed = true;

      // Vérifier chaque règle
      securityRules.forEach(rule => {
        const passed = rule.regex.test(content);
        console.log(`${passed ? "✅" : "❌"} ${rule.name}`);
        
        if (!passed) {
          fileIssues++;
          allRulesPassed = false;
        }
      });

      // Vérifier les imports nécessaires
      const hasAuthImport = content.includes('@/lib/api-auth');
      const hasNextResponseImport = content.includes('NextResponse');
      
      if (!hasAuthImport) {
        console.log("❌ Import @/lib/api-auth manquant");
        fileIssues++;
        allRulesPassed = false;
      } else {
        console.log("✅ Import @/lib/api-auth présent");
      }

      if (!hasNextResponseImport) {
        console.log("❌ Import NextResponse manquant");
        fileIssues++;
        allRulesPassed = false;
      } else {
        console.log("✅ Import NextResponse présent");
      }

      if (allRulesPassed) {
        console.log(`🛡️ ${endpoint} - COMPLÈTEMENT PROTÉGÉ`);
        protectedFiles++;
      } else {
        console.log(`⚠️ ${endpoint} - ${fileIssues} problème(s) détecté(s)`);
        totalIssues += fileIssues;
      }

      totalFiles++;
      return allRulesPassed;

    } catch (error: any) {
      console.log(`❌ Erreur lors de la vérification de ${filePath}: ${error.message}`);
      totalIssues++;
      return false;
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
        verifyFile(fullPath);
      }
    });
  }

  // Démarrer la vérification
  console.log('🔍 Vérification des règles de sécurité standardisées...');
  scanAllRoutes(apiDir);

  // Résumé
  console.log('\n📊 RÉSUMÉ DE L\'AUDIT STANDARDISÉ');
  console.log('====================================');
  console.log(`📁 Fichiers vérifiés: ${totalFiles}`);
  console.log(`✅ Fichiers complètement protégés: ${protectedFiles}/${totalFiles}`);
  console.log(`📊 Pourcentage de protection: ${Math.round((protectedFiles / totalFiles) * 100)}%`);
  console.log(`🔍 Problèmes détectés: ${totalIssues}`);

  if (protectedFiles === totalFiles) {
    console.log('\n🎉 TOUS LES ENDPOINTS SONT PROTÉGÉS !');
    console.log('🛡️ Niveau de sécurité: EXCELLENT');
    console.log('✅ Toutes les règles de sécurité sont respectées');
  } else if (totalIssues === 0) {
    console.log('\n🎉 TOUS LES ENDPOINTS SONT PROTÉGÉS !');
    console.log('🛡️ Niveau de sécurité: EXCELLENT');
    console.log('✅ Toutes les règles de sécurité sont respectées');
  } else {
    console.log('\n⚠️ Certains endpoints nécessitent encore des corrections.');
    console.log('📝 Continuez les corrections manuelles.');
    console.log('\n🔧 Règles de sécurité attendues:');
    securityRules.forEach(rule => {
      console.log(`   - ${rule.name}`);
    });
  }

  return protectedFiles === totalFiles || totalIssues === 0;
}

// Exécution de l'audit standardisé
const allProtected = auditStandardized();
process.exit(allProtected ? 0 : 1);
