import * as fs from 'fs';
import * as path from 'path';

/**
 * Analyse des vulnérabilités XSS potentielles
 */

interface XSSVulnerability {
  file: string;
  line: number;
  type: 'dangerouslySetInnerHTML' | 'innerHTML' | 'document.write' | 'eval';
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  description: string;
  recommendation: string;
}

function analyzeXSSVulnerabilities() {
  console.log('🔍 ANALYSE DES VULNÉRABILITÉS XSS');
  console.log('=================================');

  const vulnerabilities: XSSVulnerability[] = [];

  // Recherche des patterns dangereux
  const dangerousPatterns = [
    {
      pattern: /dangerouslySetInnerHTML/g,
      type: 'dangerouslySetInnerHTML' as const,
      severity: 'HIGH' as const,
      description: 'Utilisation de dangerouslySetInnerHTML',
      recommendation: 'Utiliser des alternatives sécurisées ou assainir le contenu'
    },
    {
      pattern: /\.innerHTML\s*=/g,
      type: 'innerHTML' as const,
      severity: 'MEDIUM' as const,
      description: 'Utilisation de innerHTML',
      recommendation: 'Utiliser textContent ou des alternatives sécurisées'
    },
    {
      pattern: /document\.write/g,
      type: 'document.write' as const,
      severity: 'HIGH' as const,
      description: 'Utilisation de document.write',
      recommendation: 'Éviter document.write, utiliser des méthodes sécurisées'
    },
    {
      pattern: /eval\s*\(/g,
      type: 'eval' as const,
      severity: 'HIGH' as const,
      description: 'Utilisation de eval',
      recommendation: 'Éviter eval, utiliser des alternatives sécurisées'
    }
  ];

  // Fonction pour analyser un fichier
  function analyzeFile(filePath: string) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      dangerousPatterns.forEach(({ pattern, type, severity, description, recommendation }) => {
        let match;
        while ((match = pattern.exec(content)) !== null) {
          const lineNumber = content.substring(0, match.index).split('\n').length;
          
          vulnerabilities.push({
            file: filePath,
            line: lineNumber,
            type,
            severity,
            description,
            recommendation
          });
        }
      });
    } catch (error) {
      console.log(`❌ Erreur lors de l'analyse de ${filePath}: ${error}`);
    }
  }

  // Analyser tous les fichiers TypeScript/JavaScript
  function scanDirectory(dir: string) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        scanDirectory(fullPath);
      } else if (stat.isFile() && (item.endsWith('.ts') || item.endsWith('.tsx') || item.endsWith('.js') || item.endsWith('.jsx'))) {
        // Exclure les fichiers de test et d'analyse
        const excludePatterns = [
          'analyze-xss-vulnerabilities.ts',
          'test-',
          '.test.',
          '.spec.',
          'node_modules'
        ];
        
        const shouldExclude = excludePatterns.some(pattern => fullPath.includes(pattern));
        
        if (!shouldExclude) {
          analyzeFile(fullPath);
        }
      }
    });
  }

  // Démarrer l'analyse
  console.log('🔍 Analyse des fichiers...');
  scanDirectory(process.cwd());

  // Afficher les résultats
  console.log(`\n📊 RÉSULTATS DE L'ANALYSE XSS`);
  console.log('===============================');

  if (vulnerabilities.length === 0) {
    console.log('✅ Aucune vulnérabilité XSS détectée !');
    console.log('🛡️ Votre application est sécurisée contre les attaques XSS.');
  } else {
    console.log(`\n⚠️ ${vulnerabilities.length} vulnérabilité(s) XSS détectée(s):\n`);

    // Grouper par fichier
    const vulnerabilitiesByFile = vulnerabilities.reduce((acc, vuln) => {
      if (!acc[vuln.file]) {
        acc[vuln.file] = [];
      }
      acc[vuln.file].push(vuln);
      return acc;
    }, {} as Record<string, XSSVulnerability[]>);

    Object.entries(vulnerabilitiesByFile).forEach(([file, vulns]) => {
      console.log(`📁 ${file}:`);
      vulns.forEach(vuln => {
        const severityIcon = vuln.severity === 'HIGH' ? '🔴' : vuln.severity === 'MEDIUM' ? '🟡' : '🟢';
        console.log(`  ${severityIcon} Ligne ${vuln.line}: ${vuln.description}`);
        console.log(`     Type: ${vuln.type}`);
        console.log(`     Sévérité: ${vuln.severity}`);
        console.log(`     Recommandation: ${vuln.recommendation}`);
        console.log('');
      });
    });

    // Statistiques
    const highSeverity = vulnerabilities.filter(v => v.severity === 'HIGH').length;
    const mediumSeverity = vulnerabilities.filter(v => v.severity === 'MEDIUM').length;
    const lowSeverity = vulnerabilities.filter(v => v.severity === 'LOW').length;

    console.log('📈 STATISTIQUES:');
    console.log(`  🔴 Vulnérabilités critiques: ${highSeverity}`);
    console.log(`  🟡 Vulnérabilités moyennes: ${mediumSeverity}`);
    console.log(`  🟢 Vulnérabilités faibles: ${lowSeverity}`);
    console.log(`  📊 Total: ${vulnerabilities.length}`);

    // Score de sécurité XSS
    const xssScore = Math.max(0, 100 - (highSeverity * 20) - (mediumSeverity * 10) - (lowSeverity * 5));
    console.log(`\n🎯 Score de sécurité XSS: ${xssScore}/100`);

    if (xssScore >= 90) {
      console.log('🟢 Niveau de sécurité XSS: EXCELLENT');
    } else if (xssScore >= 70) {
      console.log('🟡 Niveau de sécurité XSS: BON');
    } else if (xssScore >= 50) {
      console.log('🟠 Niveau de sécurité XSS: MOYEN');
    } else {
      console.log('🔴 Niveau de sécurité XSS: FAIBLE');
    }

    console.log('\n🛡️ RECOMMANDATIONS GÉNÉRALES:');
    console.log('  - Assainir tout contenu utilisateur avant injection');
    console.log('  - Utiliser des alternatives sécurisées à innerHTML');
    console.log('  - Éviter dangerouslySetInnerHTML quand possible');
    console.log('  - Valider et échapper les données utilisateur');
    console.log('  - Utiliser des bibliothèques de sanitisation comme DOMPurify');
  }

  return vulnerabilities.length === 0;
}

// Exécution de l'analyse
const isSecure = analyzeXSSVulnerabilities();
process.exit(isSecure ? 0 : 1);
