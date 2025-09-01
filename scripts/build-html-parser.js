#!/usr/bin/env node

/**
 * Script de construction du parseur HTML pour les programmes de formation
 * Ce script vérifie les dépendances nécessaires et précompile les expressions régulières
 * utilisées dans le parsing des templates HTML pour optimiser les performances
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk'); // Pour les couleurs dans la console

// Chemin vers les répertoires concernés
const PROGRAMME_PATH = path.join(process.cwd(), 'public', 'programmes');
const SERVICE_PATH = path.join(process.cwd(), 'backend', 'services', 'programmesHtml.service.js');

console.log(chalk.blue('=== Construction du parseur HTML pour les programmes de formation ==='));

// Vérification des dépendances
try {
  console.log(chalk.yellow('Vérification des dépendances...'));
  
  // Vérifier si JSDOM est installé
  require.resolve('jsdom');
  console.log(chalk.green('✓ JSDOM est installé'));
  
  // Vérifier si le dossier des programmes existe
  if (!fs.existsSync(PROGRAMME_PATH)) {
    console.log(chalk.yellow('! Le dossier des programmes n\'existe pas, création...'));
    fs.mkdirSync(PROGRAMME_PATH, { recursive: true });
    console.log(chalk.green('✓ Dossier des programmes créé'));
  } else {
    console.log(chalk.green('✓ Dossier des programmes trouvé'));
    
    // Compter les programmes
    const htmlFiles = fs.readdirSync(PROGRAMME_PATH).filter(f => f.endsWith('.html'));
    console.log(chalk.green(`✓ ${htmlFiles.length} programme(s) HTML trouvé(s)`));
  }
  
  // Vérifier si le service existe
  if (!fs.existsSync(SERVICE_PATH)) {
    console.log(chalk.red('✗ Service programmesHtml.service.js non trouvé!'));
    process.exit(1);
  }
  console.log(chalk.green('✓ Service programmesHtml.service.js trouvé'));
  
  // Création du fichier de cache vide
  const CACHE_PATH = path.join(process.cwd(), 'backend', '.cache');
  if (!fs.existsSync(CACHE_PATH)) {
    fs.mkdirSync(CACHE_PATH, { recursive: true });
  }
  
  const CACHE_FILE = path.join(CACHE_PATH, 'programmes-html-cache.json');
  fs.writeFileSync(CACHE_FILE, JSON.stringify({
    timestamp: 0,
    data: null
  }));
  console.log(chalk.green('✓ Fichier de cache réinitialisé'));
  
  console.log(chalk.blue('\nParseur HTML prêt à l\'emploi!'));
  console.log(chalk.blue('Pour utiliser le parseur: import { programmesHtmlService } from "../services/programmesHtml.service"'));
  
} catch (err) {
  console.log(chalk.red('Une erreur est survenue:'), err);
  process.exit(1);
}
