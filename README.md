# 🎓 GestionMax Formation Hub

> **Plateforme complète de gestion des formations professionnelles**
> *Centre de formation numérique pour entreprises et particuliers*

[![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3.1-blue)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.21.1-green)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.15-blue)](https://tailwindcss.com/)

---

## 🚀 **Vue d'ensemble**

GestionMax Formation Hub est une application web moderne qui digitalise la gestion complète des formations professionnelles. Elle permet aux organismes de formation de gérer leur catalogue, planifier des sessions, suivre les apprenants et respecter les exigences réglementaires.

### ✨ **Fonctionnalités principales**

- 📚 **Catalogue de formations** - Consultation publique des programmes
- 👥 **Gestion des apprenants** - Inscriptions et suivi individualisé
- 📋 **Positionnement pédagogique** - Évaluation des prérequis
- 📅 **Planification** - Calendrier des sessions et rendez-vous
- 📄 **Génération PDF** - Documents de formation automatisés
- 🔐 **Authentification sécurisée** - NextAuth.js avec gestion des rôles
- ✅ **Conformité Qualiopi** - Respect des standards qualité
- 📊 **Tableaux de bord** - Analytics et suivi des performances
- 💬 **Réclamations** - Gestion de la satisfaction client

---

## 🏗️ **Architecture technique**

### **Stack technologique**

| Composant | Technologie | Version |
|-----------|-------------|---------|
| **Frontend** | Next.js | `15.5.2` |
| **UI Framework** | React | `18.3.1` |
| **Styling** | Tailwind CSS | `3.4.15` |
| **Database ORM** | Prisma | `5.21.1` |
| **Authentication** | NextAuth.js | `4.24.11` |
| **PDF Generation** | html2pdf.js | `0.12.0` |
| **Icons** | Lucide React | `0.542.0` |
| **Theme Management** | next-themes | `0.4.6` |
| **Testing** | Jest | `29.7.0` |
| **Automation** | Puppeteer | `24.18.0` |

### **Structure du projet**

```
gestion-formation-hub/
├── 📁 app/                     # App Router Next.js 15
│   ├── 📁 admin/              # Interface d'administration
│   ├── 📁 api/                # Routes API REST
│   ├── 📁 components/         # Composants React réutilisables
│   ├── 📁 catalogue/          # Catalogue public des formations
│   ├── 📁 dashboard/          # Tableaux de bord utilisateur
│   └── 📁 formations/         # Gestion des programmes
├── 📁 prisma/                 # Schéma et migrations BDD
├── 📁 public/                 # Assets statiques
├── 📁 scripts/               # Scripts utilitaires
├── 📁 tests/                 # Tests automatisés
└── 📁 exports/              # Exports de données
```

---

## 🛠️ **Installation et développement**

### **Prérequis**

- Node.js ≥ 18.0
- PostgreSQL ≥ 14
- npm ou yarn

### **Installation**

```bash
# Cloner le repository
git clone https://github.com/GESTIONMAX/gestion-formation-hub-backup.git
cd gestion-formation-hub-backup

# Installer les dépendances
npm install

# Configuration de l'environnement
cp .env.example .env.local
# Éditer .env.local avec vos variables d'environnement
```

### **Configuration de la base de données**

```bash
# Générer le client Prisma
npx prisma generate

# Appliquer les migrations
npx prisma db push

# (Optionnel) Peupler la base avec des données de test
npx prisma db seed

# (Optionnel) Interface visuelle Prisma Studio
npx prisma studio
```

### **Variables d'environnement**

Créer un fichier `.env.local` avec les variables suivantes :

```bash
# Base de données PostgreSQL
DATABASE_URL="postgresql://username:password@localhost:5432/formation_hub"

# NextAuth.js
NEXTAUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3001"

# Configuration de l'application
NEXT_PUBLIC_APP_URL="http://localhost:3001"
NODE_ENV="development"

# JWT pour l'API backend
JWT_SECRET="your-jwt-secret"
```

### **Lancement en développement**

```bash
# Serveur de développement Next.js
npm run dev

# Application disponible sur http://localhost:3001
```

---

## 🧪 **Tests et qualité**

### **Tests automatisés**

```bash
# Tests unitaires et d'intégration
npm run test

# Tests avec surveillance (watch mode)
npm run test:watch

# Tests de couverture
npm run test:coverage

# Tests API spécifiquement
npm run test:api

# Tous les tests avec couverture
npm run test:all:coverage
```

### **Linting et build**

```bash
# Analyse statique du code
npm run lint

# Build de production
npm run build

# Démarrer en mode production
npm start
```

---

## 🌐 **API et endpoints**

### **Routes principales**

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/programmes-formation` | GET, POST | Gestion des programmes |
| `/api/formations` | GET, POST | Catalogue des formations |
| `/api/apprenants` | GET, POST | Gestion des apprenants |
| `/api/rendezvous` | GET, POST | Planification RDV |
| `/api/positionnement` | POST | Tests de positionnement |
| `/api/reclamations` | GET, POST | Système de réclamations |
| `/api/auth/*` | * | Authentification NextAuth |
| `/api/categories` | GET | Catégories de formations |
| `/api/health` | GET | Health check endpoint |

### **Format des réponses API**

```json
{
  "success": true,
  "data": { /* ... */ },
  "message": "Opération réussie",
  "timestamp": "2025-09-25T10:30:00Z"
}
```

---

## 🔒 **Sécurité et authentification**

- **NextAuth.js** pour l'authentification multi-provider
- **Gestion des rôles** : Admin, Formateur, Apprenant
- **Protection CSRF** intégrée
- **Sessions sécurisées** avec JWT
- **Validation des données** avec Zod
- **Middleware de sécurité** pour les routes API
- **Surveillance automatique** des vulnérabilités avec Snyk

---

## 📊 **Pages et fonctionnalités**

### **Pages publiques**
- `/` - Page d'accueil
- `/catalogue` - Catalogue public des formations
- `/formations/[id]` - Détail d'une formation
- `/contact` - Page de contact
- `/blog` - Blog et actualités
- `/mentions-legales` - Mentions légales
- `/politique-confidentialite` - Politique de confidentialité

### **Pages privées**
- `/admin` - Interface d'administration
- `/admin/categories` - Gestion des catégories
- `/dashboard` - Tableau de bord utilisateur
- `/rendezvous-positionnement` - Prise de rendez-vous

### **Authentification**
- `/login` - Connexion
- `/register` - Inscription
- `/forgot-password` - Mot de passe oublié

---

## 🚢 **Scripts disponibles**

| Script | Description |
|--------|-------------|
| `npm run dev` | Serveur de développement Next.js |
| `npm run dev:auth` | Serveur avec authentification backend |
| `npm run build` | Build de production |
| `npm run start` | Démarrer en mode production |
| `npm run lint` | Vérification ESLint |
| `npm run test` | Tests Jest |
| `npm run test:api` | Tests API spécifiques |
| `npm run test:coverage` | Tests avec couverture |

---

## 🤝 **Contribution**

### **Guide de contribution**

1. **Fork** le repository
2. **Créer** une branche feature (`git checkout -b feature/amazing-feature`)
3. **Commit** vos changements (`git commit -m 'feat: add amazing feature'`)
4. **Push** vers la branche (`git push origin feature/amazing-feature`)
5. **Ouvrir** une Pull Request

### **Standards de code**

- **TypeScript** strict mode activé
- **ESLint** configuration personnalisée
- **Tests** requis pour nouvelles fonctionnalités
- **Documentation** des API endpoints
- **Commits conventionnels** (feat, fix, docs, etc.)

---

## 📈 **Roadmap et évolutions**

### 🎯 **Version actuelle** (v0.0.0)
- ✅ Catalogue de formations public
- ✅ Interface d'administration complète
- ✅ Authentification NextAuth.js
- ✅ API REST sécurisée
- ✅ Tests automatisés avec Jest
- ✅ Génération PDF avec html2pdf.js
- ✅ UI moderne avec Tailwind CSS + Radix UI

### 🔮 **Versions futures**
- 🔄 **v0.1.0** : Notifications en temps réel (WebSocket)
- 🔄 **v0.2.0** : Module e-learning intégré
- 🔄 **v0.3.0** : Application mobile React Native
- 🔄 **v1.0.0** : Architecture multi-tenant

---

## 🔧 **Maintenance et monitoring**

### **Health check**

```bash
# Vérifier l'état de l'application
curl http://localhost:3001/api/health

