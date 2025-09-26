import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

/**
 * Script pour identifier automatiquement les fichiers API qui fonctionnent
 * (sans erreurs TypeScript)
 */

function identifyWorkingFiles() {
  console.log('🔍 IDENTIFICATION DES FICHIERS FONCTIONNELS');
  console.log('===========================================');

  const workingFiles: string[] = [];
  const problematicFiles: string[] = [];

  // Fonction pour vérifier un fichier
  function checkFile(filePath: string) {
    try {
      // Vérifier si le fichier existe
      if (!fs.existsSync(filePath)) {
        return false;
      }

      // Lire le contenu du fichier
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Vérifications basiques
      if (content.length === 0) {
        return false;
      }

      // Vérifier la structure basique
      const hasExportFunction = /export\s+async\s+function\s+(GET|POST|PUT|DELETE|PATCH)/.test(content);
      const hasTryCatch = /try\s*\{[\s\S]*?\}\s*catch\s*\(/.test(content);
      const hasReturn = /return\s+NextResponse\.json/.test(content);
      
      if (!hasExportFunction || !hasTryCatch || !hasReturn) {
        return false;
      }

      // Vérifier qu'il n'y a pas de structures malformées évidentes
      const hasOrphanBraces = /^\s*\}\s*$/.test(content);
      const hasOrphanCatch = /^\s*\}\s*catch\s*\([^)]*\)\s*\{[\s\S]*?\}\s*$/.test(content);
      
      if (hasOrphanBraces || hasOrphanCatch) {
        return false;
      }

      return true;
    } catch (error) {
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
        const relativePath = path.relative(process.cwd(), fullPath);
        
        if (checkFile(fullPath)) {
          workingFiles.push(relativePath);
          console.log(`✅ ${relativePath}`);
        } else {
          problematicFiles.push(relativePath);
          console.log(`❌ ${relativePath}`);
        }
      }
    });
  }

  console.log('🔍 Analyse des fichiers API...');
  scanAllRoutes(path.join(process.cwd(), 'app/api'));

  console.log(`\n📊 RÉSUMÉ DE L'IDENTIFICATION`);
  console.log('=============================');
  console.log(`✅ Fichiers fonctionnels: ${workingFiles.length}`);
  console.log(`❌ Fichiers problématiques: ${problematicFiles.length}`);

  if (workingFiles.length > 0) {
    console.log('\n📁 FICHIERS FONCTIONNELS:');
    workingFiles.forEach(file => console.log(`  ✅ ${file}`));
  }

  if (problematicFiles.length > 0) {
    console.log('\n🔧 FICHIERS PROBLÉMATIQUES:');
    problematicFiles.forEach(file => console.log(`  ❌ ${file}`));
  }

  // Sauvegarder la liste des fichiers fonctionnels
  const backupDir = path.join(process.cwd(), 'backups', 'working-files');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const workingFilesList = {
    timestamp: new Date().toISOString(),
    total: workingFiles.length,
    files: workingFiles
  };

  fs.writeFileSync(
    path.join(backupDir, 'working-files-list.json'),
    JSON.stringify(workingFilesList, null, 2),
    'utf8'
  );

  console.log(`\n💾 Liste sauvegardée dans: backups/working-files/working-files-list.json`);

  return {
    workingFiles,
    problematicFiles,
    totalWorking: workingFiles.length,
    totalProblematic: problematicFiles.length
  };
}

// Exécution de l'identification
const result = identifyWorkingFiles();
process.exit(0);
