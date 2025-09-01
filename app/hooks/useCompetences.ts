
import { useState, useEffect } from "react";
import { Competence } from "@/types/competence";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export const useCompetences = () => {
  const [competences, setCompetences] = useState<Competence[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Charger toutes les compétences de l'utilisateur connecté
  const fetchCompetences = async () => {
    try {
      setLoading(true);
      const response = await api.get('/competences');
      
      setCompetences(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des compétences:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle compétence
  const createCompetence = async (competenceData: Omit<Competence, "id" | "dateCreation" | "dateModification">) => {
    try {
      // Pour le moment, nous utilisons une valeur temporaire pour formateurId
      const userId = "system"; // Valeur temporaire à remplacer par l'identité de l'utilisateur réel

      try {
        await api.post('/competences', {
          ...competenceData,
          formateurId: userId
        });
      } catch (error) {
        console.error('Erreur lors de la création de la compétence:', error);
        toast({
          title: "Erreur",
          description: "Impossible de créer la compétence",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Compétence créée avec succès",
      });

      await fetchCompetences(); // Recharger la liste
      return true;
    } catch (error) {
      console.error('Erreur lors de la création de la compétence:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return false;
    }
  };

  // Mettre à jour une compétence
  const updateCompetence = async (id: string, competenceData: Omit<Competence, "id" | "dateCreation" | "dateModification">) => {
    try {
      try {
        await api.put(`/competences/${id}`, competenceData);
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la compétence:', error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour la compétence",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Compétence mise à jour avec succès",
      });

      await fetchCompetences(); // Recharger la liste
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la compétence:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return false;
    }
  };

  // Supprimer une compétence
  const deleteCompetence = async (id: string) => {
    try {
      try {
        await api.delete(`/competences/${id}`);
      } catch (error) {
        console.error('Erreur lors de la suppression de la compétence:', error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la compétence",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Succès",
        description: "Compétence supprimée avec succès",
      });

      await fetchCompetences(); // Recharger la liste
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression de la compétence:', error);
      toast({
        title: "Erreur",
        description: "Une erreur inattendue s'est produite",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCompetences();
  }, []);

  return {
    competences,
    loading,
    createCompetence,
    updateCompetence,
    deleteCompetence,
    refetch: fetchCompetences
  };
};
