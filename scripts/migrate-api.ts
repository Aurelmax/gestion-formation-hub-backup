#!/usr/bin/env node
/**
 * Script de migration des API Express vers Next.js API Routes
 * 
 * Utilisation:
 * npm run migrate:api                    - Migrer toutes les routes selon le plan
 * npm run migrate:api -- --check route   - Vérifier si une route est prête pour la migration
 * npm run migrate:api -- --verify        - Vérifier si toutes les routes ont été migrées
 * npm run migrate:api -- --route route   - Migrer uniquement la route spécifiée
 */

import { migrateRoute, checkRoute, verifyMigration, MigrationPlan } from './migrate-utils';

// Plan de migration
const migrationPlan: MigrationPlan[] = [
  { from: '/api/actions-correctives', to: 'app/api/actions-correctives', priorité: 1 },
  { from: '/api/formations', to: 'app/api/formations', priorité: 1 },
  { from: '/api/reclamations', to: 'app/api/reclamations', priorité: 1 },
  { from: '/api/competences', to: 'app/api/competences', priorité: 2 },
  { from: '/api/programmes-formation', to: 'app/api/programmes-formation', priorité: 2 },
  { from: '/api/positionnement-requests', to: 'app/api/positionnement-requests', priorité: 2 },
  { from: '/api/programmes-html', to: 'app/api/programmes-html', priorité: 3 },
  { from: '/api/auth', to: 'app/api/auth', priorité: 3 }
];

/**
 * Point d'entrée principal
 */
async function main() {
  const args = process.argv.slice(2);

  // Traitement des arguments
  if (args.includes('--check')) {
    const routeIndex = args.indexOf('--check') + 1;
    const routeName = args[routeIndex];
    
    if (!routeName) {
      console.error('❌ Veuillez spécifier une route à vérifier: npm run migrate:api -- --check actions-correctives');
      process.exit(1);
    }
    
    await checkRoute(routeName);
    return;
  }
  
  if (args.includes('--verify')) {
    await verifyMigration();
    return;
  }
  
  if (args.includes('--route')) {
    const routeIndex = args.indexOf('--route') + 1;
    const routeName = args[routeIndex];
    
    if (!routeName) {
      console.error('❌ Veuillez spécifier une route à migrer: npm run migrate:api -- --route actions-correctives');
      process.exit(1);
    }
    
    const route = migrationPlan.find(p => p.from === `/api/${routeName}` || p.from.endsWith(`/${routeName}`));
    if (!route) {
      console.error(`❌ Route non trouvée dans le plan de migration: ${routeName}`);
      process.exit(1);
    }
    
    await migrateRoute(route);
    return;
  }
  
  // Migration par défaut: migrer toutes les routes selon le plan
  console.log('🚀 Démarrage de la migration des API...');
  
  // Trier par priorité
  const sortedPlan = [...migrationPlan].sort((a, b) => (a.priorité || 99) - (b.priorité || 99));
  
  for (const route of sortedPlan) {
    await migrateRoute(route);
  }
  
  console.log('✅ Migration terminée!');
}

main().catch(error => {
  console.error('❌ Erreur lors de la migration:', error);
  process.exit(1);
});
