// Types centralisés pour les programmes de formation

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
 * Interface ProgrammeFormation centralisée
 * Toujours utiliser cette interface dans tous les composants/hooks
 */
export interface ProgrammeFormation {
  id: string;
  code: string;
  type: ProgrammeType; // ← Type unifié
  titre: string;
  description: string;
  niveau: string;
  participants: string;
  duree: string;
  prix: string;
  objectifs: string[];
  prerequis: string;
  publicConcerne: string;
  contenuDetailleJours: string;
  modalites: string;
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
  categorieId?: string | null;
  categorie?: {
    id: string;
    nom: string;
  } | null;
  pictogramme?: string | null;
  estActif: boolean;
  estVisible: boolean;
  version: number;
  objectifsSpecifiques?: string | null;
  beneficiaireId?: string | null;
  programmeUrl?: string | null;
  ressourcesAssociees?: string[];
  dateCreation: string;
  dateModification?: string | null;
  programmeCatalogueId?: string | null;
  programmeCatalogue?: {
    id: string;
    code: string;
    titre: string;
    version: number;
  } | null;
  programmesDerivés?: {
    id: string;
    code: string;
    titre: string;
    version: number;
  }[];
}

/**
 * Utilitaires de type
 */
export const isTypeCatalogue = (type: ProgrammeType): type is "catalogue" => type === "catalogue";
export const isTypePersonnalise = (type: ProgrammeType): type is "personnalise" => type === "personnalise";