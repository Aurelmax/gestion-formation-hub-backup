# API Programmes de Formation

## Base URL
```
https://votre-domaine.com/api/programmes-formation
```

## Authentification
Certaines routes nécessitent une authentification via JWT :
```
Authorization: Bearer <token>
```

## Endpoints

### 1. Lister les programmes
```
GET /
```

#### Paramètres de requête
| Paramètre  | Type     | Requis | Description                                   |
|------------|----------|--------|-----------------------------------------------|
| type       | string   | Non    | 'catalogue' ou 'sur-mesure'                  |
| version    | integer  | Non    | Numéro de version spécifique                  |
| fields     | string   | Non    | Champs supplémentaires (séparés par virgules) |
| categorieId| string   | Non    | Filtrer par catégorie (UUID)                 |
| estActif   | boolean  | Non    | Filtrer par statut d'activation              |
| search     | string   | Non    | Recherche textuelle                          |
| page       | integer  | Non    | Numéro de page (défaut: 1)                   |
| limit      | integer  | Non    | Nombre d'éléments par page (max: 100)        |

#### Exemple de requête
```bash
curl -X GET 'https://votre-domaine.com/api/programmes-formation?type=catalogue&fields=details&page=1&limit=10'
```

#### Réponse réussie (200)
```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "code": "DEV-WEB-01",
      "titre": "Développement Web Avancé",
      "description": "Formation complète sur les technologies web modernes",
      "type": "catalogue",
      "version": 1,
      "estActif": true,
      "categorie": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "titre": "Développement"
      },
      "contenuDetailleHtml": "<h2>Module 1: Introduction</h2><p>...</p>",
      "objectifs": ["Maîtriser React", "Apprendre Next.js"],
      "prerequis": "Connaissances de base en JavaScript",
      "modalites": "Formation en présentiel ou distanciel"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "totalPages": 2,
    "limit": 10
  }
}
```

### 2. Récupérer un programme par code
```
GET /by-code/:code
```

#### Paramètres de requête
| Paramètre | Type    | Requis | Description                  |
|-----------|---------|--------|------------------------------|
| version   | integer | Non    | Numéro de version spécifique |
| fields    | string  | Non    | Champs supplémentaires       |

#### Exemple de requête
```bash
curl -X GET 'https://votre-domaine.com/api/programmes-formation/by-code/DEV-WEB-01?fields=details'
```

### 3. Créer un programme
```
POST /
```

#### Corps de la requête
```json
{
  "code": "DEV-WEB-02",
  "type": "catalogue",
  "titre": "Nouvelle Formation Web",
  "description": "Description détaillée...",
  "categorieId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  // autres champs...
}
```

## Gestion du Cache

### Headers de cache
- `Cache-Control`: Définit la durée de cache
- `ETag`: Identifiant unique du contenu
- `Last-Modified`: Date de dernière modification

### Comportement par défaut
- **Programmes catalogue**: Cache de 24h
- **Programmes sur-mesure**: Cache de 15min

### Validation de cache
Le client peut utiliser les headers standards pour la validation de cache :
- `If-None-Match` avec l'ETag reçu
- `If-Modified-Since` avec la date de dernière modification

## Codes d'erreur

| Code | Description                     |
|------|---------------------------------|
| 400  | Requête invalide               |
| 401  | Non autorisé                   |
| 403  | Accès refusé                   |
| 404  | Programme non trouvé           |
| 429  | Trop de requêtes               |
| 500  | Erreur serveur                 |

## Exemple d'erreur
```json
{
  "error": "Programme non trouvé",
  "code": "NOT_FOUND",
  "details": "Aucun programme trouvé avec l'ID spécifié"
}
```

## Bonnes pratiques

1. **Validation** : Toujours valider les entrées avec Zod
2. **Pagination** : Utiliser `page` et `limit` pour les listes
3. **Cache** : Respecter les en-têtes de cache pour optimiser les performances
4. **Sécurité** : Toujours utiliser HTTPS et valider les tokens JWT

## Exemple complet avec Axios

```javascript
import axios from 'axios';

const API_URL = 'https://votre-domaine.com/api/programmes-formation';

// Récupérer les programmes catalogue avec pagination
async function getProgrammes(page = 1, limit = 10) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        type: 'catalogue',
        page,
        limit,
        fields: 'details'
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes:', error);
    throw error;
  }
}
```
