import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

// Configuration des environnements
const ENVS = {
  production: '.env.production',
  development: '.env.development',
  test: '.env.test'
};

interface BackupData {
  categories: any[];
  programmes: any[];
  formations: any[];
  apprenants: any[];
  rendezvous: any[];
  timestamp: string;
}

async function loadEnvironment(env: keyof typeof ENVS) {
  const envFile = ENVS[env];
  if (!fs.existsSync(envFile)) {
    throw new Error(`Fichier d'environnement ${envFile} non trouvé`);
  }
  
  // Copier le fichier d'environnement
  fs.copyFileSync(envFile, '.env');
  console.log(`✅ Environnement ${env} chargé`);
}

async function backupFromEnvironment(env: keyof typeof ENVS): Promise<BackupData> {
  console.log(`🔄 Backup depuis l'environnement ${env}...`);
  
  await loadEnvironment(env);
  
  // Créer une nouvelle instance Prisma après le changement d'environnement
  const prisma = new PrismaClient();
  
  try {
    const [categories, programmes, formations, apprenants, rendezvous] = await Promise.all([
      prisma.categorieProgramme.findMany({
        orderBy: { ordre: 'asc' }
      }),
      prisma.programmeFormation.findMany({
        include: { categorie: true },
        orderBy: { code: 'asc' }
      }),
      prisma.formation.findMany({
        orderBy: { code: 'asc' }
      }),
      prisma.apprenant.findMany({
        orderBy: { nom: 'asc' }
      }),
      prisma.rendezvous.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);

    const backupData: BackupData = {
      categories,
      programmes,
      formations,
      apprenants,
      rendezvous,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Backup ${env} terminé:`);
    console.log(`   📁 ${categories.length} catégories`);
    console.log(`   📚 ${programmes.length} programmes`);
    console.log(`   🎓 ${formations.length} formations`);
    console.log(`   👤 ${apprenants.length} apprenants`);
    console.log(`   📅 ${rendezvous.length} rendez-vous`);

    return backupData;
    
  } finally {
    await prisma.$disconnect();
  }
}

async function saveBackup(data: BackupData, env: string) {
  const backupsDir = path.join(process.cwd(), 'backups');
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true });
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `backup-${env}-${timestamp}.json`;
  const filepath = path.join(backupsDir, filename);

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
  console.log(`💾 Backup sauvé : ${filepath}`);
  
  return filepath;
}

async function main() {
  try {
    const env = process.argv[2] as keyof typeof ENVS || 'production';
    
    if (!ENVS[env]) {
      console.error(`❌ Environnement invalide. Utilisez: ${Object.keys(ENVS).join(', ')}`);
      process.exit(1);
    }

    console.log('🚀 Démarrage du backup...');
    console.log(`🎯 Environnement cible: ${env}`);
    
    const backupData = await backupFromEnvironment(env);
    const filepath = await saveBackup(backupData, env);
    
    console.log('');
    console.log('🎉 Backup terminé avec succès !');
    console.log(`📂 Fichier: ${path.basename(filepath)}`);
    
  } catch (error) {
    console.error('❌ Erreur lors du backup:', error);
    process.exit(1);
  }
}

// Utilisation: npm run db:backup [production|development|test]
main();