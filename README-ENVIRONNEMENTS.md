# 🗄️ Configuration Multi-Environnements

## 📁 Structure

```
├── .env.production     # Prisma Cloud (Production)
├── .env.development    # PostgreSQL Local (Développement)  
├── .env.test          # SQLite (Tests)
├── prisma/schema.prisma  # Schéma unique partagé
└── scripts/
    ├── backup-database.ts
    ├── sync-databases.ts
    └── restore-database.ts
```

## 🚀 Commandes Principales

### Développement Local
```bash
# Démarrer en mode développement (PostgreSQL local)
npm run dev:local

# Démarrer en mode production (Prisma Cloud)
npm run dev:prod

# Préparer l'environnement de test
npm run dev:test
```

### Gestion des Bases de Données

#### Migrations
```bash
# Appliquer migrations en développement
npm run db:migrate:dev

# Appliquer migrations en production
npm run db:migrate:prod

# Appliquer migrations pour tests
npm run db:migrate:test
```

#### Prisma Studio
```bash
# Ouvrir studio pour dev (PostgreSQL)
npm run db:studio:dev

# Ouvrir studio pour prod (Prisma Cloud)
npm run db:studio:prod

# Ouvrir studio pour test (SQLite)
npm run db:studio:test
```

### Synchronisation & Backup

#### Synchronisation entre environnements
```bash
# Sync Production → Développement
npm run db:sync production development

# Sync Développement → Test  
npm run db:sync development test

# Sync Production → Test
npm run db:sync production test
```

#### Backup
```bash
# Backup production
npm run db:backup production

# Backup développement
npm run db:backup development

# Backup test
npm run db:backup test
```

## 🔧 Configuration des Environnements

### 🌐 Production (.env.production)
- **Base**: Prisma Cloud
- **Performance**: Optimisée avec Accelerate
- **Usage**: Production, déploiement Vercel

### 💻 Développement (.env.development)  
- **Base**: PostgreSQL local
- **Port**: 5432
- **Usage**: Développement local, tests d'intégration

### 🧪 Test (.env.test)
- **Base**: SQLite (fichier local)
- **Usage**: Tests unitaires, CI/CD
- **Avantage**: Léger, rapide, isolé

## ⚠️ Sécurité

- ✅ Secrets différents par environnement
- ✅ URLs adaptées (localhost vs production)
- ✅ Fichiers .env dans .gitignore
- ✅ Sauvegarde automatique des données

## 🔄 Workflow Recommandé

1. **Développement**: Travail sur PostgreSQL local
2. **Sync régulière**: Production → Développement  
3. **Tests**: SQLite pour l'intégration continue
4. **Backup quotidien**: Production → Fichiers locaux

## 🚨 Récupération d'Urgence

En cas de problème sur la production :

```bash
# 1. Backup immédiat
npm run db:backup production

# 2. Restaurer depuis le développement
npm run db:sync development production
```

## 📊 Monitoring

Chaque commande affiche :
- ✅ Nombre d'enregistrements par table
- ⏱️ Temps d'exécution
- 🔍 Erreurs détaillées
- 📁 Fichiers de backup générés

---
*Configuration générée le ${new Date().toLocaleDateString('fr-FR')}*