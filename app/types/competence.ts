
export type CategorieCompetence = 'technique' | 'pedagogique' | 'relationnelle' | 'organisationnelle';
export type StatutCompetence = 'planifie' | 'en-cours' | 'acquis' | 'valide';
export type TypePreuve = 'fichier' | 'url';

export interface Competence {
  id: string;
  nom: string;
  description: string;
  categorie: CategorieCompetence;
  domaineDeveloppement: string;
  niveauActuel: number; // 1-5
  objectifNiveau: number; // 1-5
  statut: StatutCompetence;
  actionPrevue: string;
  plateformeFomation?: string;
  lienFormation?: string;
  typePreuve: TypePreuve;
  contenuPreuve: string;
  dateCreation: Date;
  dateModification: Date;
  formateurId?: string;
}

export interface CompetenceFormData {
  nom: string;
  description: string;
  categorie: CategorieCompetence;
  domaineDeveloppement: string;
  niveauActuel: number;
  objectifNiveau: number;
  statut: StatutCompetence;
  actionPrevue: string;
  plateformeFomation?: string;
  lienFormation?: string;
  typePreuve: TypePreuve;
  contenuPreuve: string;
}
