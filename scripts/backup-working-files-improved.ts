import * as fs from 'fs';
import * as path from 'path';

/**
 * Script amélioré pour sauvegarder les fichiers fonctionnels avec structure des dossiers
 */

function backupWorkingFilesImproved() {
  console.log('💾 SAUVEGARDE AMÉLIORÉE DES FICHIERS FONCTIONNELS');
  console.log('================================================');

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

  const backupDir = path.join(process.cwd(), 'backups', 'working-files', 'functional-structured');
  
  // Créer le dossier de sauvegarde
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  let backedUpCount = 0;
  let errorCount = 0;

  console.log('💾 Sauvegarde des fichiers fonctionnels avec structure...');

  workingFiles.forEach(filePath => {
    try {
      const sourcePath = path.join(process.cwd(), filePath);
      const destPath = path.join(backupDir, filePath);

      if (fs.existsSync(sourcePath)) {
        // Créer le dossier de destination s'il n'existe pas
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        // Copier le fichier
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
    backupLocation: backupDir,
    files: workingFiles.map(file => ({
      path: file,
      backedUp: fs.existsSync(path.join(backupDir, file))
    }))
  };

  fs.writeFileSync(
    path.join(backupDir, 'backup-metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );

  console.log(`\n📊 RÉSUMÉ DE LA SAUVEGARDE AMÉLIORÉE`);
  console.log('====================================');
  console.log(`✅ Fichiers sauvegardés: ${backedUpCount}`);
  console.log(`❌ Erreurs: ${errorCount}`);
  console.log(`📁 Dossier de sauvegarde: ${backupDir}`);

  if (backedUpCount > 0) {
    console.log('\n🎉 Sauvegarde terminée !');
    console.log('📝 Structure préservée dans: backups/working-files/functional-structured/');
    console.log('📝 Prochaines étapes:');
    console.log('  1. Reconstruire les fichiers problématiques');
    console.log('  2. Vérifier avec: npx tsc --noEmit');
    console.log('  3. Tester avec: npm run audit:standardized');
  }

  return backedUpCount > 0;
}

// Exécution de la sauvegarde améliorée
const success = backupWorkingFilesImproved();
process.exit(success ? 0 : 1);
