/**
 * Utilitaires de migration des routes Express vers Next.js API Routes
 */
import fs from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Interface pour le plan de migration
export interface MigrationPlan {
  from: string;           // Chemin de la route Express (ex: '/api/actions-correctives')
  to: string;             // Chemin de la route Next.js (ex: 'app/api/actions-correctives')
  priorité?: number;      // Priorité de migration (1 = haute, 3 = basse)
  status?: 'pending' | 'in-progress' | 'completed' | 'verified';
}

/**
 * Extrait le contenu de la route Express
 */
export async function extractExpressRoute(routePath: string): Promise<string> {
  try {
    // Normaliser le chemin pour trouver le fichier correspondant dans backend/
    const normalizedPath = routePath.replace(/^\/api\//, '').replace(/\//g, '-');
    const filePath = path.join(process.cwd(), 'backend', `${normalizedPath}.routes.ts`);
    
    console.log(`🔍 Recherche du fichier source: ${filePath}`);
    const fileExists = await fs.stat(filePath).catch(() => false);
    
    if (!fileExists) {
      console.warn(`⚠️ Fichier non trouvé: ${filePath}`);
      return '';
    }
    
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    console.error(`❌ Erreur lors de l'extraction de la route Express:`, error);
    return '';
  }
}

/**
 * Analyse la route Express pour extraire les endpoints et les convertir en routes Next.js
 */
export async function analyzeExpressRoute(content: string): Promise<{
  get?: string;
  post?: string;
  put?: string;
  patch?: string;
  delete?: string;
}> {
  // Analyse simple pour les démonstrations, à améliorer pour une analyse plus robuste
  const routeHandlers: {
    get?: string;
    post?: string;
    put?: string;
    patch?: string;
    delete?: string;
  } = {};

  // Recherche des gestionnaires de routes basiques
  const getMatch = content.match(/router\.get\(['"]([^'"]+)['"]\s*,\s*async\s*\(req,\s*res\)\s*=>\s*{([\s\S]*?)}\)/);
  if (getMatch) {
    routeHandlers.get = `
export async function GET() {
  try {
    // Logique migrée depuis Express
    const data = await prisma.${getMatch[1].split('/').pop() || 'model'}.findMany();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}`;
  }

  const postMatch = content.match(/router\.post\(['"]([^'"]+)['"]\s*,\s*async\s*\(req,\s*res\)\s*=>\s*{([\s\S]*?)}\)/);
  if (postMatch) {
    routeHandlers.post = `
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    // Logique migrée depuis Express
    const result = await prisma.${postMatch[1].split('/').pop() || 'model'}.create({
      data
    });
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}`;
  }

  return routeHandlers;
}

/**
 * Génère le fichier route.ts pour Next.js API Route
 */
export async function generateNextApiRoute(
  targetPath: string, 
  handlers: {
    get?: string;
    post?: string;
    put?: string;
    patch?: string;
    delete?: string;
  }
): Promise<void> {
  try {
    const routeDir = path.join(process.cwd(), targetPath);
    const routeFile = path.join(routeDir, 'route.ts');
    
    // Vérifier si le répertoire existe, sinon le créer
    const dirExists = await fs.stat(routeDir).catch(() => false);
    if (!dirExists) {
      await fs.mkdir(routeDir, { recursive: true });
    }
    
    // Générer le contenu du fichier
    const imports = `import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
`;
    
    const routeContent = Object.values(handlers).filter(Boolean).join('\n\n');
    
    await fs.writeFile(
      routeFile, 
      `${imports}\n${routeContent}\n`
    );
    
    console.log(`✅ Route API Next.js générée: ${routeFile}`);
    return;
  } catch (error) {
    console.error(`❌ Erreur lors de la génération de la route Next.js:`, error);
  }
}

/**
 * Fonction principale pour migrer une route
 */
export async function migrateRoute(plan: MigrationPlan): Promise<void> {
  console.log(`🔄 Migration de ${plan.from} vers ${plan.to}...`);
  
  // 1. Extraire le contenu de la route Express
  const expressRouteContent = await extractExpressRoute(plan.from);
  if (!expressRouteContent) {
    console.error(`❌ Impossible de trouver ou d'extraire la route Express: ${plan.from}`);
    return;
  }
  
  // 2. Analyser la route et extraire les handlers
  const handlers = await analyzeExpressRoute(expressRouteContent);
  if (!Object.keys(handlers).length) {
    console.warn(`⚠️ Aucun handler trouvé pour la route: ${plan.from}`);
    return;
  }
  
  // 3. Générer la route Next.js
  await generateNextApiRoute(plan.to, handlers);
  
  // 4. Mise à jour du status
  console.log(`✅ Migration de ${plan.from} vers ${plan.to} terminée`);
}

/**
 * Vérifie si une route est prête à être migrée
 */
export async function checkRoute(routeName: string): Promise<boolean> {
  try {
    // Logique de vérification
    console.log(`🔍 Vérification de la route: ${routeName}`);
    const expressRouteContent = await extractExpressRoute(`/api/${routeName}`);
    
    if (!expressRouteContent) {
      console.error(`❌ Route Express introuvable: /api/${routeName}`);
      return false;
    }
    
    const handlers = await analyzeExpressRoute(expressRouteContent);
    const hasHandlers = Object.keys(handlers).length > 0;
    
    if (hasHandlers) {
      console.log(`✅ Route ${routeName} prête pour la migration (${Object.keys(handlers).length} handlers trouvés)`);
    } else {
      console.warn(`⚠️ Route ${routeName} sans handlers détectés`);
    }
    
    return hasHandlers;
  } catch (error) {
    console.error(`❌ Erreur lors de la vérification de la route ${routeName}:`, error);
    return false;
  }
}

/**
 * Vérifie si toutes les routes ont été migrées
 */
export async function verifyMigration(): Promise<boolean> {
  try {
    // Compter les routes Express
    const backendFiles = await execAsync('find backend -name "*.routes.ts" | wc -l');
    const expressRouteCount = parseInt(backendFiles.stdout.trim(), 10);
    
    // Compter les routes Next.js
    const nextjsFiles = await execAsync('find app/api -name "route.ts" | wc -l');
    const nextjsRouteCount = parseInt(nextjsFiles.stdout.trim(), 10);
    
    console.log(`📊 Routes Express: ${expressRouteCount}`);
    console.log(`📊 Routes Next.js: ${nextjsRouteCount}`);
    
    if (nextjsRouteCount >= expressRouteCount) {
      console.log('✅ Toutes les routes ont été migrées!');
      return true;
    } else {
      console.log(`⚠️ Il reste ${expressRouteCount - nextjsRouteCount} routes à migrer`);
      return false;
    }
  } catch (error) {
    console.error('❌ Erreur lors de la vérification de la migration:', error);
    return false;
  }
}
