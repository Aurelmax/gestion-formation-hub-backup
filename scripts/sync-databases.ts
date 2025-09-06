import { PrismaClient } from '@prisma/client';
import fs from 'fs';

interface BackupData {
  categories: any[];
  programmes: any[];
  formations: any[];
  apprenants: any[];
  rendezvous: any[];
  timestamp: string;
}

const ENVS = {
  production: '.env.production',
  development: '.env.development',
  test: '.env.test'
};

async function loadEnvironment(env: keyof typeof ENVS) {
  const envFile = ENVS[env];
  if (!fs.existsSync(envFile)) {
    throw new Error(`Fichier d'environnement ${envFile} non trouvé`);
  }
  
  fs.copyFileSync(envFile, '.env');
  console.log(`✅ Environnement ${env} chargé`);
}

async function exportData(env: keyof typeof ENVS): Promise<BackupData> {
  console.log(`📤 Export depuis ${env}...`);
  await loadEnvironment(env);
  
  const prisma = new PrismaClient();
  
  try {
    const [categories, programmes, formations, apprenants, rendezvous] = await Promise.all([
      prisma.categorieProgramme.findMany({
        orderBy: { ordre: 'asc' }
      }),
      prisma.programmeFormation.findMany({
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

    console.log(`   📁 ${categories.length} catégories`);
    console.log(`   📚 ${programmes.length} programmes`);
    console.log(`   🎓 ${formations.length} formations`);
    console.log(`   👤 ${apprenants.length} apprenants`);
    console.log(`   📅 ${rendezvous.length} rendez-vous`);

    return {
      categories,
      programmes,
      formations,
      apprenants,
      rendezvous,
      timestamp: new Date().toISOString()
    };
    
  } finally {
    await prisma.$disconnect();
  }
}

async function importData(env: keyof typeof ENVS, data: BackupData) {
  console.log(`📥 Import vers ${env}...`);
  await loadEnvironment(env);
  
  const prisma = new PrismaClient();
  
  try {
    // Vider la base de destination
    console.log(`🗑️  Nettoyage de la base ${env}...`);
    await prisma.rendezvous.deleteMany({});
    await prisma.programmeFormation.deleteMany({});
    await prisma.formation.deleteMany({});
    await prisma.apprenant.deleteMany({});
    await prisma.categorieProgramme.deleteMany({});
    
    // Importer les données
    console.log('📥 Import des catégories...');
    for (const category of data.categories) {
      const { id, ...categoryData } = category;
      await prisma.categorieProgramme.create({
        data: { ...categoryData, id }
      });
    }
    
    console.log('📥 Import des formations...');
    for (const formation of data.formations) {
      const { id, ...formationData } = formation;
      await prisma.formation.create({
        data: { ...formationData, id }
      });
    }
    
    console.log('📥 Import des apprenants...');
    for (const apprenant of data.apprenants) {
      const { id, ...apprenantData } = apprenant;
      await prisma.apprenant.create({
        data: { ...apprenantData, id }
      });
    }
    
    console.log('📥 Import des programmes...');
    for (const programme of data.programmes) {
      const { id, ...programmeData } = programme;
      await prisma.programmeFormation.create({
        data: { ...programmeData, id }
      });
    }
    
    console.log('📥 Import des rendez-vous...');
    for (const rdv of data.rendezvous) {
      const { id, ...rdvData } = rdv;
      await prisma.rendezvous.create({
        data: { ...rdvData, id }
      });
    }
    
    console.log(`✅ Import terminé vers ${env}`);
    
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  try {
    const source = (process.argv[2] as keyof typeof ENVS) || 'production';
    const target = (process.argv[3] as keyof typeof ENVS) || 'development';
    
    if (!ENVS[source] || !ENVS[target]) {
      console.error(`❌ Environnements invalides. Utilisez: ${Object.keys(ENVS).join(', ')}`);
      console.error('Usage: npm run db:sync [source] [target]');
      console.error('Exemple: npm run db:sync production development');
      process.exit(1);
    }

    if (source === target) {
      console.error('❌ Source et destination ne peuvent pas être identiques');
      process.exit(1);
    }

    console.log('🔄 Synchronisation des bases de données');
    console.log(`📤 Source: ${source}`);
    console.log(`📥 Destination: ${target}`);
    console.log('');
    
    // Export depuis la source
    const data = await exportData(source);
    
    console.log('');
    
    // Import vers la destination
    await importData(target, data);
    
    console.log('');
    console.log('🎉 Synchronisation terminée avec succès !');
    console.log(`✅ ${source} → ${target}`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation:', error);
    process.exit(1);
  }
}

// Utilisation: npm run db:sync [source] [target]
// Exemple: npm run db:sync production development
main();