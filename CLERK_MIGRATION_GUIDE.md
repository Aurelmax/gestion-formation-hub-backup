# Guide de Migration vers Clerk Auth

## 🚀 Étapes de Migration

### 1. Configuration Clerk

1. **Créer un compte Clerk** sur [clerk.com](https://clerk.com)
2. **Créer une nouvelle application** dans le dashboard Clerk
3. **Récupérer les clés** :
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `CLERK_WEBHOOK_SECRET`

### 2. Configuration des Variables d'Environnement

Ajoutez ces variables à votre fichier `.env` :

```env
# Clerk Configuration
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# URLs de redirection (optionnel)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/auth/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/auth/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### 3. Migration de la Base de Données

```bash
# Générer la migration Prisma
npx prisma migrate dev --name add_clerk_id

# Exécuter la migration
npx prisma generate
```

### 4. Configuration des Webhooks Clerk

1. **Dans le dashboard Clerk**, allez dans "Webhooks"
2. **Ajoutez un nouveau webhook** avec l'URL : `https://votre-domaine.com/api/webhooks/clerk`
3. **Sélectionnez les événements** :
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. **Copiez le secret** et ajoutez-le à `CLERK_WEBHOOK_SECRET`

### 5. Migration des Utilisateurs Existants

```bash
# Exécuter le script de migration
npx tsx scripts/migrate-to-clerk.ts
```

### 6. Mise à Jour des Composants

Remplacez les imports d'authentification :

```typescript
// Ancien
import { useAuth } from '@/hooks/useAuth';

// Nouveau
import { useClerkAuth } from '@/hooks/useClerkAuth';
```

### 7. Test de l'Intégration

1. **Démarrer l'application** : `npm run dev`
2. **Tester la connexion** : `/auth/sign-in`
3. **Tester l'inscription** : `/auth/sign-up`
4. **Vérifier la synchronisation** des utilisateurs dans la base de données

## 🔧 Fonctionnalités de Sécurité Clerk

### Authentification Multi-Facteurs (MFA)
- **SMS** : Envoi de codes par SMS
- **Email** : Codes de vérification par email
- **Authentificateur** : TOTP (Google Authenticator, etc.)
- **Clés de sécurité** : WebAuthn/FIDO2

### Gestion des Sessions
- **Sessions sécurisées** avec rotation automatique
- **Déconnexion automatique** après inactivité
- **Gestion multi-appareils**

### Protection Avancée
- **Détection d'anomalies** : Connexions suspectes
- **Rate limiting** : Protection contre les attaques par force brute
- **Géolocalisation** : Alertes de connexions depuis de nouveaux endroits

## 📋 Checklist de Migration

- [ ] Compte Clerk créé
- [ ] Variables d'environnement configurées
- [ ] Migration Prisma exécutée
- [ ] Webhooks configurés
- [ ] Utilisateurs existants migrés
- [ ] Composants mis à jour
- [ ] Tests de connexion/inscription
- [ ] Synchronisation des données vérifiée
- [ ] Ancien système NextAuth désactivé

## 🚨 Points d'Attention

1. **Sauvegarde** : Faites une sauvegarde complète avant la migration
2. **Tests** : Testez en environnement de développement d'abord
3. **Rollback** : Préparez un plan de retour en arrière
4. **Utilisateurs** : Informez les utilisateurs du changement
5. **Données** : Vérifiez que toutes les données utilisateur sont préservées

## 🔄 Rollback (si nécessaire)

Si vous devez revenir à NextAuth :

1. **Restaurer** les fichiers d'authentification originaux
2. **Supprimer** les fichiers Clerk
3. **Rétablir** les variables d'environnement NextAuth
4. **Régénérer** la base de données si nécessaire

## 📞 Support

- **Documentation Clerk** : [docs.clerk.com](https://docs.clerk.com)
- **Support Clerk** : Via le dashboard Clerk
- **Communauté** : [Discord Clerk](https://discord.gg/clerk)
