// Types centralisés pour l'application
// Ces types seront utilisés dans tout le projet pour remplacer les 'any'

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

// Type pour les erreurs génériques
export type ApiError = {
  message: string;
  status?: number;
  details?: Record<string, unknown>;
  response?: {
    data: any;
    status: number;
  };
};

// Type pour les résultats d'API
export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: ApiError;
  message?: string;
};

// Type pour le programme de formation
export interface ProgrammeFormation {
  id: string;
  titre: string;
  description?: string;
  contenuDetaille?: string;
  contenuDetailleHtml?: string;
  type?: string;
  estActif?: boolean;
  categorie?: CategorieType;
  categorieId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  duree?: number;
  prix?: number;
  niveau?: string;
  prerequis?: string;
  objectifs?: string;
  modalites?: string;
  evaluation?: string;
  certification?: string;
  public?: string;
  image?: string;
}

// Type pour les catégories
export interface CategorieType {
  id: string;
  titre: string;
  code?: string;
  description?: string;
  ordre?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  programmes?: ProgrammeFormation[];
}

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
