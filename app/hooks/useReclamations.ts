import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

// Créer une instance Axios avec baseURL sûre
const api = axios.create({
  baseURL: typeof window !== "undefined"
    ? "" // côté client, les appels relatifs fonctionnent
    : process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000", // SSR
  timeout: 5000,
});

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
      const response = await api.get("/reclamations");
      const reclamationsData = response.data?.data || [];
      setReclamations(reclamationsData);
    } catch (error: any) {
      console.error("Erreur lors du chargement des réclamations:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de charger les réclamations",
      });
    } finally {
      setLoading(false);
    }
  };

  const createReclamation = async (data: CreateReclamationData) => {
    try {
      await api.post("/reclamations", {
        ...data,
        priorite: data.priorite || "normale",
        statut: "nouvelle",
      });

      toast({
        title: "Réclamation envoyée",
        description:
          "Votre réclamation a été enregistrée avec succès. Nous vous contacterons rapidement.",
      });

      await fetchReclamations();
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la création:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible d'envoyer la réclamation",
      });
      return false;
    }
  };

  const updateReclamation = async (id: string, updates: Partial<Reclamation>) => {
    try {
      await api.put(`/reclamations/${id}`, updates);
      toast({
        title: "Réclamation mise à jour",
        description: "Les modifications ont été sauvegardées",
      });
      await fetchReclamations();
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de mettre à jour la réclamation",
      });
      return false;
    }
  };

  const deleteReclamation = async (id: string) => {
    try {
      await api.delete(`/reclamations/${id}`);
      toast({
        title: "Réclamation supprimée",
        description: "La réclamation a été supprimée avec succès",
      });
      await fetchReclamations();
      return true;
    } catch (error: any) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Impossible de supprimer la réclamation",
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
    fetchReclamations,
    createReclamation,
    updateReclamation,
    deleteReclamation,
  };
};
