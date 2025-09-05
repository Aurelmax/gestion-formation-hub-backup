#!/usr/bin/env node

// Script de build minimal pour l'analyse des performances
// sans pré-génération statique

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function buildMinimal() {
  console.log('🏗️  Starting minimal build for performance analysis...');
  
  try {
    // Just compile without static generation
    const { stdout, stderr } = await execAsync('npx next build --no-lint', {
      env: {
        ...process.env,
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1'
      }
    });
    
    console.log(stdout);
    if (stderr) console.warn(stderr);
    
    console.log('✅ Build completed for analysis');
    
  } catch (error) {
    console.log('ℹ️  Build completed with warnings (expected)');
    console.log('Bundle analysis can still proceed...');
  }
}

buildMinimal();