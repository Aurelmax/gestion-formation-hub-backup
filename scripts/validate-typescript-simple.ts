import * as fs from 'fs';
import * as path from 'path';

/**
 * Validation simple de la configuration TypeScript pour la sécurité
 */

interface TypeScriptConfig {
  compilerOptions: {
    strict?: boolean;
    noImplicitAny?: boolean;
    strictNullChecks?: boolean;
    noUnusedLocals?: boolean;
    noUnusedParameters?: boolean;
    noFallthroughCasesInSwitch?: boolean;
  };
}

function validateTypeScriptConfigSimple() {
  console.log('🔍 Validation de la configuration TypeScript (Mode Simple)');
  console.log('=======================================================');

  const configFiles = [
    'tsconfig.json',
    'tsconfig.app.json', 
    'tsconfig.node.json'
  ];

  let allConfigsSecure = true;
  let totalChecks = 0;
  let passedChecks = 0;

  configFiles.forEach(configFile => {
    console.log(`\n📁 Validation de ${configFile}:`);
    
    try {
      const configPath = path.join(process.cwd(), configFile);
      const configContent = fs.readFileSync(configPath, 'utf8');
      const config: TypeScriptConfig = JSON.parse(configContent);
      
      const compilerOptions = config.compilerOptions || {};
      
      // Vérifications de sécurité essentielles
      const essentialChecks = [
        {
          name: 'strict',
          value: compilerOptions.strict,
          required: true,
          description: 'Mode strict activé'
        },
        {
          name: 'noImplicitAny',
          value: compilerOptions.noImplicitAny,
          required: true,
          description: 'Interdiction des types any implicites'
        },
        {
          name: 'strictNullChecks',
          value: compilerOptions.strictNullChecks,
          required: true,
          description: 'Vérification stricte des null/undefined'
        }
      ];

      let configSecure = true;

      essentialChecks.forEach(check => {
        totalChecks++;
        const status = check.required 
          ? (check.value === true ? '✅' : '❌')
          : (check.value === true ? '✅' : '⚠️');
        
        console.log(`  ${status} ${check.name}: ${check.value} - ${check.description}`);
        
        if (check.required && check.value === true) {
          passedChecks++;
        }
        
        if (check.required && check.value !== true) {
          configSecure = false;
          allConfigsSecure = false;
        }
      });

      if (configSecure) {
        console.log(`  🎉 ${configFile} est sécurisé`);
      } else {
        console.log(`  ⚠️ ${configFile} nécessite des améliorations`);
      }

    } catch (error) {
      console.log(`  ❌ Erreur lors de la lecture de ${configFile}:`, error);
      allConfigsSecure = false;
    }
  });

  console.log('\n📊 Résumé de sécurité TypeScript:');
  console.log(`  ✅ Vérifications réussies: ${passedChecks}/${totalChecks}`);
  
  if (allConfigsSecure) {
    console.log('  ✅ Toutes les configurations TypeScript sont sécurisées');
    console.log('  ✅ Mode strict activé partout');
    console.log('  ✅ Vérifications de type strictes');
    console.log('  ✅ Détection des erreurs de type');
    console.log('  ✅ Protection contre les erreurs runtime');
    
    console.log('\n🛡️ Niveau de sécurité TypeScript:');
    console.log('  - Configuration stricte: ✅');
    console.log('  - Types stricts: ✅');
    console.log('  - Null checks: ✅');
    console.log('  - Détection d\'erreurs: ✅');
    
    console.log('\n🎯 Avantages de sécurité:');
    console.log('  - Erreurs de type détectées à la compilation');
    console.log('  - Protection contre les erreurs runtime');
    console.log('  - Code plus robuste et maintenable');
    console.log('  - Détection précoce des bugs');
    
    console.log('\n🎉 Validation TypeScript terminée avec succès !');
    console.log('🔒 Vulnérabilité "Configuration TypeScript Permissive" RÉSOLUE');
  } else {
    console.log('  ❌ Certaines configurations nécessitent des améliorations');
    console.log('  📝 Recommandations:');
    console.log('    - Activer strict: true');
    console.log('    - Activer noImplicitAny: true');
    console.log('    - Activer strictNullChecks: true');
  }
}

validateTypeScriptConfigSimple();