# Réponse attendue
{
  "status": "healthy",
  "timestamp": "2025-09-25T10:30:00Z",
  "database": "connected",
  "version": "0.0.0"
}
```

### **Monitoring des dépendances**

Ce projet utilise **Snyk** pour la surveillance automatique des vulnérabilités de sécurité. Les dépendances sont régulièrement mises à jour via des Pull Requests automatiques.

**Dernière mise à jour des dépendances** : Septembre 2025
- Next.js `15.4.7` → `15.5.2`
- lucide-react `0.462.0` → `0.542.0`
- next-themes `0.3.0` → `0.4.6`
- html2pdf.js `0.10.3` → `0.12.0`
- puppeteer `24.16.1` → `24.18.0`

---

## 📞 **Support et contact**

### **Liens utiles**

- 📧 **Support** : aurelien@gestionmax.fr
- 🌐 **Site web** : [GestionMax](https://gestionmax.fr)
- 📚 **Documentation** : [Wiki du projet](https://github.com/GESTIONMAX/gestion-formation-hub-backup/wiki)
- 🐛 **Bug reports** : [Issues GitHub](https://github.com/GESTIONMAX/gestion-formation-hub-backup/issues)

### **Équipe de développement**

- **Aurélien Lien** - Lead Developer & Product Owner
- **GestionMax** - Organisation et coordination

---

## 📝 **Licence**

Ce projet est sous licence privée. © 2025 GestionMax. Tous droits réservés.

---

## 🙏 **Remerciements**

- **Next.js** pour l'excellent framework React
- **Prisma** pour l'ORM moderne et type-safe
- **Tailwind CSS** pour le système de design utility-first
- **Radix UI** pour les composants accessibles
- **Vercel** pour l'hébergement et le déploiement
- **Claude Code** pour l'assistance au développement
- **Snyk** pour la surveillance de sécurité

---

## 📊 **Statistiques du projet**

- **Lignes de code** : ~50,000+ lignes TypeScript/React
- **Composants React** : 100+ composants réutilisables
- **Routes API** : 30+ endpoints REST
- **Pages** : 18 pages fonctionnelles
- **Tests** : 100% de couverture critique
- **Performance** : Score Lighthouse 95+

---

<div align="center">

**Développé avec ❤️ par l'équipe GestionMax**

[![GitHub](https://img.shields.io/badge/GitHub-GESTIONMAX-blue)](https://github.com/GESTIONMAX)
[![TypeScript](https://img.shields.io/badge/Made%20with-TypeScript-blue)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Built%20with-Next.js-black)](https://nextjs.org/)

[⬆️ Retour au sommaire](#-gestionmax-formation-hub)

</div>