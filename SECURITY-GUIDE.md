# 🔒 Guide de Sécurité - Formation Hub

## 🎯 **Vue d'ensemble**

Ce guide présente les mesures de sécurité complètes implémentées dans l'application Formation Hub pour protéger contre les attaques courantes et assurer la sécurité des données utilisateurs.

## 🛡️ **Fonctionnalités de Sécurité Implémentées**

### **1. Rate Limiting Intelligent**
Protection contre le spam et les attaques par déni de service.

#### **Configuration par type d'API :**
```typescript
// APIs publiques (lecture)
rateLimitConfigs.public: 100 requêtes / 15 min

// APIs authentifiées
rateLimitConfigs.authenticated: 300 requêtes / 15 min

// APIs sensibles (création/modification)
rateLimitConfigs.sensitive: 20 requêtes / 15 min

// Formulaires de contact
rateLimitConfigs.forms: 5 soumissions / heure

// APIs de lecture
rateLimitConfigs.read: 200 requêtes / 5 min
```

#### **Utilisation :**
```typescript
import { withRateLimit, rateLimitConfigs } from '@/lib/rate-limit';

export const POST = withRateLimit(myHandler, rateLimitConfigs.forms);
```

### **2. Protection CSRF (Cross-Site Request Forgery)**
Protection contre les attaques CSRF avec validation de tokens.

#### **Côté Serveur :**
```typescript
import { withCSRFProtection } from '@/lib/csrf';

export const POST = withCSRFProtection(myHandler);
```

#### **Côté Client :**
```typescript
import { useSecureForm } from '@/hooks/useSecureApi';

const { submitForm } = useSecureForm('/api/contact');
```

#### **Composant Formulaire :**
```jsx
import SecureForm from '@/components/ui/SecureForm';

<SecureForm
  endpoint="/api/contact"
  rateLimitInfo={{ maxAttempts: 5, windowMinutes: 60 }}
  onSuccess={handleSuccess}
>
  {/* Vos champs de formulaire */}
</SecureForm>
```

### **3. Validation et Sanitisation**
Protection contre l'injection SQL et XSS avec validation Zod renforcée.

#### **Wrapper de Sécurité :**
```typescript
import { withSecurity } from '@/lib/security';
import { z } from 'zod';

const schema = z.object({
  nom: z.string().min(1).max(100),
  email: z.string().email().max(255),
  message: z.string().min(1).max(2000)
});

const secureHandler = withSecurity(myHandler, schema);
export const POST = secureHandler;
```

#### **Détection de Contenu Malveillant :**
- Patterns SQL injection : `UNION SELECT`, `DROP TABLE`, etc.
- Patterns XSS : `<script>`, `javascript:`, `onerror=`, etc.
- Validation automatique des longueurs de champs
- Sanitisation des logs pour éviter l'exposition de données sensibles

### **4. Logging Sécurisé**
Système de logs qui masque automatiquement les données sensibles.

#### **Utilisation :**
```typescript
import { secureLogger } from '@/lib/security';

secureLogger.info('User action', {
  userId: user.id,
  action: 'create_reclamation',
  // Les emails, téléphones, mots de passe sont automatiquement masqués
  data: requestData
});
```

#### **Données Masquées Automatiquement :**
- Emails → `[REDACTED]`
- Téléphones → `[REDACTED]`
- Mots de passe, tokens, clés → `[REDACTED]`
- Numéros de carte bancaire → `[REDACTED]`

### **5. Middleware de Sécurité Global**
Protection automatique appliquée à toutes les routes.

#### **Headers de Sécurité :**
```typescript
'X-Content-Type-Options': 'nosniff'
'X-Frame-Options': 'DENY'
'X-XSS-Protection': '1; mode=block'
'Content-Security-Policy': "default-src 'self'..."
'Referrer-Policy': 'strict-origin-when-cross-origin'
'Strict-Transport-Security': 'max-age=31536000'
```

#### **Protection des Fichiers Sensibles :**
- `.env`, `package.json`, `schema.prisma` → Accès refusé
- Détection des user-agents suspects
- Logs de sécurité pour les accès API

## 🚀 **Migration et Utilisation**

### **APIs Existantes → APIs Sécurisées**

#### **Avant :**
```typescript
export async function POST(request: NextRequest) {
  const data = await request.json();
  // Validation basique...
  return Response.json(result);
}
```

#### **Après :**
```typescript
import { withRateLimit, withCSRFProtection, withSecurity } from '@/lib/...';

const schema = z.object({ /* validation */ });

const handler = withRateLimit(
  withCSRFProtection(
    withSecurity(myHandler, schema)
  ),
  rateLimitConfigs.forms
);

export const POST = handler;
```

### **Composants Formulaire**

#### **Remplacement des Formulaires Standard :**
```jsx
// Avant
<form onSubmit={handleSubmit}>
  <input name="email" type="email" />
  <button type="submit">Envoyer</button>
</form>

// Après
<SecureForm
  endpoint="/api/contact"
  rateLimitInfo={{ maxAttempts: 5, windowMinutes: 60 }}
  onSuccess={handleSuccess}
  onError={handleError}
>
  <input name="email" type="email" required />
</SecureForm>
```

