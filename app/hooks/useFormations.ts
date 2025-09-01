
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

// Interface pour les formations
interface Formation {
  id: string;
  code: string;
  
  // Champs légaux et réglementaires
  prerequis: string;
  publicConcerne: string;
  duree: string;
  horaires: string;
  objectifsPedagogiques: string;
  modalitesAcces: string;
  tarif: string;
  modalitesReglement: string;
  contactOrganisme: string;
  referentPedagogique: string;
  referentQualite: string;
  modalitesTechniques: string;
  formateur: string;
  ressourcesDisposition: string;
  modalitesEvaluation: string;
  sanctionFormation: string;
  niveauCertification: string;
  delaiAcceptation: string;
  accessibiliteHandicapee: string;
  cessationAbandon: string;
  
  // Dates
  dateCreation: Date;
  dateModification: Date;
  createdAt: Date;
}

export const useFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();


  const fetchFormations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/formations');
      setFormations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des formations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormations();
  }, []);

  const createFormation = async (
    formationData: Omit<Formation, 'id' | 'createdAt' | 'dateCreation' | 'dateModification'>
  ) => {
    try {
      const response = await api.post('/formations', formationData);
      const newFormation = response.data;
      setFormations(prev => [newFormation, ...prev]);
      toast({
        title: 'Formation créée',
        description: `Formation "${newFormation.code}" créée avec succès`,
      });
      return newFormation;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  };

  const updateFormation = async (id: string, formationData: Partial<Formation>) => {
    try {
      const response = await api.put(`/formations/${id}`, formationData);
      const updated = response.data;
      setFormations(prev => prev.map(f => (f.id === id ? updated : f)));
      toast({
        title: 'Formation mise à jour',
        description: `Formation "${updated.code}" mise à jour`,
      });
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      throw error;
    }
  };

  const deleteFormation = async (id: string) => {
    try {
      const formation = formations.find(f => f.id === id);
      await api.delete(`/formations/${id}`);

      setFormations(prev => prev.filter(f => f.id !== id));

      toast({
        title: 'Formation supprimée',
        description: `Formation "${formation?.code}" supprimée avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      throw error;
    }
  };

  return {
    formations,
    loading,
    createFormation,
    updateFormation,
    deleteFormation,
  };
};
