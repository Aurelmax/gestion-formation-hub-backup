import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

// Charger les variables d'environnement
dotenv.config();

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const prisma = new PrismaClient();

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m'
};

// Fonction utilitaire pour les logs
const log = {
  info: (message: string) => console.log(`${colors.blue}INFO:${colors.reset} ${message}`),
  success: (message: string) => console.log(`${colors.green}✅ SUCCESS:${colors.reset} ${message}`),
  error: (message: string, error?: any) => {
    console.error(`${colors.red}❌ ERROR:${colors.reset} ${message}`);
    if (error) {
      console.error(`${colors.red}Details:${colors.reset}`, error);
    }
  },
  warn: (message: string) => console.log(`${colors.yellow}⚠️ WARNING:${colors.reset} ${message}`),
  title: (message: string) => console.log(`\n${colors.bright}${colors.magenta}${message}${colors.reset}\n`)
};

// Types
interface ProgrammeFormationTest {
  code: string;
  type: string;
  titre: string;
  description: string;
  duree: string;
  prix: string;
  niveau: string;
  participants: string;
  objectifs: string[];
  prerequis: string;
  publicConcerne: string;
  contenuDetailleJours: string;
  modalites: string;
  modalitesAcces: string;
  modalitesEvaluation: string;
  sanctionFormation: string;
  niveauCertification: string;
  ressourcesDisposition: string;
  delaiAcceptation: string;
  accessibiliteHandicap: string;
  cessationAbandon: string;
  pictogramme?: string;
  formateur: string;
  categorieId?: string;
}

// Variables globales pour stocker les résultats des tests
let createdProgrammeId: string;
let categorieId: string;

/**
 * Test de récupération de toutes les catégories
 */
