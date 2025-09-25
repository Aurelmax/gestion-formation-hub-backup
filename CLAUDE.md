# Guide de Conventions - Formation Hub

## 🎯 Convention de Nommage Hybride

Ce projet utilise une **convention hybride** pour optimiser la cohérence entre TypeScript/JavaScript et PostgreSQL :

### ✅ Règles Adoptées

#### 1. **Modèles Prisma** (schema.prisma)
- **Noms de modèles** : PascalCase (`ProgrammeFormation`, `CategorieProgramme`)
- **Propriétés** : camelCase (`dateCreation`, `estActif`, `publicConcerne`)
- **Mapping DB** : snake_case avec `@map()` pour les champs et tables

```prisma
model ProgrammeFormation {
  id                String   @id @default(uuid())
  estActif          Boolean  @default(true) @map("est_actif")
  dateCreation      DateTime @default(now()) @map("date_creation")
  publicConcerne    String   @map("public_concerne")

  @@map("programmes_formation")
}
```

#### 2. **APIs TypeScript**
- **Accès Prisma** : Casting temporaire `(prisma as any).modelName`
- **Champs dans requêtes** : camelCase pour cohérence avec les modèles
- **Relations** : Noms camelCase définis dans le schema

```typescript
// ✅ Pattern recommandé
const prismaAny = prisma as any;
const formations = await prismaAny.programmeFormation.findMany({
  where: {
    estActif: true,
    type: 'catalogue'
  },
  select: {
    id: true,
    titre: true,
    dateCreation: true,
    categorie: {
      select: { id: true, titre: true }
    }
  }
});
```

#### 3. **Base de Données**
- **Tables** : snake_case (`programmes_formation`, `categories_programme`)
- **Colonnes** : snake_case (`est_actif`, `date_creation`, `public_concerne`)

## 🔧 Solutions Techniques Adoptées

### Casting Prisma
```typescript
// Solution temporaire pour contourner les conflits de types
const prismaAny = prisma as any;
const result = await prismaAny.programmeFormation.findMany();
```

**Pourquoi cette approche ?**
- Permet d'utiliser les noms camelCase cohérents avec TypeScript
- Contourne les conflits entre types générés et modèles définis
- Maintient la fonctionnalité pendant la transition

### Régénération Prisma
```bash
# Après chaque modification du schema
npx prisma generate
```

## 📝 APIs Corrigées

### ✅ États des APIs

| API | Status | Modèle Prisma | Casting |
|-----|--------|---------------|---------|
| `/api/formations` | ✅ Fonctionnel | `programmeFormation` | `(prisma as any)` |
| `/api/programmes-formation` | ✅ Fonctionnel | `programmeFormation` | `(prisma as any)` |
| `/api/veille` | ✅ Fonctionnel | `veille` | `(prisma as any)` |
| `/api/categories` | ✅ Fonctionnel | `categorieProgramme` | Standard |

### Exemple d'API Corrigée

```typescript
// app/api/formations/route.ts
export async function GET(request: NextRequest) {
  try {
    const prismaAny = prisma as any;
    const formations = await prismaAny.programmeFormation.findMany({
      where: {
        estActif: true,
        type: 'catalogue'
      },
      select: {
        id: true,
        code: true,
        titre: true,
        description: true,
        dateCreation: true,
        categorie: {
          select: { id: true, titre: true }
        }
      },
      orderBy: { dateCreation: 'desc' }
    });

    return NextResponse.json(formations);
  } catch (error) {
    console.error('Erreur API:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
```

## 🚀 Plan d'Harmonisation Future

### Phase 1 : Stabilisation ✅
- [x] Toutes les APIs principales fonctionnelles avec casting
- [x] Migration programmes-formation complète (3 APIs)
- [x] Migration veille principale (2 APIs)
- [x] Documentation des conventions
- [x] Guide de référence créé
- [x] Test final : 9 formations, 9 programmes, 4 catégories, 3 veilles

### Phase 2 : Optimisation (À venir)
- [ ] Migration progressive vers types Prisma corrects
- [ ] Configuration ESLint/Prettier pour conventions
- [ ] Mise à jour de tous les hooks frontend
- [ ] Tests de non-régression

### Phase 3 : Finalisation (À venir)
- [ ] Suppression des castings temporaires
- [ ] Validation complète TypeScript
- [ ] Documentation technique mise à jour

## ⚠️ Points d'Attention

### Erreurs TypeScript Temporaires
Les erreurs suivantes sont attendues et peuvent être ignorées temporairement :
```
La propriété 'estActif' n'existe pas sur le type 'programmes_formationWhereInput'
```

**Solution** : Le casting `(prisma as any)` contourne ces erreurs en attendant la migration complète.

### Debugging
```typescript
// Pour déboguer les requêtes Prisma
console.log('📋 Données reçues:', JSON.stringify(data, null, 2));
console.log('🔍 Type des données:', typeof data);
```

## 📋 Checklist pour Nouvelles APIs

- [ ] Utiliser le casting `(prisma as any).modelName`
- [ ] Noms de champs en camelCase dans les requêtes
- [ ] Relations avec noms définis dans le schema
- [ ] Gestion d'erreur robuste avec try/catch
- [ ] Tests fonctionnels avec curl/Postman
- [ ] Documentation des endpoints

## 🔗 Ressources

- [Prisma Naming Conventions](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#naming-conventions)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [TypeScript Best Practices](https://typescript-eslint.io/rules/)

---

*Guide créé le 25/09/2025 - Dernière mise à jour : après correction complète des APIs*

**Statut actuel** : ✅ Toutes les APIs fonctionnelles avec solution de casting robuste