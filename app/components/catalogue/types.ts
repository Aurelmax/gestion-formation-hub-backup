export interface Formation {
  id: string;
  titre: string;
  description: string;
  duree: string;
  prix: string;
  niveau: string;
  participants: string;
  objectifs: string[];
  prerequis: string;
  modalites: string;
  tauxParticipation?: string;
  tauxReussite?: string;
  programmeUrl?: string;
}

export interface CategorieFormation {
  id: string;
  titre: string;
  description: string;
  formations: Formation[];
}
