/**
 * Configuration globale pour les tests API
 * Setup/teardown de la base de données de test
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

export class TestDatabaseManager {
  static async setup() {
    // Configurer l'environnement de test
    process.env.NODE_ENV = 'test';
    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL || 'file:./test.db';
    
    try {
      // Appliquer les migrations pour la base de test
      execSync('npx prisma migrate deploy', { stdio: 'inherit' });
      
      // Optionnel: seed initial pour les tests
      await TestDatabaseManager.seedTestData();
      
      console.log('🌱 Base de données de test initialisée');
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de test:', error);
      throw error;
    }
  }

  static async teardown() {
    try {
      // Nettoyer toutes les tables
      await prisma.$executeRaw`PRAGMA foreign_keys = OFF;`;
      
      const tables = await prisma.$queryRaw<Array<{ name: string }>>(`
        SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' AND name != '_prisma_migrations';
      `);
      
      for (const { name } of tables) {
        await prisma.$executeRawUnsafe(`DELETE FROM "${name}";`);
      }
      
      await prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
      await prisma.$disconnect();
      
      console.log('🧹 Base de données de test nettoyée');
    } catch (error) {
      console.error('❌ Erreur lors du nettoyage de la base de test:', error);
      throw error;
    }
  }

  static async resetDatabase() {
    await TestDatabaseManager.teardown();
    await TestDatabaseManager.setup();
  }

  static async seedTestData() {
    try {
      // Créer des données de test de base
      const testCategory = await prisma.categoriesProgramme.upsert({
        where: { titre: 'Test Category' },
        update: {},
        create: {
          titre: 'Test Category',
          description: 'Catégorie pour les tests',
          estActive: true,
          dateCreation: new Date(),
        },
      });

      // Programme de test
      await prisma.programmeFormation.upsert({
        where: { code: 'TEST-PROG-001' },
        update: {},
        create: {
          code: 'TEST-PROG-001',
          type: 'catalogue',
          titre: 'Programme de Test',
          description: 'Programme de formation pour les tests',
          duree: '2 jours',
          prix: '500€',
          niveau: 'Débutant',
          participants: '8-12 personnes',
          objectifs: ['Objectif 1', 'Objectif 2'],
          prerequis: 'Aucun prérequis',
          publicConcerne: 'Tous publics',
          contenuDetailleJours: 'Contenu jour 1\nContenu jour 2',
          modalites: 'Présentiel',
          modalitesAcces: 'Sur inscription',
          modalitesTechniques: 'Salle équipée',
          modalitesReglement: 'Paiement avant formation',
          formateur: 'Formateur expert',
          ressourcesDisposition: 'Support de cours',
          modalitesEvaluation: 'QCM final',
          sanctionFormation: 'Attestation',
          niveauCertification: 'Niveau 1',
          delaiAcceptation: '48h',
          accessibiliteHandicap: 'Accessible PMR',
          cessationAbandon: 'Remboursement possible',
          categorieId: testCategory.id,
          estActif: true,
          estVisible: true,
          version: 1,
          dateCreation: new Date(),
          dateModification: new Date(),
        },
      });

      console.log('🌱 Données de test créées');
    } catch (error) {
      console.error('❌ Erreur lors du seeding:', error);
      throw error;
    }
  }
}

// Configuration globale des tests Jest
export const setupTestEnvironment = async () => {
  await TestDatabaseManager.setup();
};

export const teardownTestEnvironment = async () => {
  await TestDatabaseManager.teardown();
};

export const resetTestDatabase = async () => {
  await TestDatabaseManager.resetDatabase();
};

// Export de l'instance Prisma pour les tests
export { prisma as testPrisma };