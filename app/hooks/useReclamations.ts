
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
  assigneeId?: string;
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
      
      setReclamations(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des réclamations:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les réclamations",
        variant: "destructive",
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
        statut: 'nouvelle' // Valeur par défaut
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
        variant: "destructive",
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
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchReclamations();
  }, []);

  return {
    reclamations,
    loading,
    createReclamation,
    updateReclamation,
    fetchReclamations,
  };
};
