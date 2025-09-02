export interface Formation {
  id: string;
  code?: string;
  titre: string;
  description: string;
  duree: string;
  prix: string;
  niveau: string;
  participants: string;
  objectifs: string[] | string;
  prerequis: string;
  modalites: string;
  programmeUrl?: string;
  estActif?: boolean;
  estVisible?: boolean;
  categorieCode?: string;
  dateCreation?: string;
  categorie?: {
    id: string;
    code: string;
    titre: string;
    couleur?: string;
  };
  type?: string;
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
  dateModification?: string;
}

export interface CategorieFormation {
  id: string;
  titre: string;
  description: string;
  formations: Formation[];
}
