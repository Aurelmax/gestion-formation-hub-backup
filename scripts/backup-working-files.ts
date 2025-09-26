import * as fs from 'fs';
import * as path from 'path';

/**
 * Script pour sauvegarder automatiquement tous les fichiers fonctionnels
 */

function backupWorkingFiles() {
  console.log('💾 SAUVEGARDE DES FICHIERS FONCTIONNELS');
  console.log('======================================');

  // Liste des fichiers fonctionnels identifiés
  const workingFiles = [
    'app/api/accessibilite/demandes/[id]/route.ts',
    'app/api/accessibilite/demandes/route.ts',
    'app/api/accessibilite/plans/[id]/route.ts',
    'app/api/accessibilite/plans/route.ts',
    'app/api/categories/[id]/route.ts',
    'app/api/categories-programme/route.ts',
    'app/api/csrf/route.ts',
    'app/api/files/veille/[veilleId]/[filename]/route.ts',
    'app/api/programmes-formation/by-code/[code]/route.ts',
    'app/api/programmes-formation/par-categorie/groups/route.ts',
    'app/api/rendezvous/[id]/statut/route.ts',
    'app/api/veille/[id]/commentaire/route.ts',
    'app/api/veille/[id]/commentaires/[commentaireId]/route.ts',
    'app/api/veille/[id]/route.ts'
  ];

  const backupDir = path.join(process.cwd(), 'backups', 'working-files', 'functional');
  
  // Créer le dossier de sauvegarde
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  let backedUpCount = 0;
  let errorCount = 0;

  console.log('💾 Sauvegarde des fichiers fonctionnels...');

  workingFiles.forEach(filePath => {
    try {
      const sourcePath = path.join(process.cwd(), filePath);
      const fileName = path.basename(filePath);
      const destPath = path.join(backupDir, fileName);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        backedUpCount++;
        console.log(`  ✅ ${filePath}`);
      } else {
        console.log(`  ⚠️  Fichier non trouvé: ${filePath}`);
        errorCount++;
      }
    } catch (error: any) {
      console.log(`  ❌ Erreur lors de la sauvegarde de ${filePath}: ${error.message}`);
      errorCount++;
    }
  });

  // Créer un fichier de métadonnées
  const metadata = {
    timestamp: new Date().toISOString(),
    totalFiles: workingFiles.length,
    backedUpCount,
    errorCount,
    files: workingFiles.map(file => ({
      path: file,
      backedUp: fs.existsSync(path.join(backupDir, path.basename(file)))
    }))
  };

  fs.writeFileSync(
    path.join(backupDir, 'backup-metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );

  console.log(`\n📊 RÉSUMÉ DE LA SAUVEGARDE`);
  console.log('==========================');
  console.log(`✅ Fichiers sauvegardés: ${backedUpCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📁 Dossier de sauvegarde: ${backupDir}`);

  if (backedUpCount > 0) {
    console.log('\n🎉 Sauvegarde terminée !');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Reconstruire les fichiers problématiques');
    console.log('  2. Vérifier avec: npx tsc --noEmit');
    console.log('  3. Tester avec: npm run audit:standardized');
  }

  return backedUpCount > 0;
}

// Exécution de la sauvegarde
const success = backupWorkingFiles();
process.exit(success ? 0 : 1);
