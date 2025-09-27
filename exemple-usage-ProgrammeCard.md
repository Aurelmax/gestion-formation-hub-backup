# 🎯 Guide d'utilisation - ProgrammeCard Universel

## 📋 Structure créée

```
app/components/programmes/
├── types.ts                    # ✅ Types unifiés (Catalogue + Sur-mesure)
├── ProgrammeCard.tsx          # ✅ Composant universel
├── ProgrammesPersonnalises.tsx # ✅ Adapté avec ProgrammeCard
└── index.ts                   # ✅ Exports centralisés
```

## 🚀 Exemples d'usage

### 1. Import des composants

```typescript
// Import simple
import { ProgrammeCard } from '@/components/programmes';

// Import avec types
import { ProgrammeCard, Programme, ProgrammeCatalogue, ProgrammePersonnalise } from '@/components/programmes';

// Import depuis index.ts
import { ProgrammeCard, ProgrammesPersonnalises } from '@/components/programmes';
```

### 2. Usage catalogue (interface publique)

```typescript
import { ProgrammeCard, ProgrammeCatalogue } from '@/components/programmes';

const CatalogueComponent = () => {
  const programmeCatalogue: ProgrammeCatalogue = {
    id: "wp-001",
    titre: "Formation WordPress avancée",
    description: "Maîtrisez WordPress de A à Z",
    type: "catalogue",
    duree: "5 jours",
    prix: "2500€",
    niveau: "Intermédiaire",
    categorie: {
      id: "web",
      titre: "Développement Web",
      couleur: "#3498db"
    }
  };

  const handlePositionnement = (titre: string) => {
    console.log(`Demande de positionnement pour: ${titre}`);
    // Logique de redirection vers formulaire
  };

  return (
    <ProgrammeCard
      programme={programmeCatalogue}
      variant="catalogue"
      onPositionnement={handlePositionnement}
    />
  );
};
```

### 3. Usage sur-mesure (interface admin)

```typescript
import { ProgrammeCard, ProgrammePersonnalise } from '@/components/programmes';

const AdminSurMesure = () => {
  const programmeSurMesure: ProgrammePersonnalise = {
    id: "custom-001",
    titre: "Formation WordPress - Jean Dupont",
    description: "Programme personnalisé pour Jean",
    type: "sur-mesure",
    beneficiaire: "Jean Dupont",
    statut: "brouillon",
    estValide: false,
    rendezvousId: "rdv-123",
    modules: [
      {
        id: "m1",
        titre: "Bases WordPress",
        description: "Introduction",
        duree: 3,
        objectifs: ["Installation", "Configuration"],
        prerequis: ["HTML de base"],
        contenu: ["Setup", "Dashboard"]
      }
    ]
  };

  const handleValidate = (id: string) => {
    console.log(`Validation du programme ${id}`);
  };

  const handleGenerateDoc = (id: string) => {
    console.log(`Génération document pour ${id}`);
  };

  return (
    <ProgrammeCard
      programme={programmeSurMesure}
      variant="sur-mesure"
      onValidate={handleValidate}
      onGenerateDocument={handleGenerateDoc}
    />
  );
};
```

### 4. Usage administration (gestion globale)

```typescript
import { ProgrammeCard, Programme } from '@/components/programmes';

const AdminFormations = () => {
  const handleEdit = (programme: Programme) => {
    console.log('Édition:', programme);
  };

  const handleDelete = (id: string) => {
    if (confirm('Supprimer ce programme ?')) {
      console.log('Suppression:', id);
    }
  };

  const handleDuplicate = (id: string) => {
    console.log('Duplication:', id);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {programmes.map(programme => (
        <ProgrammeCard
          key={programme.id}
          programme={programme}
          variant="admin"
          onEdit={handleEdit}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      ))}
    </div>
  );
};
```

### 5. Usage compact (listes)

```typescript
import { ProgrammeCard } from '@/components/programmes';

const ProgrammesList = () => {
  return (
    <div className="space-y-2">
      {programmes.map(programme => (
        <ProgrammeCard
          key={programme.id}
          programme={programme}
          variant="compact"
          className="max-h-32"
          onView={handleView}
        />
      ))}
    </div>
  );
};
```

## 🎨 Variants disponibles

| Variant | Usage | Actions disponibles |
|---------|-------|-------------------|
| `catalogue` | Interface publique | Positionnement, Détails |
| `sur-mesure` | Interface admin | Validation, Document, Détails |
| `admin` | Gestion globale | Édition, Suppression, Duplication |
| `compact` | Listes denses | Affichage minimal |

## 🔧 Props complètes

```typescript
interface ProgrammeCardProps {
  programme: Programme;                    // ✅ Requis
  variant?: VariantCard;                   // catalogue, sur-mesure, admin, compact
  className?: string;                      // Classes CSS additionnelles

  // Actions optionnelles selon le contexte
  onView?: (programme: Programme) => void;
  onEdit?: (programme: Programme) => void;
  onDelete?: (id: string) => void;
  onPositionnement?: (titre: string) => void;
  onValidate?: (id: string) => void;
  onGenerateDocument?: (id: string) => void;
  onToggleActive?: (id: string, newState: boolean) => void;
  onDuplicate?: (id: string) => void;
}
```

## 🎯 Migration depuis les anciens composants

### Remplacer FormationCard (catalogue)

```typescript
// ❌ Avant
import FormationCard from '@/components/catalogue/FormationCard';
<FormationCard formation={formation} onPositionnement={handlePositionnement} />

// ✅ Après
import { ProgrammeCard } from '@/components/programmes';
<ProgrammeCard programme={formation} variant="catalogue" onPositionnement={handlePositionnement} />
```

### Remplacer le card interne dans ProgrammesPersonnalises

```typescript
// ❌ Avant (code interne complexe)
<Card>
  <CardHeader>/* ... 50+ lignes ... */</CardHeader>
  <CardContent>/* ... logique complexe ... */</CardContent>
</Card>

// ✅ Après (composant unifié)
<ProgrammeCard
  programme={programme}
  variant="sur-mesure"
  onValidate={handleValidate}
  onGenerateDocument={handleGenerateDoc}
/>
```

## ✅ Avantages de cette approche

- **🔧 Réutilisabilité** : Un seul composant pour tous les contextes
- **🎯 Cohérence UI** : Design uniforme dans toute l'application
- **📈 Maintenabilité** : Modifications centralisées
- **🧪 Testabilité** : Tests unifiés
- **📚 Documentation** : API claire et centralisée
- **🎨 Flexibilité** : Variants adaptés aux besoins

## 🚀 Prochaines étapes

1. Migrer `catalogue/FormationCard.tsx` vers `ProgrammeCard`
2. Adapter `formations/FormationsList.tsx` pour utiliser `ProgrammeCard`
3. Tester tous les contextes d'usage
4. Optimiser les performances si nécessaire