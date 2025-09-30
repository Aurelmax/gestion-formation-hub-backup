// app/components/programmes/types.ts

// ==========================================
// API Response Types
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// ==========================================
// Enums
// ==========================================

export enum TypeProgramme {
  CATALOGUE = 'CATALOGUE',
  SUR_MESURE = 'SUR_MESURE'
}

export enum StatutProgramme {
  BROUILLON = 'BROUILLON',
  ACTIF = 'ACTIF',
  ARCHIVE = 'ARCHIVE',
  EN_COURS = 'EN_COURS',
  TERMINE = 'TERMINE',
  VALIDE = 'VALIDE'
}

export enum VariantCard {
  CATALOGUE = 'catalogue',
  SUR_MESURE = 'sur-mesure',
  UNIVERSAL = 'universal',
  COMPACT = 'compact'
}

// Type helper pour variant
export type VariantCardType = VariantCard | 'catalogue' | 'sur-mesure' | 'universal' | 'compact';

// ==========================================
// Interfaces de base
// ==========================================

export interface CategorieProgramme {
  id: string;
  titre: string;
  couleur: string;
  description?: string;
}

export interface ModuleProgramme {
  id: string;
  titre: string;
  description: string;
  duree: string | number;
  ordre?: number;
  objectifs?: string[];
  prerequis?: string[];
  contenu?: string | string[];
}

// ==========================================
// Interface Programme de base (commune)
// ==========================================

export interface Programme {
  id: string;
  titre: string;
  description: string;
  type: string; // Flexible pour accepter enum ou string
  statut?: string;
  dateCreation: string;
  dateModification?: string;
  createdBy?: string;
  
  // Optionnels selon le type
  categorieProgramme?: CategorieProgramme;
  modules?: ModuleProgramme[];
  duree?: string;
  niveau?: string;
  participantsMax?: number;
  prix?: number;
  programmeParentId?: string;
  rendezvousId?: string;
  beneficiaire?: string;
  
  // Champs additionnels pour gestion
  estValide?: boolean;
  documentUrl?: string;
  
  // Relations - Type générique pour éviter conflits
  sourceProgram?: Programme;
  adaptations?: Programme[];
}

// ==========================================
// Interface spécialisée pour programmes CATALOGUE
// ==========================================

export interface ProgrammeCatalogue {
  id: string;
  titre: string;
  description: string;
  type: TypeProgramme.CATALOGUE | 'catalogue';
  statut?: string;
  dateCreation: string;
  dateModification?: string;
  createdBy?: string;
  
  // Champs obligatoires pour catalogue
  categorieProgramme: CategorieProgramme;
  duree: string;
  niveau: string;
  participantsMax: number;
  prix: number;
  
  // Optionnels
  objectifsPedagogiques?: string[];
  prerequis?: string[];
  publicCible?: string;
  modalitesPedagogiques?: string[];
  evaluations?: string[];
  
  // Relations
  sourceProgram?: never; // Catalogue n'a pas de source
  adaptations?: ProgrammePersonnalise[];
}

// ==========================================
// Interface spécialisée pour programmes SUR-MESURE
// ==========================================

export interface ProgrammePersonnalise {
  id: string;
  titre: string;
  description: string;
  type: TypeProgramme.SUR_MESURE | 'sur-mesure';
  statut?: string;
  dateCreation: string;
  dateModification?: string;
  createdBy?: string;
  
  // Champs obligatoires pour sur-mesure
  modules: ModuleProgramme[];
  rendezvousId: string;
  beneficiaire: string;
  estValide: boolean;
  
  // Optionnels
  programmeParentId?: string;
  datePositionnement?: string;
  besoinsSpecifiques?: string;
  adaptations?: string[];
  validePar?: string;
  dateValidation?: string;
  documentUrl?: string;
  
  // Optionnels hérités
  duree?: string;
  niveau?: string;
  participantsMax?: number;
  prix?: number;
  categorieProgramme?: CategorieProgramme;
  
  // Relations
  sourceProgram?: ProgrammeCatalogue;
}

// Type union pour tous les programmes
export type AnyProgramme = Programme | ProgrammeCatalogue | ProgrammePersonnalise;

// ==========================================
// Props du composant ProgrammeCard
// ==========================================

