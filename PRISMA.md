# Configuration Prisma

## Scripts de développement

- `npm run db:generate` - Génère le client Prisma pour le développement
- `npm run db:push` - Synchronise le schéma avec la base de données
- `npm run db:migrate` - Crée et applique les migrations
- `npm run db:studio` - Lance Prisma Studio pour la gestion de données

## Scripts de production

- `npm run db:generate:prod` - Génère le client Prisma optimisé pour la production (sans engine)
- `npm run build:prod` - Build de production avec client Prisma optimisé

## Configuration

Le générateur Prisma est configuré avec `engineType = "library"` pour optimiser les performances en production.

En production, l'option `--no-engine` réduit la taille du bundle et améliore les temps de démarrage.