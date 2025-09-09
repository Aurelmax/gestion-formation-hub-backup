# 🧪 STRATÉGIE DE TESTS UNITAIRES - BIBLIOTHÈQUE DE PROGRAMMES DE FORMATION

**Date :** 2025-09-09  
**Système :** Gestion Formation Hub  
**Objectif :** Couverture de test ciblée sur les fonctionnalités critiques

## 🎯 **ZONES CRITIQUES IDENTIFIÉES**

### **1. Hook Unifié `useProgrammesFormation`** ⭐⭐⭐
**Criticité :** CRITIQUE  
**Raison :** Hub central de toutes les opérations CRUD  
**Fonctionnalités à tester :**
- ✅ Fetch programmes avec/sans filtres
- ✅ CRUD : Create, Update, Delete, Duplicate
- ✅ Gestion d'état (loading, error)
- ✅ Cache et rafraîchissement
- ✅ Filtrage par type, catégorie, statut

### **2. Types et Validations Centralisés** ⭐⭐⭐
**Criticité :** CRITIQUE  
**Raison :** Foundation de la cohérence des données  
**Fonctionnalités à tester :**
- ✅ Validation Zod des programmes
- ✅ Type guards (isTypeCatalogue, isTypePersonnalise)
- ✅ Transformations de données
- ✅ Gestion des erreurs de validation

### **3. Composants de Gestion Principaux** ⭐⭐
**Criticité :** HAUTE  
**Raison :** Interface utilisateur critique  
**Fonctionnalités à tester :**
- ✅ FormationsList (affichage, actions)
- ✅ ProgrammeFormEnhanced (création, édition)
- ✅ ProgrammesManager (orchestration)

### **4. API Routes** ⭐⭐
**Criticité :** HAUTE  
**Raison :** Points d'entrée backend  
**Fonctionnalités à tester :**
- ✅ GET /api/programmes-formation
- ✅ POST, PUT, DELETE /api/programmes-formation
- ✅ Gestion d'erreurs et validation

### **5. Adaptateurs et Utilitaires** ⭐
**Criticité :** MOYENNE  
**Raison :** Fonctions support  
**Fonctionnalités à tester :**
- ✅ CatalogueAdapter
- ✅ Helpers de transformation

## 📚 **STRATÉGIE DE FRAMEWORK DE TEST**

### **Stack Recommandée :**

```json
{
  "frameworks": {
    "runner": "Jest",
    "react": "@testing-library/react",
    "hooks": "@testing-library/react-hooks", 
    "user": "@testing-library/user-event",
    "msw": "Mock Service Worker"
  }
}
```

### **Architecture des Tests :**

```
__tests__/
├── hooks/
│   ├── useProgrammesFormation.test.ts
│   └── catalogueAdapter.test.ts
├── components/
│   ├── FormationsList.test.tsx
│   ├── ProgrammeFormEnhanced.test.tsx
│   └── ProgrammesManager.test.tsx
├── utils/
│   ├── types.test.ts
│   ├── validation.test.ts
│   └── typeGuards.test.ts
├── api/
│   └── programmes-formation.test.ts
└── __mocks__/
    ├── data/
    └── handlers/
```

## 🎯 **COUVERTURE CIBLÉE (80/20 Rule)**

### **80% Impact - 20% Effort :**
1. **Hook useProgrammesFormation** → 40% de couverture
2. **Validations Zod** → 20% de couverture  
3. **Composants critiques** → 15% de couverture
4. **API Routes principales** → 5% de couverture

### **Métriques Cibles :**
- **Couverture globale :** 70%+
- **Fonctions critiques :** 90%+
- **Branches principales :** 80%+
- **Lignes de code :** 60%+

## 🧪 **STRATÉGIE PAR FONCTIONNALITÉ**

### **1. CRÉATION DE PROGRAMMES**
```typescript
describe('Programme Creation', () => {
  test('should create catalogue programme')
  test('should create personnalise programme') 
  test('should validate required fields')
  test('should handle creation errors')
})
```