export interface ProgrammeCardProps {
  programme: AnyProgramme;
  variant?: VariantCardType;
  size?: 'compact' | 'default' | 'detailed';
  showActions?: boolean;
  actions?: {
    onView?: (programme: AnyProgramme) => void;
    onEdit?: (programme: AnyProgramme) => void;
    onDelete?: (programmeId: string) => void | Promise<void>;
    onDuplicate?: (programme: AnyProgramme) => void;
    onAdapt?: (programme: AnyProgramme) => void;
    onSchedule?: (programme: AnyProgramme) => void;
    onDownload?: (programme: AnyProgramme) => void;
    onValidate?: (programmeId: string) => void | Promise<void>;
    onGenerateDocument?: (programmeId: string) => void | Promise<void>;
  };
  className?: string;
}

// ==========================================
// Type Guards - Corrigés
// ==========================================

export function isProgrammeCatalogue(
  programme: AnyProgramme
): programme is ProgrammeCatalogue {
  return (
    programme.type === TypeProgramme.CATALOGUE || 
    programme.type === 'catalogue'
  );
}

export function isProgrammePersonnalise(
  programme: AnyProgramme
): programme is ProgrammePersonnalise {
  return (
    programme.type === TypeProgramme.SUR_MESURE || 
    programme.type === 'sur-mesure'
  );
}

// ==========================================
// Helpers Utilitaires
// ==========================================

export function normalizeTypeProgramme(type: string): TypeProgramme {
  const normalized = type.toLowerCase();
  if (normalized === 'catalogue' || type === TypeProgramme.CATALOGUE) {
    return TypeProgramme.CATALOGUE;
  }
  if (normalized === 'sur-mesure' || type === TypeProgramme.SUR_MESURE) {
    return TypeProgramme.SUR_MESURE;
  }
  return TypeProgramme.CATALOGUE;
}

export function normalizeStatutProgramme(statut?: string): StatutProgramme {
  if (!statut) return StatutProgramme.BROUILLON;
  
  const statusMap: Record<string, StatutProgramme> = {
    'brouillon': StatutProgramme.BROUILLON,
    'valide': StatutProgramme.VALIDE,
    'actif': StatutProgramme.ACTIF,
    'archive': StatutProgramme.ARCHIVE,
    'en_cours': StatutProgramme.EN_COURS,
    'termine': StatutProgramme.TERMINE
  };
  
  return statusMap[statut.toLowerCase()] || StatutProgramme.BROUILLON;
}

export function formatDuree(duree: string | number): string {
  if (typeof duree === 'string') return duree;
  if (typeof duree === 'number') {
    if (duree === 1) return '1 heure';
    if (duree < 8) return `${duree} heures`;
    const jours = Math.floor(duree / 7);
    return jours === 1 ? '1 jour' : `${jours} jours`;
  }
  return 'Durée non définie';
}

export function normalizeVariant(variant: string | VariantCard): VariantCard {
  if (Object.values(VariantCard).includes(variant as VariantCard)) {
    return variant as VariantCard;
  }
  
  const variantMap: Record<string, VariantCard> = {
    'catalogue': VariantCard.CATALOGUE,
    'sur-mesure': VariantCard.SUR_MESURE,
    'universal': VariantCard.UNIVERSAL,
    'compact': VariantCard.COMPACT
  };
  
  return variantMap[variant] || VariantCard.UNIVERSAL;
}

// ==========================================
// Configuration UI par type
// ==========================================

export interface ProgrammeTypeConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  buttonColor: string;
  badge: { bg: string; text: string };
  icon: string;
  label: string;
}

export function getProgrammeConfig(type: string): ProgrammeTypeConfig {
  const normalizedType = normalizeTypeProgramme(type);
  
  const configs: Record<TypeProgramme, ProgrammeTypeConfig> = {
    [TypeProgramme.CATALOGUE]: {
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-l-blue-500',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      badge: { bg: 'bg-blue-100', text: 'text-blue-800' },
      icon: 'BookOpen',
      label: 'Catalogue'
    },
    [TypeProgramme.SUR_MESURE]: {
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-700',
      borderColor: 'border-l-orange-500',
      buttonColor: 'bg-orange-600 hover:bg-orange-700',
      badge: { bg: 'bg-orange-100', text: 'text-orange-800' },
      icon: 'Settings',
      label: 'Sur-mesure'
    }
  };

  return configs[normalizedType];
}