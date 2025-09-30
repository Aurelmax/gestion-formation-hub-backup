# Instructions pour les Agents AI - GestionMax Formation Hub 🎓

## Architecture Globale 🏗️

### Stack Technique
- Frontend: Next.js 15.5 avec App Router
- Base de données: PostgreSQL avec Prisma ORM
- Authentification: NextAuth.js
- UI: React 18 + Tailwind CSS
- Tests: Jest + Supertest

### Structure Clé
```
app/
├── api/           # Routes API REST (Next.js API Routes)
├── components/    # Composants React partagés
└── [feature]/     # Pages et composants par fonctionnalité
```

## Workflows Principaux 🔄

### Développement Local
```bash
# Installation avec base de données
cp .env.example .env.local
npm install
npx prisma generate
npx prisma db push

# Démarrer en développement
npm run dev  # http://localhost:3001
```

### Tests
```bash
npm run test:api        # Tests API uniquement
npm run test:coverage   # Tests avec couverture
npm test               # Tests unitaires
```

## Patterns & Conventions 📋

### API Routes
- Utiliser le modèle RESTful dans `/app/api/[resource]/route.ts`
- Gérer les erreurs avec le format standard :
```typescript
return NextResponse.json({ error: message }, { status: code })
```

### Base de Données
- Toujours utiliser les transactions Prisma pour les opérations multiples
- Schéma dans `/prisma/schema.prisma`
- Les IDs sont des UUIDs

### Authentification
- Middlewares d'auth dans `/middleware.ts`
- Rôles utilisateurs : admin, formateur, apprenant
- Utiliser `auth()` de NextAuth.js pour la vérification des sessions

### Génération de Documents
- PDF : Utiliser html2pdf.js via `/api/programmes-personnalises/[id]/generer-document`
- Templates dans `/app/components/documents/`

## Points d'Intégration 🔌

### Points d'entrée API principaux
- `/api/programmes-formation` - CRUD programmes
- `/api/rendezvous` - Gestion des RDV
- `/api/categories-programme` - Hiérarchie du catalogue
- `/api/auth/*` - Endpoints d'authentification

### Dépendances Externes
- Service de mailing : configuration dans `.env`
- Stockage fichiers : local dans `/public/documents/`
- API de paiement : non implémentée

## Astuces et Gotchas 💡

- Utiliser `semantic_search` pour explorer le code lié à une fonctionnalité
- Tests API dans `/tests.disabled/` - à activer selon besoin
- Configuration spécifique des tests dans `jest.env.setup.js`
- Les fichiers de logs sont dans `.gitignore`