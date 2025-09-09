# 🚀 Résolution problème Vercel - Dashboard ne charge pas les données

## 🔍 Diagnostic

**Symptôme** : Error 404 "Request failed with status code 404" sur l'API programmes-formation

**URL de debug** : https://gestion-formation-hub-backup-git-feat-04596d-aurelmaxs-projects.vercel.app/api/debug

## ✅ Solutions (dans l'ordre de priorité)

### 1. **Variables d'environnement Vercel** (CRITIQUE)

Dans l'interface Vercel → Settings → Environment Variables, ajouter :

```bash
# Base de données
DATABASE_URL=prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RfaWQiOjEsInNlY3VyZV9rZXkiOiJza19vaTJUWHB0SHFtaTRsY3VYS3Y2a0ciLCJhcGlfa2V5IjoiMDFLNEQwRTFGUUFCOUQxSkNOOTY3QktQWFEiLCJ0ZW5hbnRfaWQiOiI3NTUyM2I1NjU2MWMwNzNlODRmNmY4ZDg0ZmMwODhlYzY5MGYwMjBjMjdmMGFkNTBlZTNhZWI4OGQwOTEzMDQ2IiwiaW50ZXJuYWxfc2VjcmV0IjoiNTQ0OWE5ZWEtNGNhOC00ODdhLWI1NGMtZDFkYWU5NjI5YmVjIn0.AKhhRt_4ow6gezVjZIlc5lLGNntKrc21B7ku0QR28PM

DIRECT_URL=postgres://75523b56561c073e84f6f8d84fc088ec690f020c27f0ad50ee3aeb88d0913046:sk_oi2TXptHqmi4lcuXKv6kG@db.prisma.io:5432/postgres?sslmode=require

# Auth
NEXTAUTH_SECRET=IaQdE9fU8hP7mC2vX6yT3zJ5nB4rW1oL
JWT_SECRET=IaQdE9fU8hP7mC2vX6yT3zJ5nB4rW1oL

# Prisma
PRISMA_GENERATE_DATAPROXY=true

# Node
NODE_ENV=production
```

### 2. **Forcer un redéploiement**

```bash
# Pousser un commit vide pour déclencher un redéploiement
git commit --allow-empty -m "chore: Force Vercel redeploy with env vars"
git push origin feature/optimisation-complete-3-semaines
```

### 3. **Vider le cache Vercel**

Dans l'interface Vercel → Functions → Clear All Cache

### 4. **Vérification**

Après redéploiement, tester :
- https://votre-url.vercel.app/api/debug ✅
- https://votre-url.vercel.app/api/programmes-formation ✅
- https://votre-url.vercel.app/dashboard ✅

## 🛠️ Fichiers critiques déjà configurés

- ✅ `vercel.json` - Configuration Vercel
- ✅ `package.json` - Build script avec `prisma generate --no-engine`
- ✅ `lib/prisma.ts` - Instance Prisma optimisée
- ✅ `.env.production` - Variables production
- ✅ Routes API complètes dans `/app/api/`

## 📞 Support

Si le problème persiste après ces étapes, l'URL `/api/debug` donnera des informations précieuses sur la configuration actuelle de Vercel.