### **2. MODIFICATION DE PROGRAMMES**
```typescript
describe('Programme Update', () => {
  test('should update programme fields')
  test('should maintain type consistency')
  test('should handle concurrent updates')
  test('should validate changes')
})
```

### **3. DUPLICATION DE PROGRAMMES**
```typescript
describe('Programme Duplication', () => {
  test('should duplicate with new code')
  test('should preserve programme content')
  test('should handle duplication errors')
})
```

### **4. ACTIVATION/DÉSACTIVATION**
```typescript
describe('Programme Status', () => {
  test('should toggle active status')
  test('should update visibility')
  test('should persist status changes')
})
```

## 🛠️ **PATTERNS DE TEST RECOMMANDÉS**

### **1. Arrange-Act-Assert (AAA)**
```typescript
test('should fetch programmes successfully', async () => {
  // Arrange
  const mockProgrammes = createMockProgrammes();
  mockApi.get.mockResolvedValue({ data: { data: mockProgrammes } });
  
  // Act
  const { result } = renderHook(() => useProgrammesFormation());
  await waitFor(() => !result.current.loading);
  
  // Assert
  expect(result.current.programmes).toEqual(mockProgrammes);
  expect(result.current.error).toBeNull();
});
```

### **2. Test Data Builders**
```typescript
class ProgrammeBuilder {
  private programme: Partial<ProgrammeFormation> = {};
  
  withType(type: ProgrammeType) { 
    this.programme.type = type; 
    return this; 
  }
  
  withTitle(titre: string) { 
    this.programme.titre = titre; 
    return this; 
  }
  
  build(): ProgrammeFormation {
    return { ...defaultProgramme, ...this.programme };
  }
}
```

### **3. Custom Render Helpers**
```typescript
const renderWithProviders = (component: ReactElement) => {
  return render(
    <QueryClient>
      <ToastProvider>
        {component}
      </ToastProvider>
    </QueryClient>
  );
};
```

## 📊 **PRIORISATION DES TESTS**

### **Phase 1 - Tests Critiques (Semaine 1)**
1. ✅ Hook `useProgrammesFormation` - CRUD de base
2. ✅ Validation Zod des programmes  
3. ✅ Type guards et utilitaires
4. ✅ Composant FormationsList

### **Phase 2 - Tests Haute Priorité (Semaine 2)**  
1. ✅ ProgrammeFormEnhanced (création/édition)
2. ✅ API Routes principales
3. ✅ Gestion d'erreurs et états de chargement
4. ✅ CatalogueAdapter

### **Phase 3 - Tests Complémentaires (Semaine 3)**
1. ✅ ProgrammesManager (intégration)
2. ✅ Tests d'intégration composants
3. ✅ Edge cases et scénarios d'erreur
4. ✅ Performance et optimisation

## 🔧 **CONFIGURATION RECOMMANDÉE**

### **jest.config.js**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'app/**/*.{ts,tsx}',
    '!app/**/*.d.ts',
    '!app/api/**/*', // Exclure les API routes
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 70,
      statements: 70
    }
  }
};
```

### **Mock Strategy**
```typescript
// Mock API calls
jest.mock('@/services/api');
const mockApi = api as jest.Mocked<typeof api>;

// Mock Toast notifications  
jest.mock('@/hooks/use-toast');

// Mock Next.js router
jest.mock('next/navigation');
```

## 📈 **MÉTRIQUES ET MONITORING**

### **KPIs de Qualité :**
- **Taux de réussite des tests :** > 98%
- **Temps d'exécution :** < 30 secondes
- **Couverture des mutations :** > 75%
- **Détection des régressions :** < 24h

### **Reporting :**
- Dashboard de couverture (Istanbul)
- Intégration CI/CD avec seuils
- Notifications sur échecs de tests
- Métriques de performance des tests

---

**🎯 OBJECTIF : Assurer la stabilité et la fiabilité de la bibliothèque de programmes de formation avec une couverture de test ciblée et efficace.**