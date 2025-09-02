# Documentation du Hook `useProgrammesFormation`

## Introduction

Le hook `useProgrammesFormation` est une solution complète pour gérer les programmes de formation dans l'application. Il fournit une interface unifiée pour effectuer des opérations CRUD sur les programmes, gérer les catégories et appliquer des filtres.

## Installation et Import

```typescript
import { useProgrammesFormation } from '@/hooks/useProgrammesFormation';
```

## Utilisation de Base

```typescript
const {
  // États
  programmes,      // Liste des programmes chargés
  categories,      // Liste des catégories
  loading,         // État de chargement
  error,           // Dernière erreur survenue
  
  // Actions
  fetchProgrammes,      // Charger les programmes
  createProgramme,      // Créer un programme
  updateProgramme,      // Mettre à jour un programme
  deleteProgramme,      // Supprimer un programme
  duplicateProgramme,   // Dupliquer un programme
  updateProgrammeStatus,// Activer/désactiver un programme
  fetchCategories,      // Charger les catégories
  
  // Filtres
  filterByCategory,     // Filtrer par catégorie
  filterByType,         // Filtrer par type (catalogue/sur-mesure)
} = useProgrammesFormation();
```

## Exemples Complets

### Chargement Initial des Données

```typescript
import { useEffect } from 'react';

function ListeProgrammes() {
  const { 
    programmes, 
    categories, 
    loading, 
    error,
    fetchProgrammes,
    fetchCategories 
  } = useProgrammesFormation();

  useEffect(() => {
    fetchProgrammes();
    fetchCategories();
  }, []);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div>
      <h2>Programmes de Formation ({programmes.length})</h2>
      <ul>
        {programmes.map(programme => (
          <li key={programme.id}>
            {programme.titre} - {programme.categorie?.titre}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Création d'un Programme

```typescript
const { createProgramme } = useProgrammesFormation();

const handleSubmit = async (formData) => {
  try {
    const nouveauProgramme = await createProgramme({
      code: formData.code,
      type: 'catalogue',
      titre: formData.titre,
      description: formData.description,
      niveau: formData.niveau,
      duree: formData.duree,
      prix: formData.prix,
      categorieId: formData.categorieId,
      // ... autres champs requis
    });
    
    console.log('Programme créé:', nouveauProgramme);
  } catch (error) {
    console.error('Erreur lors de la création:', error);
  }
};
```

### Filtrage des Programmes

```typescript
const { 
  programmes, 
  filterByCategory, 
  filterByType 
} = useProgrammesFormation();

// Filtrer par catégorie
const programmesDev = filterByCategory('dev-category-id');

// Filtrer par type
const programmesCatalogue = filterByType('catalogue');

// Combiner les filtres
const resultatsFiltres = filterByType('catalogue')
  .filter(prog => prog.categorieId === 'dev-category-id');
```

## Référence des Méthodes

### `fetchProgrammes()`
Charge la liste des programmes depuis l'API.

**Retourne**: `Promise<void>`

---

### `createProgramme(programmeData)`
Crée un nouveau programme de formation.

**Paramètres**:
- `programmeData`: `Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>` - Données du programme à créer

**Retourne**: `Promise<ProgrammeFormation>` - Le programme créé avec son ID

---

### `updateProgramme(id, programmeData)`
Met à jour un programme existant.

**Paramètres**:
- `id`: `string` - ID du programme à mettre à jour
- `programmeData`: `Partial<ProgrammeFormation>` - Champs à mettre à jour

**Retourne**: `Promise<void>`

---

### `deleteProgramme(id)`
Supprime un programme.

**Paramètres**:
- `id`: `string` - ID du programme à supprimer

**Retourne**: `Promise<void>`

---

### `duplicateProgramme(id, modificationData)`
Duplique un programme existant avec des modifications optionnelles.

**Paramètres**:
- `id`: `string` - ID du programme à dupliquer
- `modificationData`: `Partial<ProgrammeFormation>` - Modifications à apporter à la copie

**Retourne**: `Promise<ProgrammeFormation>` - Le nouveau programme créé

---

### `updateProgrammeStatus(id, estActif)`
Active ou désactive un programme.

**Paramètres**:
- `id`: `string` - ID du programme
- `estActif`: `boolean` - Nouvel état d'activation

**Retourne**: `Promise<void>`

---

### `fetchCategories()`
Charge la liste des catégories depuis l'API.

**Retourne**: `Promise<void>`

---

### `filterByCategory(categorieId)`
Filtre les programmes par catégorie.

**Paramètres**:
- `categorieId`: `string | null` - ID de la catégorie (ou null pour tout afficher)

**Retourne**: `ProgrammeFormation[]` - Liste des programmes filtrés

---

### `filterByType(type)`
Filtre les programmes par type.

**Paramètres**:
- `type`: `'catalogue' | 'sur-mesure' | null` - Type de programme (ou null pour tout afficher)

**Retourne**: `ProgrammeFormation[]` - Liste des programmes filtrés

## Gestion des Erreurs

Le hook gère automatiquement les erreurs et affiche des notifications à l'utilisateur via le système de toasts. Les erreurs sont également disponibles dans la propriété `error`.

## Données Simulées

En cas d'erreur de chargement des données, le hook utilise des données simulées pour permettre le développement et les démonstrations. Un avertissement est affiché dans la console dans ce cas.

## Bonnes Pratiques

1. **Chargement Initial** : Toujours appeler `fetchProgrammes()` et `fetchCategories()` dans un `useEffect` au montage du composant.

2. **Gestion des États** : Vérifier l'état de `loading` avant d'afficher les données.

3. **Gestion des Erreurs** : Toujours gérer les erreurs potentielles avec un bloc `try/catch` lors des opérations asynchrones.

4. **Optimistic Updates** : Le hook met à jour automatiquement l'état local après les opérations de création/mise à jour/suppression.

5. **Filtrage** : Utiliser les fonctions de filtrage fournies pour manipuler les données sans modifier l'état global.

## Types

### `ProgrammeFormation`

```typescript
interface ProgrammeFormation {
  id: string;
  code: string;
  type: 'catalogue' | 'sur-mesure';
  titre: string;
  description: string;
  niveau: string;
  participants: string;
  duree: string;
  prix: string;
  objectifs: string[];
  prerequis: string;
  modalites: string;
  publicConcerne: string;
  contenuDetailleJours: string;
  modalitesAcces: string;
  modalitesTechniques: string;
  modalitesReglement: string;
  formateur: string;
  ressourcesDisposition: string;
  modalitesEvaluation: string;
  sanctionFormation: string;
  niveauCertification: string;
  delaiAcceptation: string;
  accessibiliteHandicap: string;
  cessationAbandon: string;
  beneficiaireId: string | null;
  objectifsSpecifiques: string | null;
  positionnementRequestId: string | null;
  programmeUrl: string | null;
  programme?: string;
  contenuDetailleHtml?: string;
  categorieId: string | null;
  categorie?: {
    id: string;
    code: string;
    titre: string;
    description: string;
  };
  estActif?: boolean;
  version?: string;
  typeProgramme?: string;
  createdAt: Date;
  updatedAt: Date;
}
```
