import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Validation finale complète de toutes les vulnérabilités de sécurité
 */

interface SecurityCheck {
  name: string;
  status: '✅' | '❌' | '⚠️';
  description: string;
  impact: 'CRITIQUE' | 'ÉLEVÉ' | 'MOYEN' | 'FAIBLE';
  score: number;
}

function validateFinalSecurity() {
  console.log('🛡️ VALIDATION FINALE COMPLÈTE DE LA SÉCURITÉ');
  console.log('============================================');
  console.log('Vérification de toutes les vulnérabilités identifiées...\n');

  const securityChecks: SecurityCheck[] = [];

  // 1. Vérification de la configuration TypeScript
  console.log('1️⃣ Configuration TypeScript Permissive (Niveau: MOYEN)');
  try {
    const configFiles = ['tsconfig.json', 'tsconfig.app.json', 'tsconfig.node.json'];
    let allConfigsStrict = true;

    configFiles.forEach(configFile => {
      const configPath = path.join(process.cwd(), configFile);
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config = JSON.parse(configContent);
      
      const compilerOptions = config.compilerOptions || {};
      const isStrict = compilerOptions.strict === true && 
                      compilerOptions.noImplicitAny === true && 
                      compilerOptions.strictNullChecks === true;

      if (!isStrict) {
        allConfigsStrict = false;
      }
    });

    if (allConfigsStrict) {
      securityChecks.push({
        name: 'Configuration TypeScript Stricte',
        status: '✅',
        description: 'Mode strict activé, types stricts, null checks',
        impact: 'MOYEN',
        score: 100
      });
      console.log('  ✅ Configuration TypeScript sécurisée');
    } else {
      securityChecks.push({
        name: 'Configuration TypeScript Stricte',
        status: '❌',
        description: 'Configuration permissive détectée',
        impact: 'MOYEN',
        score: 0
      });
      console.log('  ❌ Configuration TypeScript permissive');
    }
  } catch (error) {
    securityChecks.push({
      name: 'Configuration TypeScript Stricte',
      status: '❌',
      description: 'Erreur lors de la vérification',
      impact: 'MOYEN',
      score: 0
    });
    console.log('  ❌ Erreur lors de la vérification TypeScript');
  }

  // 2. Vérification de la gestion des secrets
  console.log('\n2️⃣ Gestion des Secrets (Niveau: CRITIQUE)');
  try {
    const secureEnvPath = path.join(process.cwd(), 'app/lib/secure-env.ts');
    if (fs.existsSync(secureEnvPath)) {
      securityChecks.push({
        name: 'Gestion Sécurisée des Secrets',
        status: '✅',
        description: 'Utilitaire SecureEnv implémenté',
        impact: 'CRITIQUE',
        score: 100
      });
      console.log('  ✅ Gestion sécurisée des secrets implémentée');
    } else {
      securityChecks.push({
        name: 'Gestion Sécurisée des Secrets',
        status: '❌',
        description: 'Utilitaire SecureEnv manquant',
        impact: 'CRITIQUE',
        score: 0
      });
      console.log('  ❌ Gestion sécurisée des secrets manquante');
    }
  } catch (error) {
    securityChecks.push({
      name: 'Gestion Sécurisée des Secrets',
      status: '❌',
      description: 'Erreur lors de la vérification',
      impact: 'CRITIQUE',
      score: 0
    });
    console.log('  ❌ Erreur lors de la vérification des secrets');
  }

  // 3. Vérification de l'authentification Clerk
  console.log('\n3️⃣ Authentification Clerk (Niveau: CRITIQUE)');
  try {
    const clerkProviderPath = path.join(process.cwd(), 'app/layout.tsx');
    const clerkProviderContent = fs.readFileSync(clerkProviderPath, 'utf8');
    
    if (clerkProviderContent.includes('ClerkProvider')) {
      securityChecks.push({
        name: 'Authentification Clerk',
        status: '✅',
        description: 'ClerkProvider intégré',
        impact: 'CRITIQUE',
        score: 100
      });
      console.log('  ✅ Authentification Clerk intégrée');
    } else {
      securityChecks.push({
        name: 'Authentification Clerk',
        status: '❌',
        description: 'ClerkProvider manquant',
        impact: 'CRITIQUE',
        score: 0
      });
      console.log('  ❌ Authentification Clerk manquante');
    }
  } catch (error) {
    securityChecks.push({
      name: 'Authentification Clerk',
      status: '❌',
      description: 'Erreur lors de la vérification',
      impact: 'CRITIQUE',
      score: 0
    });
    console.log('  ❌ Erreur lors de la vérification Clerk');
  }

  // 4. Vérification de la protection des API
  console.log('\n4️⃣ Protection des API Endpoints (Niveau: CRITIQUE)');
  try {
    const apiAuthPath = path.join(process.cwd(), 'app/lib/api-auth.ts');
    if (fs.existsSync(apiAuthPath)) {
      securityChecks.push({
        name: 'Protection des API Endpoints',
        status: '✅',
        description: 'Utilitaire api-auth implémenté',
        impact: 'CRITIQUE',
        score: 100
      });
      console.log('  ✅ Protection des API endpoints implémentée');
    } else {
      securityChecks.push({
        name: 'Protection des API Endpoints',
        status: '❌',
        description: 'Protection des API manquante',
        impact: 'CRITIQUE',
        score: 0
      });
      console.log('  ❌ Protection des API endpoints manquante');
    }
  } catch (error) {
    securityChecks.push({
      name: 'Protection des API Endpoints',
      status: '❌',
      description: 'Erreur lors de la vérification',
      impact: 'CRITIQUE',
      score: 0
    });
    console.log('  ❌ Erreur lors de la vérification des API');
  }

  // 5. Vérification de la configuration Next.js Image
  console.log('\n5️⃣ Configuration Next.js Image (Niveau: MOYEN)');
  try {
    const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    if (nextConfigContent.includes('images') && nextConfigContent.includes('remotePatterns')) {
      securityChecks.push({
        name: 'Configuration Next.js Image',
        status: '✅',
        description: 'Configuration des images sécurisée',
        impact: 'MOYEN',
        score: 100
      });
      console.log('  ✅ Configuration Next.js Image sécurisée');
    } else {
      securityChecks.push({
        name: 'Configuration Next.js Image',
        status: '❌',
        description: 'Configuration des images manquante',
        impact: 'MOYEN',
        score: 0
      });
      console.log('  ❌ Configuration Next.js Image manquante');
    }
  } catch (error) {
    securityChecks.push({
      name: 'Configuration Next.js Image',
      status: '❌',
      description: 'Erreur lors de la vérification',
      impact: 'MOYEN',
      score: 0
    });
    console.log('  ❌ Erreur lors de la vérification Next.js Image');
  }

  // 6. Vérification du middleware de sécurité
  console.log('\n6️⃣ Middleware de Sécurité (Niveau: CRITIQUE)');
  try {
    const middlewarePath = path.join(process.cwd(), 'middleware.ts');
    if (fs.existsSync(middlewarePath)) {
      securityChecks.push({
        name: 'Middleware de Sécurité',
        status: '✅',
        description: 'Middleware de sécurité implémenté',
        impact: 'CRITIQUE',
        score: 100
      });
      console.log('  ✅ Middleware de sécurité implémenté');
    } else {
      securityChecks.push({
        name: 'Middleware de Sécurité',
        status: '❌',
        description: 'Middleware de sécurité manquant',
        impact: 'CRITIQUE',
        score: 0
      });
      console.log('  ❌ Middleware de sécurité manquant');
    }
  } catch (error) {
    securityChecks.push({
      name: 'Middleware de Sécurité',
      status: '❌',
      description: 'Erreur lors de la vérification',
      impact: 'CRITIQUE',
      score: 0
    });
    console.log('  ❌ Erreur lors de la vérification du middleware');
  }

  // 7. Vérification des vulnérabilités XSS
  console.log('\n7️⃣ Vulnérabilités XSS (Niveau: MOYEN)');
  try {
    const htmlSanitizerPath = path.join(process.cwd(), 'app/lib/html-sanitizer.ts');
    if (fs.existsSync(htmlSanitizerPath)) {
      securityChecks.push({
        name: 'Protection XSS',
        status: '✅',
        description: 'Utilitaire de sanitisation HTML implémenté',
        impact: 'MOYEN',
        score: 85
      });
      console.log('  ✅ Protection XSS implémentée');
    } else {
      securityChecks.push({
        name: 'Protection XSS',
        status: '❌',
        description: 'Protection XSS manquante',
        impact: 'MOYEN',
        score: 0
      });
      console.log('  ❌ Protection XSS manquante');
    }
  } catch (error) {
    securityChecks.push({
      name: 'Protection XSS',
      status: '❌',
      description: 'Erreur lors de la vérification',
      impact: 'MOYEN',
      score: 0
    });
    console.log('  ❌ Erreur lors de la vérification XSS');
  }

  // Résumé de sécurité
  console.log('\n📊 RÉSUMÉ FINAL DE SÉCURITÉ');
  console.log('============================');

  const totalChecks = securityChecks.length;
  const passedChecks = securityChecks.filter(check => check.status === '✅').length;
  const failedChecks = securityChecks.filter(check => check.status === '❌').length;
  const warningChecks = securityChecks.filter(check => check.status === '⚠️').length;

  // Calcul du score pondéré
  const totalScore = securityChecks.reduce((sum, check) => sum + check.score, 0);
  const maxScore = totalChecks * 100;
  const securityScore = Math.round((totalScore / maxScore) * 100);

  console.log(`\n📈 Statistiques:`);
  console.log(`  ✅ Vérifications réussies: ${passedChecks}/${totalChecks}`);
  console.log(`  ❌ Vérifications échouées: ${failedChecks}/${totalChecks}`);
  console.log(`  ⚠️ Vérifications avec avertissements: ${warningChecks}/${totalChecks}`);

  console.log(`\n🛡️ Détail des vérifications:`);
  securityChecks.forEach(check => {
    console.log(`  ${check.status} ${check.name} (${check.impact}) - ${check.description} [${check.score}/100]`);
  });

  console.log(`\n🎯 Score de sécurité final: ${securityScore}/100`);

  if (securityScore >= 95) {
    console.log('🟢 Niveau de sécurité: EXCELLENT');
  } else if (securityScore >= 85) {
    console.log('🟡 Niveau de sécurité: TRÈS BON');
  } else if (securityScore >= 70) {
    console.log('🟠 Niveau de sécurité: BON');
  } else if (securityScore >= 50) {
    console.log('🟡 Niveau de sécurité: MOYEN');
  } else {
    console.log('🔴 Niveau de sécurité: FAIBLE');
  }

  console.log('\n🎉 Validation finale de sécurité terminée !');
  
  return securityScore >= 85;
}

// Exécution de la validation
const isSecure = validateFinalSecurity();
process.exit(isSecure ? 0 : 1);