async function testGetCategories() {
  log.title('Test GET /api/categories-programme');
  
  try {
    const response = await fetch(`${API_URL}/categories-programme`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const categories = await response.json();
    log.success('Catégories récupérées avec succès');
    
    if (categories.length > 0) {
      categorieId = categories[0].id;
      log.info(`Première catégorie trouvée avec l'ID: ${categorieId}`);
      return true;
    } else {
      log.warn('Aucune catégorie trouvée dans la base de données');
      return false;
    }
  } catch (error) {
    log.error('Erreur lors de la récupération des catégories', error);
    return false;
  }
}

/**
 * Test de récupération de tous les programmes
 */
async function testGetAllProgrammes() {
  log.title('Test GET /api/programmes-formation');
  
  try {
    const response = await fetch(`${API_URL}/programmes-formation`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const programmes = await response.json();
    log.success('Programmes récupérés avec succès');
    log.info(`Nombre de programmes: ${programmes.length}`);
    
    return programmes.length > 0;
  } catch (error) {
    log.error('Erreur lors de la récupération des programmes', error);
    return false;
  }
}

/**
 * Test de création d'un programme
 */
async function testCreateProgramme() {
  log.title('Test POST /api/programmes-formation');
  
  const testProgramme: ProgrammeFormationTest = {
    code: `TEST-${Date.now().toString().slice(-6)}`,
    type: "catalogue",
    titre: "Programme de test API",
    description: "Description du programme de test",
    duree: "14 heures (2 jours)",
    prix: "800 €",
    niveau: "Intermédiaire",
    participants: "1 à 3",
    objectifs: ["Objectif test 1", "Objectif test 2"],
    prerequis: "Aucun prérequis particulier",
    publicConcerne: "Tout public",
    contenuDetailleJours: "Jour 1: Introduction\nJour 2: Approfondissement",
    modalites: "Présentiel",
    modalitesAcces: "Accessible dès inscription",
    modalitesEvaluation: "QCM et projet pratique",
    sanctionFormation: "Attestation de formation",
    niveauCertification: "N/A",
    ressourcesDisposition: "Support de cours numérique",
    delaiAcceptation: "10 jours",
    accessibiliteHandicap: "Accessible",
    cessationAbandon: "Remboursement au prorata",
    pictogramme: "🧪", // Emoji test
    formateur: "Formateur Test",
    categorieId: categorieId // Si disponible
  };
  
  try {
    const response = await fetch(`${API_URL}/programmes-formation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProgramme),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, details: ${errorData}`);
    }
    
    const createdProgramme = await response.json();
    createdProgrammeId = createdProgramme.id;
    
    log.success(`Programme créé avec succès, ID: ${createdProgrammeId}`);
    return true;
  } catch (error) {
    log.error('Erreur lors de la création du programme', error);
    return false;
  }
}

/**
 * Test de récupération d'un programme par ID
 */
async function testGetProgrammeById() {
  if (!createdProgrammeId) {
    log.warn('Pas d\'ID de programme disponible pour le test GET by ID');
    return false;
  }
  
  log.title(`Test GET /api/programmes-formation/${createdProgrammeId}`);
  
  try {
    const response = await fetch(`${API_URL}/programmes-formation/${createdProgrammeId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const programme = await response.json();
    log.success('Programme récupéré avec succès par ID');
    log.info(`Titre: ${programme.titre}`);
    
    return true;
  } catch (error) {
    log.error('Erreur lors de la récupération du programme par ID', error);
    return false;
  }
}

/**
 * Test de récupération des programmes par type
 */
async function testGetProgrammesByType() {
  log.title('Test GET /api/programmes-formation/type/catalogue');
  
  try {
    const response = await fetch(`${API_URL}/programmes-formation/type/catalogue`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const programmes = await response.json();
    log.success('Programmes de type "catalogue" récupérés avec succès');
    log.info(`Nombre de programmes: ${programmes.length}`);
    
    return true;
  } catch (error) {
    log.error('Erreur lors de la récupération des programmes par type', error);
    return false;
  }
}

/**
 * Test de mise à jour d'un programme
 */
async function testUpdateProgramme() {
  if (!createdProgrammeId) {
    log.warn('Pas d\'ID de programme disponible pour le test UPDATE');
    return false;
  }
  
  log.title(`Test PUT /api/programmes-formation/${createdProgrammeId}`);
  
  const updatedData = {
    titre: "Programme de test API (mis à jour)",
    description: "Description mise à jour"
  };
  
  try {
    const response = await fetch(`${API_URL}/programmes-formation/${createdProgrammeId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const updatedProgramme = await response.json();
    log.success('Programme mis à jour avec succès');
    log.info(`Nouveau titre: ${updatedProgramme.titre}`);
    
    return true;
  } catch (error) {
    log.error('Erreur lors de la mise à jour du programme', error);
    return false;
  }
}

/**
 * Test de suppression d'un programme
 */
async function testDeleteProgramme() {
  if (!createdProgrammeId) {
    log.warn('Pas d\'ID de programme disponible pour le test DELETE');
    return false;
  }
  
  log.title(`Test DELETE /api/programmes-formation/${createdProgrammeId}`);
  
  try {
    const response = await fetch(`${API_URL}/programmes-formation/${createdProgrammeId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    log.success('Programme supprimé avec succès');
    return true;
  } catch (error) {
    log.error('Erreur lors de la suppression du programme', error);
    return false;
  }
}

/**
 * Fonction principale qui exécute tous les tests
 */
async function runAllTests() {
  log.title('DÉMARRAGE DES TESTS API PROGRAMMES-FORMATION');
  
  // Récupérer une catégorie pour les tests
  await testGetCategories();
  
  // Exécuter les tests dans l'ordre CRUD
  const results = [];
  
  // Tests GET (avant création)
  results.push({ name: 'GET All Programmes', success: await testGetAllProgrammes() });
  
  // Tests CREATE
  results.push({ name: 'CREATE Programme', success: await testCreateProgramme() });
  
  // Tests GET (après création)
  results.push({ name: 'GET Programme by ID', success: await testGetProgrammeById() });
  results.push({ name: 'GET Programmes by Type', success: await testGetProgrammesByType() });
  
  // Tests UPDATE
  results.push({ name: 'UPDATE Programme', success: await testUpdateProgramme() });
  
  // Tests DELETE
  results.push({ name: 'DELETE Programme', success: await testDeleteProgramme() });
  
  // Afficher le récapitulatif
  log.title('RÉCAPITULATIF DES TESTS');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const result of results) {
    if (result.success) {
      log.success(`${result.name}: OK`);
      successCount++;
    } else {
      log.error(`${result.name}: ÉCHEC`);
      failCount++;
    }
  }
  
  log.title(`RÉSULTAT FINAL: ${successCount}/${results.length} tests réussis`);
  
  // Fermer la connexion Prisma
  await prisma.$disconnect();
}

// Lancer les tests
runAllTests().catch(error => {
  console.error('Erreur non gérée dans les tests:', error);
  process.exit(1);
});
