import { useState, useEffect } from 'react';
import axios from 'axios';

// Type pour les programmes de formation
export interface ProgrammeFormation {
  id: string;
  code?: string;
  codeInterne?: string;
  titre: string;
  description: string;
  duree: string;
  prix?: string;
  niveau?: string;
  participants?: string;
  objectifs?: string[];
  prerequis?: string;
  modalites?: string;
  estActif: boolean;
  programmeUrl?: string;
  type: string;
  version: number;
  dateCreation?: string | Date;
  dateModification?: string | Date;
  pictogramme?: string;
  categorieCode?: string; // Ajout pour les programmes HTML
  categorie?: {
    id: string;
    nom: string;
    code?: string;
  };
  // Autres propriétés selon vos besoins
}

// Interface pour les catégories de formations retournées par l'API
export interface CategorieFormation {
  id: string;
  code: string;
  titre: string;
  description: string;
  couleur: string;
  formations: ProgrammeFormation[];
}

export const useProgrammesCatalogue = () => {
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [categories, setCategories] = useState<CategorieFormation[]>([]); // Ajout pour les catégories
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      // Utilise le nouvel endpoint pour les programmes HTML groupés par catégorie
      const response = await axios.get('/api/programmes-html/par-categorie/groupes');
      
      // Stockage des catégories avec leurs programmes
      setCategories(response.data);
      
      // Extraction de tous les programmes pour la compatibilité avec le code existant
      const allProgrammes = response.data.flatMap((categorie: CategorieFormation) => categorie.formations);
      setProgrammes(allProgrammes);
      
      setError(null);
    } catch (err) {
      console.error("Erreur lors de la récupération des programmes HTML:", err);
      setError("Impossible de charger les programmes de formation");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour publier/dépublier un programme
  const toggleProgrammeStatus = async (programmeId: string, estActif: boolean) => {
    try {
      // Appel à l'API pour mettre à jour le statut de publication
      await axios.patch(`/api/programmes-formation/${programmeId}/status`, { estActif });
      
      // Mise à jour locale de l'état
      setProgrammes(programmes.map(prog => 
        prog.id === programmeId ? { ...prog, estActif } : prog
      ));
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la modification du statut du programme:", err);
      return false;
    }
  };

  // Fonction pour créer une nouvelle version d'un programme
  const createNewVersion = async (programmeId: string, modifications = {}) => {
    try {
      const response = await axios.post(`/api/programmes-formation/${programmeId}/version`, { 
        modifications 
      });
      
      // Rafraîchir la liste après création d'une nouvelle version
      fetchProgrammes();
      
      return response.data;
    } catch (err) {
      console.error("Erreur lors de la création d'une nouvelle version:", err);
      throw err;
    }
  };

  // Fonction pour supprimer un programme
  const deleteProgramme = async (programmeId: string) => {
    try {
      await axios.delete(`/api/programmes-formation/${programmeId}`);
      
      // Mise à jour locale de l'état
      setProgrammes(programmes.filter(prog => prog.id !== programmeId));
      
      return true;
    } catch (err) {
      console.error("Erreur lors de la suppression du programme:", err);
      return false;
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  return { 
    programmes, 
    categories, // Ajout des catégories pour l'affichage groupé
    loading, 
    error, 
    refreshProgrammes: fetchProgrammes,
    toggleProgrammeStatus,
    createNewVersion,
    deleteProgramme
  };
};
