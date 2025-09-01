const fs = require('fs');

// Vérifiez les schémas multiples
const prismaFiles = fs.readdirSync('./prisma').filter(f => f.endsWith('.prisma'));
if (prismaFiles.length > 1) {
  console.warn('⚠️  Multiple Prisma schemas detected:', prismaFiles);
} else {
  console.log('✅ Un seul schéma Prisma trouvé:', prismaFiles[0]);
}

// Vérifiez les migrations orphelines
const migrations = fs.readdirSync('./prisma/migrations');
const dupMigrations = migrations.filter(m => m.includes('duplicate'));
if (dupMigrations.length) {
  console.warn('⚠️  Migrations orphelines trouvées:', dupMigrations);
} else {
  console.log('✅ Aucune migration orpheline détectée');
}

// Vérifiez la présence du modèle Formation
try {
  const schemaContent = fs.readFileSync('./prisma/schema.prisma', 'utf-8');
  if (schemaContent.includes('model Formation {')) {
    console.log('✅ Le modèle Formation est présent dans le schéma');
  } else {
    console.warn('⚠️  Le modèle Formation n\'est pas trouvé dans le schéma');
  }
} catch (error) {
  console.error('Erreur lors de la lecture du schéma:', error);
}

// Vérifiez la cohérence des fichiers générés
if (fs.existsSync('./node_modules/.prisma/client/index.d.ts')) {
  const clientTypes = fs.readFileSync('./node_modules/.prisma/client/index.d.ts', 'utf-8');
  if (clientTypes.includes('formation: Prisma.FormationDelegate')) {
    console.log('✅ Le modèle Formation est correctement exposé dans le client Prisma généré');
  } else {
    console.warn('⚠️  Le modèle Formation n\'est pas correctement exposé dans le client Prisma');
  }
} else {
  console.warn('⚠️  Fichier de types Prisma client non trouvé, exécutez npx prisma generate');
}

console.log('\n🔍 Vérification terminée');
