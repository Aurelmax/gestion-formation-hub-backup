
export type TypeVeille = 'reglementaire' | 'metier' | 'innovation';
export type StatutVeille = 'nouvelle' | 'en-cours' | 'terminee';

export interface Veille {
  id: string;
  titre: string;
  description: string;
  type: TypeVeille;
  statut: StatutVeille;
  avancement: number; // pourcentage 0-100
  dateCreation: Date;
  dateEcheance?: Date;
  commentaires: string[];
  documents: Document[];
  historique: HistoriqueAction[];
}

export interface Document {
  id: string;
  nom: string;
  url: string;
  type: string;
  taille: number;
  dateAjout: Date;
}

export interface HistoriqueAction {
  id: string;
  action: string;
  date: Date;
  utilisateur: string;
  details?: string;
}