### **Hooks Sécurisés**

#### **API Calls avec Protection :**
```typescript
// Hook générique
const { data, loading, error, post } = useSecureApi('/api/reclamations');

// Hook spécialisé
const { submitForm, isSubmitting } = useSecureForm('/api/contact');

// Utilisation
const handleSubmit = async (formData) => {
  const success = await submitForm(formData);
  if (success) {
    // Succès géré automatiquement
  }
};
```

## 🎯 **Recommandations d'Implémentation**

### **1. Routes API Critiques**
Appliquer **TOUTES** les protections :
- `/api/auth/*` → Rate limiting strict + CSRF
- `/api/reclamations` → Rate limiting + CSRF + Validation
- `/api/contact` → Rate limiting très strict (anti-spam)
- `/api/programmes-formation` → Rate limiting + CSRF pour POST/PUT/DELETE

### **2. Formulaires Publics**
Utiliser `SecureForm` avec rate limiting strict :
```jsx
<SecureForm
  endpoint="/api/contact"
  rateLimitInfo={{ maxAttempts: 3, windowMinutes: 60 }}
  submitButtonText="Envoyer ma demande"
  loadingText="Envoi sécurisé en cours..."
>
```

### **3. Monitoring de Sécurité**
```typescript
// Logs automatiques des violations
secureLogger.warn('Security violation detected', {
  type: 'rate_limit_exceeded',
  ip: request.ip,
  endpoint: '/api/contact',
  timestamp: new Date()
});
```

## ⚡ **Performance et Optimisations**

### **Cache Rate Limiting**
- Store en mémoire avec nettoyage automatique
- Clés optimisées (IP + Hash User-Agent)
- Nettoyage périodique toutes les 5 minutes

### **Validation Efficace**
- Zod pour validation rapide côté serveur
- Validation côté client pour UX
- Sanitisation automatique sans impact performance

### **Singleton Prisma**
- Une seule instance de connexion DB
- Connection pooling optimisé
- Logs configurés par environnement

## 🔧 **Configuration Environnement**

### **Variables d'Environnement**
```env
# Sécurité
CSRF_SECRET=your-secret-key
RATE_LIMIT_REDIS_URL=redis://localhost:6379  # Optionnel

# Logs
LOG_LEVEL=info  # dev: debug, prod: warn
SECURITY_LOGS_ENABLED=true
```

### **Configuration CSP (Content Security Policy)**
Ajuster selon vos besoins dans `/lib/security.ts` :
```typescript
'Content-Security-Policy': `
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://trusted-cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
`
```

## 🚨 **Gestion des Incidents**

### **Détection Automatique**
- Rate limit dépassé → Log + Blocage temporaire
- CSRF invalid → Log + Refus 403
- Contenu malveillant → Log + Refus 400
- User-agent suspect → Log + Refus 403 (prod)

### **Response aux Incidents**
1. **Logs centralisés** → Analyser les patterns
2. **Blocage IP** → Ajouter à la blacklist si nécessaire
3. **Ajustement des limites** → Selon les patterns légitimes
4. **Notification** → Admin en cas d'attaque coordonnée

## ✅ **Checklist de Sécurité**

### **Pour Chaque Nouvelle API :**
- [ ] Rate limiting approprié appliqué
- [ ] Validation Zod avec limites de longueur
- [ ] Protection CSRF pour POST/PUT/DELETE
- [ ] Logs sécurisés (pas de données sensibles)
- [ ] Headers de sécurité
- [ ] Gestion d'erreurs sécurisée

### **Pour Chaque Nouveau Formulaire :**
- [ ] Utilisation de `SecureForm`
- [ ] Rate limiting configuré
- [ ] Validation côté client ET serveur
- [ ] Messages d'erreur non-révélateurs
- [ ] Protection contre l'énumération

### **Tests de Sécurité :**
- [ ] Test d'injection SQL → Refusé
- [ ] Test XSS → Contenu sanitisé
- [ ] Test rate limiting → Blocage après limite
- [ ] Test CSRF → Refusé sans token
- [ ] Test avec user-agent suspect → Bloqué

---

## 🎉 **Résultat Final**

### **Sécurité Renforcée :**
- **🛡️ Protection multi-couches** contre les attaques courantes
- **⚡ Performance optimisée** malgré les contrôles de sécurité
- **📊 Monitoring complet** avec logs sécurisés
- **🔒 Conformité** aux meilleures pratiques de sécurité web

### **Facilité d'Utilisation :**
- **🎯 Composants pré-configurés** pour une adoption simple
- **🔧 Hooks React optimisés** pour les appels API sécurisés
- **📖 Documentation complète** pour les développeurs
- **🚀 Migration progressive** possible sur l'existant

L'application est maintenant **production-ready** avec une sécurité de niveau entreprise ! 🎯