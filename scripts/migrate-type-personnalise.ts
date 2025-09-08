/**
 * Script de migration : 'sur-mesure' → 'personnalise'
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateTypes() {
  try {
    console.log('🚀 Début de la migration des types de programmes...');

    // Mettre à jour tous les programmes 'sur-mesure' vers 'personnalise'
    const result = await prisma.programmeFormation.updateMany({
      where: {
        type: 'sur-mesure'
      },
      data: {
        type: 'personnalise'
      }
    });

    console.log(`✅ Migration terminée : ${result.count} programmes mis à jour`);

    // Vérifier le résultat
    const catalogueCount = await prisma.programmeFormation.count({
      where: { type: 'catalogue' }
    });
    const personnaliseCount = await prisma.programmeFormation.count({
      where: { type: 'personnalise' }
    });

    console.log(`📊 Résultat :`);
    console.log(`  - Programmes catalogue : ${catalogueCount}`);
    console.log(`  - Programmes personnalisés : ${personnaliseCount}`);

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateTypes();