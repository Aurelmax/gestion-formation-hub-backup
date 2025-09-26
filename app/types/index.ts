// ====================================
// TYPES TYPESCRIPT CENTRALISÉS
// Application de gestion de formation
// ====================================

import { z } from 'zod';

// ====================================
// TYPES GÉNÉRIQUES ET ÉVÉNEMENTS
// ====================================

// Type pour les événements génériques
export type GenericEvent = {
  target: {
    name?: string;
    value?: unknown;
    checked?: boolean;
    type?: string;
  };
  preventDefault: () => void;
};

// ====================================
// TYPES DE BASE - PROGRAMMES DE FORMATION
// ====================================

/**
 * Type unifié standardisé pour les programmes de formation
 * OBLIGATOIRE : Utiliser uniquement ces valeurs partout dans l'application
 */
export type ProgrammeType = "catalogue" | "personnalise";

/**
 * Énumération Zod pour la validation API
 */
export const PROGRAMME_TYPE_ENUM = ["catalogue", "personnalise"] as const;

/**
 * Labels d'affichage pour l'interface utilisateur
 */
export const PROGRAMME_TYPE_LABELS: Record<ProgrammeType, string> = {
  catalogue: "Catalogue",
  personnalise: "Personnalisé"
};

/**
 * Types d'erreurs API spécialisées
 */
export type ApiErrorType = 
  | 'validation'
  | 'not_found'
  | 'unauthorized'
  | 'forbidden'
  | 'conflict'
  | 'internal_server'
  | 'database'
  | 'network';

/**
 * Structure d'erreur API améliorée
 */
export interface ApiError {
  type?: ApiErrorType;
  code?: string;
  message: string;
  status?: number;
  details?: Record<string, unknown>;
  field?: string;
  response?: {
    data: any;
    status: number;
  };
}

/**
 * Réponse API standard améliorée
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ====================================
// ENTITÉS PRINCIPALES - PROGRAMMES
// ====================================

/**
 * Interface complète ProgrammeFormation (entité principale)
 * Toujours utiliser cette interface dans tous les composants/hooks
 */
export interface ProgrammeFormation {
  // Identifiants
  id: string;
  code: string;
  type: ProgrammeType;
  
  // Informations générales
  titre: string;
  description: string;
  niveau: string;
  participants: string;
  duree: string;
  prix: string;
  
  // Contenu pédagogique
  objectifs: string[];
  objectifsSpecifiques?: string | null;
  prerequis: string;
  publicConcerne: string;
  contenuDetailleJours: string;
  
  // Modalités
  modalites: string;
  modalitesAcces: string;
  modalitesTechniques: string;
  modalitesReglement: string;
  modalitesEvaluation: string;
  
  // Personnel et ressources
  formateur: string;
  ressourcesDisposition: string;
  ressourcesAssociees?: string[];
  
  // Certification et validation
  sanctionFormation: string;
  niveauCertification: string;
  delaiAcceptation: string;
  
  // Accessibilité et gestion
  accessibiliteHandicap: string;
  cessationAbandon: string;
  
  // Relations
  categorieId?: string | null;
  categorie?: {
    id: string;
    nom: string;
    titre?: string;
  } | null;
  beneficiaireId?: string | null;
  programmeCatalogueId?: string | null;
  programmeCatalogue?: {
    id: string;
    code: string;
    titre: string;
    version: number;
  } | null;
  
  // Programmes dérivés
  programmesDerivés?: {
    id: string;
    code: string;
    titre: string;
    version: number;
  }[];
  
  // Métadonnées
  pictogramme?: string | null;
  programmeUrl?: string | null;
  estActif: boolean;
  estVisible: boolean;
  version: number;
  dateCreation: string;
  dateModification?: string | null;
}

/**
 * Interface Catégorie améliorée (compatible avec CategorieType existante)
 */
export interface CategorieType {
  id: string;
  titre: string;
  nom?: string;
  code?: string;
  description?: string;
  ordre?: number;
  estActive?: boolean;
  pictogramme?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  dateCreation?: string;
  dateModification?: string;
  programmes?: ProgrammeFormation[];
}

// ====================================
// TYPES DE REQUÊTES ET RÉPONSES API
// ====================================

/**
 * Filtres pour les requêtes de programmes
 */
export interface ProgrammeFilters {
  type?: ProgrammeType;
  categorieId?: string;
  search?: string;
  estActif?: boolean;
  estVisible?: boolean;
  niveau?: string;
  beneficiaireId?: string;
}

/**
 * Options de pagination
 */
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: keyof ProgrammeFormation;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paramètres de requête complets
 */
export interface ProgrammeQueryParams extends ProgrammeFilters, PaginationOptions {}

/**
 * Données pour créer un programme
 */
export interface ProgrammeFormationCreate extends Omit<ProgrammeFormation, 
  'id' | 'dateCreation' | 'dateModification' | 'version' | 'categorie' | 'programmeCatalogue' | 'programmesDerivés'
> {
  categorieId?: string;
  programmeCatalogueId?: string;
}

/**
 * Données pour mettre à jour un programme
 */
export interface ProgrammeFormationUpdate extends Partial<ProgrammeFormationCreate> {}

/**
 * Données pour dupliquer un programme
 */
export interface ProgrammeDuplicationData {
  nouveauCode?: string;
  nouveauTitre?: string;
  type?: ProgrammeType;
  categorieId?: string;
}

// ====================================
// TYPES UTILITAIRES POUR LES HOOKS
// ====================================

/**
 * Options pour les hooks de programmes
 */
export interface UseProgrammesFormationOptions {
  autoFetch?: boolean;
  filterType?: ProgrammeType | null;
  enableCache?: boolean;
  refreshInterval?: number;
}

/**
 * État de chargement pour les hooks
 */
export interface LoadingState {
  loading: boolean;
  fetching: boolean;
  submitting: boolean;
  deleting: boolean;
}

/**
 * Informations de catégorie pour les hooks
 */
export interface CategoryInfo {
  id: string;
  titre: string;
  nom: string;
  code?: string;
  description?: string;
}

/**
 * Données groupées par type
 */
export interface ProgrammesByType {
  catalogue: ProgrammeFormation[];
  personnalise: ProgrammeFormation[];
  all: ProgrammeFormation[];
}

// ====================================
// SCHÉMAS DE VALIDATION ZOD
// ====================================

/**
 * Schéma de validation pour un programme
 */
export const programmeFormationSchema = z.object({
  code: z.string().min(1, "Le code est obligatoire").max(50, "Code trop long"),
  type: z.enum(PROGRAMME_TYPE_ENUM, { 
    errorMap: () => ({ message: "Type de programme invalide" })
  }),
  titre: z.string().min(1, "Le titre est obligatoire").max(200, "Titre trop long"),
  description: z.string().min(1, "La description est obligatoire"),
  niveau: z.string().min(1, "Le niveau est obligatoire"),
  participants: z.string().min(1, "Le nombre de participants est obligatoire"),
  duree: z.string().min(1, "La durée est obligatoire"),
  prix: z.string().min(1, "Le prix est obligatoire"),
  objectifs: z.array(z.string()).min(1, "Au moins un objectif est requis"),
  prerequis: z.string(),
  publicConcerne: z.string().min(1, "Le public concerné est obligatoire"),
  contenuDetailleJours: z.string().min(1, "Le contenu détaillé est obligatoire"),
  modalites: z.string().min(1, "Les modalités sont obligatoires"),
  modalitesAcces: z.string().min(1, "Les modalités d'accès sont obligatoires"),
  modalitesTechniques: z.string().min(1, "Les modalités techniques sont obligatoires"),
  modalitesReglement: z.string().min(1, "Les modalités de règlement sont obligatoires"),
  formateur: z.string().min(1, "Le formateur est obligatoire"),
  ressourcesDisposition: z.string().min(1, "Les ressources sont obligatoires"),
  modalitesEvaluation: z.string().min(1, "Les modalités d'évaluation sont obligatoires"),
  sanctionFormation: z.string().min(1, "La sanction de formation est obligatoire"),
  niveauCertification: z.string().min(1, "Le niveau de certification est obligatoire"),
  delaiAcceptation: z.string().min(1, "Le délai d'acceptation est obligatoire"),
  accessibiliteHandicap: z.string().min(1, "L'accessibilité handicap est obligatoire"),
  cessationAbandon: z.string().min(1, "Les conditions d'arrêt sont obligatoires"),
  categorieId: z.string().optional().nullable(),
  beneficiaireId: z.string().optional().nullable(),
  programmeCatalogueId: z.string().optional().nullable(),
  pictogramme: z.string().optional().nullable(),
  programmeUrl: z.string().optional().nullable(),
  ressourcesAssociees: z.array(z.string()).optional(),
  objectifsSpecifiques: z.string().optional().nullable(),
  estActif: z.boolean().default(true),
  estVisible: z.boolean().default(false)
});

