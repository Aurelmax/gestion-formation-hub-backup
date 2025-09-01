#!/usr/bin/env node
/**
 * Script wrapper pour exécuter le script TypeScript
 */

// Importer child_process en utilisant ESM
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Obtenir __dirname équivalent en ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Exécute directement le fichier TypeScript avec ts-node
spawn(
  'npx', 
  ['ts-node', `${__dirname}/migrate-api.ts`, ...process.argv.slice(2)], 
  { stdio: 'inherit' }
);
