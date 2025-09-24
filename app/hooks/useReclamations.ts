
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export interface Reclamation {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  statut: 'nouvelle' | 'en_cours' | 'resolue' | 'fermee';
  priorite: 'basse' | 'normale' | 'haute' | 'urgente';
  assignee_id?: string;
  notes_internes?: string;
  date_resolution?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateReclamationData {
  nom: string;
  email: string;
  telephone?: string;
  sujet: string;
  message: string;
  priorite?: 'basse' | 'normale' | 'haute' | 'urgente';
}

export const useReclamations = () => {
  const [reclamations, setReclamations] = useState<Reclamation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReclamations = async () => {
    try {
      setLoading(true);
      const response = await api.get('/reclamations');
      
      // L'API retourne {data: [...], pagination: {...}}
      const reclamationsData = response.data?.data || response.data || [];
      setReclamations(reclamationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des réclamations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réclamations",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReclamation = async (data: CreateReclamationData) => {
    try {
      await api.post('/reclamations', {
        nom: data.nom,
        email: data.email,
        telephone: data.telephone,
        sujet: data.sujet,
        message: data.message,
        priorite: data.priorite || 'normale',
        statut: 'nouvelle' as const // Valeur par défaut
      });

      toast({
        title: "Réclamation envoyée",
        description: "Votre réclamation a été enregistrée avec succès. Nous vous contacterons rapidement.",
      });

      await fetchReclamations();
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la réclamation:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer la réclamation",
      });
      return false;
    }
  };

  const updateReclamation = async (id: string, updates: Partial<Reclamation>) => {
    try {
      // Utiliser directement l'API pour mettre à jour
      await api.put(`/reclamations/${id}`, updates);

      toast({
        title: "Réclamation mise à jour",
        description: "Les modifications ont été sauvegardées",
      });

      await fetchReclamations();
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la réclamation",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  const deleteReclamation = async (id: string) => {
    try {
      await api.delete(`/reclamations/${id}`);

      toast({
        title: "Réclamation supprimée",
        description: "La réclamation a été supprimée avec succès",
      });

      await fetchReclamations();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la réclamation",
      });
      return false;
    }
  };

  return {
    reclamations,
    loading,
    createReclamation,
    updateReclamation,
    deleteReclamation,
    fetchReclamations,
  };
};
