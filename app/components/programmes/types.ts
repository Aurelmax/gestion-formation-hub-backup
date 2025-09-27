// Types unifiés pour tous les programmes de formation
// Combine les besoins catalogue, sur-mesure et administration

export type TypeProgramme = 'catalogue' | 'sur-mesure';
export type StatutProgramme = 'brouillon' | 'valide' | 'archive' | 'actif' | 'inactif';
export type VariantCard = 'catalogue' | 'sur-mesure' | 'admin' | 'compact';

// Base commune pour tous les programmes
export interface ProgrammeBase {
  id: string;
  titre: string;
  description: string;
  type: TypeProgramme;
  dateCreation?: string | Date;
  dateModification?: string | Date;
  estActif?: boolean;
}

// Interface pour les catégories
export interface CategorieProgramme {
  id: string;
  code?: string;
  titre: string;
  description?: string;
  couleur?: string;
  ordre?: number;
}

// Module pour programmes personnalisés
export interface ModuleProgramme {
  id: string;
  titre: string;
  description: string;
  duree: number;
  objectifs: string[];
  prerequis: string[];
  contenu: string[];
}

// Interface programme catalogue (standardisé)
export interface ProgrammeCatalogue extends ProgrammeBase {
  type: 'catalogue';
  code?: string;
  duree: string;           // Format texte "5 jours"
  prix?: string;           // Prix affiché
  niveau?: string;
  participants?: string;
  objectifs?: string[] | string;
  prerequis?: string;
  modalites?: string;
  programmeUrl?: string;
  estVisible?: boolean;
  categorieCode?: string;
  categorie?: CategorieProgramme;
  pictogramme?: string;

  // Champs détaillés pour catalogue
  referentPedagogique?: string;
  modalitesAcces?: string;
  ressourcesDisposition?: string;
  modalitesEvaluation?: string;
  sanctionFormation?: string;
  niveauCertification?: string;
  accessibiliteHandicap?: string;
  contactOrganisme?: string;
  formateur?: string;
  horaires?: string;
  publicConcerne?: string;
  modalitesTechniques?: string;
  modalitesReglement?: string;
  objectifsSpecifiques?: string;
  contenuDetailleJours?: string;
  evaluationSur?: string;
  delaiAcceptation?: string;
  referentQualite?: string;
  ressourcesAssociees?: string[];
}

// Interface programme personnalisé (sur-mesure)
export interface ProgrammePersonnalise extends ProgrammeBase {
  type: 'sur-mesure';
  modules: ModuleProgramme[];
  rendezvousId: string;
  beneficiaire: string;
  statut: StatutProgramme;
  estValide: boolean;
  documentUrl?: string;

  // Lien avec le programme source (si adaptation)
  programmeSourceId?: string;
  programmeSource?: ProgrammeCatalogue;
}

// Union type pour tous les programmes
export type Programme = ProgrammeCatalogue | ProgrammePersonnalise;

// Props pour le composant universel ProgrammeCard
export interface ProgrammeCardProps {
  programme: Programme;
  variant?: VariantCard;
  className?: string;

  // Actions selon le contexte
  onView?: (programme: Programme) => void;
  onEdit?: (programme: Programme) => void;
  onDelete?: (id: string) => void;
  onPositionnement?: (titre: string) => void;
  onValidate?: (id: string) => void;
  onGenerateDocument?: (id: string) => void;
  onToggleActive?: (id: string, newState: boolean) => void;
  onDuplicate?: (id: string) => void;
}

// Utilitaires de type guards
export const isProgrammeCatalogue = (programme: Programme): programme is ProgrammeCatalogue => {
  return programme.type === 'catalogue';
};

export const isProgrammePersonnalise = (programme: Programme): programme is ProgrammePersonnalise => {
  return programme.type === 'sur-mesure';
};

// Interface pour les listes de programmes
export interface ProgrammesData {
  programmes: Programme[];
  total: number;
  page?: number;
  totalPages?: number;
}

// Interface pour les réponses API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}