/**
 * Type inféré du schéma de validation
 */
export type ProgrammeFormationInput = z.infer<typeof programmeFormationSchema>;

// ====================================
// UTILITAIRES DE TYPE
// ====================================

/**
 * Type guards pour les programmes
 */
export const isTypeCatalogue = (type: ProgrammeType): type is "catalogue" => 
  type === "catalogue";

export const isTypePersonnalise = (type: ProgrammeType): type is "personnalise" => 
  type === "personnalise";

export const isProgrammeActif = (programme: ProgrammeFormation): boolean => 
  programme.estActif;

export const isProgrammeVisible = (programme: ProgrammeFormation): boolean => 
  programme.estVisible;

// Type pour les données de formulaire
export interface FormData {
  [key: string]: string | number | boolean | undefined | null;
}

// Type pour les demandes de rendez-vous
export interface RendezVous {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  entreprise?: string;
  message?: string;
  dateRendezVous?: Date | string;
  // Programme peut être soit un objet simple avec juste id et titre, soit un ProgrammeFormation complet
  programme?: ProgrammeFormation | {
    id?: string;
    titre?: string;
  };
  formationTitre?: string;
  apprenantNom?: string;
  statut?: string;
  dateCreation?: Date | string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  programmeId?: string;
}

// Type pour les actions correctives
export interface ActionCorrective {
  id: string;
  titre: string;
  description?: string;
  dateConstat?: Date | string;
  dateAction?: Date | string;
  statut?: string;
  responsable?: string;
  source?: string;
  impact?: string;
  efficacite?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Type pour les réclamations
export interface Reclamation {
  id: string;
  titre: string;
  description?: string;
  statut?: string;
  dateReclamation?: Date | string;
  nomReclamant?: string;
  emailReclamant?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Type pour les utilisateurs
export interface User {
  id: string;
  email: string;
  nom?: string;
  prenom?: string;
  role?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Type pour les compétences
export interface Competence {
  id: string;
  titre: string;
  description?: string;
  niveau?: string;
  domaineCompetence?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// Type pour les documents
export interface Document {
  id: string;
  titre: string;
  description?: string;
  url?: string;
  type?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

// ====================================
// RÈGLES DE COHÉRENCE ET DOCUMENTATION
// ====================================

/**
 * RÈGLES DE COHÉRENCE OBLIGATOIRES POUR LA BIBLIOTHÈQUE DE PROGRAMMES :
 * 
 * 1. TYPES DE PROGRAMME :
 *    - Utiliser UNIQUEMENT ProgrammeType = "catalogue" | "personnalise"
 *    - JAMAIS "sur-mesure", "custom", ou autres variantes
 *    - Toujours valider avec PROGRAMME_TYPE_ENUM dans les API
 *    - Utiliser PROGRAMME_TYPE_LABELS pour l'affichage utilisateur
 * 
 * 2. IMPORTS OBLIGATOIRES :
 *    - ProgrammeFormation depuis '@/types' (ce fichier)
 *    - JAMAIS depuis '@/hooks/useProgrammesFormation' ou '@/types/programmes'
 *    - Utiliser les interfaces centralisées pour tous les composants
 * 
 * 3. GESTION DES ERREURS :
 *    - Utiliser ApiError avec le champ 'type' pour catégoriser
 *    - Implémenter ApiErrorType pour une gestion spécialisée
 *    - Toujours retourner une structure ApiResponse<T> cohérente
 * 
 * 4. VALIDATION AVEC ZOD :
 *    - Utiliser programmeFormationSchema pour la validation côté serveur
 *    - Appliquer ProgrammeFormationInput pour les données de formulaire
 *    - Valider côté client ET serveur pour la sécurité
 * 
 * 5. HOOKS ET ÉTAT :
 *    - Utiliser UseProgrammesFormationOptions pour la configuration
 *    - Respecter LoadingState pour l'état de chargement uniforme
 *    - Implémenter CategoryInfo pour les données de catégorie
 * 
 * 6. FILTRAGE ET RECHERCHE :
 *    - Utiliser ProgrammeFilters pour toutes les requêtes filtrées
 *    - Appliquer PaginationOptions pour la pagination cohérente
 *    - Combiner dans ProgrammeQueryParams pour les requêtes complètes
 * 
 * 7. OPÉRATIONS CRUD :
 *    - ProgrammeFormationCreate pour les créations (sans id, dates auto)
 *    - ProgrammeFormationUpdate pour les mises à jour (Partial)
 *    - ProgrammeDuplicationData pour les duplications spécialisées
 * 
 * 8. TYPE GUARDS ET UTILITAIRES :
 *    - Utiliser isTypeCatalogue() et isTypePersonnalise() pour les vérifications
 *    - Appliquer isProgrammeActif() et isProgrammeVisible() pour l'état
 *    - Ces fonctions garantissent la cohérence des vérifications
 * 
 * 9. COMPATIBILITÉ ASCENDANTE :
 *    - CategorieType maintient la compatibilité avec l'existant
 *    - Ajout de champs optionnels pour une migration en douceur
 *    - Les types existants (RendezVous, ActionCorrective, etc.) conservés
 * 
 * 10. BONNES PRATIQUES :
 *     - Toujours typer explicitement les variables et paramètres
 *     - Éviter 'any' - utiliser les interfaces définies
 *     - Préférer les types stricts aux types optionnels quand possible
 *     - Documenter les exceptions aux règles dans les commentaires
 */

// ====================================
// EXEMPLES D'UTILISATION CORRECTE
// ====================================

/**
 * EXEMPLE 1 - Import correct dans un composant :
 * 
 * import { ProgrammeFormation, ProgrammeType, PROGRAMME_TYPE_LABELS } from '@/types';
 * 
 * const MonComposant: React.FC = () => {
 *   const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
 *   const [type, setType] = useState<ProgrammeType>('catalogue');
 *   
 *   return (
 *     <div>
 *       {PROGRAMME_TYPE_LABELS[type]}
 *       {programmes.map(p => <div key={p.id}>{p.titre}</div>)}
 *     </div>
 *   );
 * };
 */

/**
 * EXEMPLE 2 - Validation avec Zod :
 * 
 * import { programmeFormationSchema } from '@/types';
 * 
 * export async function POST(request: Request) {
 *   const body = await request.json();
 *   
 *   try {
 *     const validData = programmeFormationSchema.parse(body);
 *     // Traitement des données validées...
 *   } catch (error) {
 *     return Response.json({ 
 *       success: false, 
 *       error: { type: 'validation', message: 'Données invalides' }
 *     });
 *   }
 * }
 */

/**
 * EXEMPLE 3 - Hook avec types corrects :
 * 
 * import { UseProgrammesFormationOptions, ProgrammeFilters } from '@/types';
 * 
 * export const useMyProgrammes = (options: UseProgrammesFormationOptions) => {
 *   const [loading, setLoading] = useState<boolean>(false);
 *   
 *   const fetchWithFilters = (filters: ProgrammeFilters) => {
 *     // Implémentation...
 *   };
 *   
 *   return { loading, fetchWithFilters };
 * };
 */
