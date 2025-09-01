
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export interface ActionCorrective {
  id: string;
  titre: string;
  description: string;
  statut: 'planifiee' | 'en_cours' | 'terminee' | 'annulee';
  origine_type: 'reclamation' | 'incident' | 'audit' | 'veille';
  origine_ref?: string;
  origine_date?: Date;
  origine_resume?: string;
  priorite: 'faible' | 'moyenne' | 'haute' | 'critique';
  avancement: number;
  responsable_nom?: string;
  responsable_email?: string;
  date_echeance?: Date;
  indicateur_efficacite?: string;
  created_at: Date;
  updated_at: Date;
}

export interface DocumentActionCorrective {
  id: string;
  action_corrective_id: string;
  nom: string;
  type: string;
  date_document: Date;
  auteur: string;
  url?: string;
  created_at: Date;
}

export interface HistoriqueActionCorrective {
  id: string;
  action_corrective_id: string;
  date_action: Date;
  action: string;
  utilisateur: string;
  commentaire?: string;
  created_at: Date;
}

export interface CreateActionCorrectiveData {
  titre: string;
  description: string;
  origine_type: 'reclamation' | 'incident' | 'audit' | 'veille';
  origine_ref?: string;
  origine_date?: string;
  origine_resume?: string;
  priorite?: 'faible' | 'moyenne' | 'haute' | 'critique';
  responsable_nom?: string;
  responsable_email?: string;
  date_echeance?: string;
  indicateur_efficacite?: string;
}

export const useActionsCorrectives = () => {
  const [actionsCorrectives, setActionsCorrectives] = useState<ActionCorrective[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchActionsCorrectives = async () => {
    try {
      setLoading(true);
      const response = await api.get('/actions-correctives');

      setActionsCorrectives(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des actions correctives:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les actions correctives",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createActionCorrective = async (data: CreateActionCorrectiveData) => {
    try {
      // Créer l'action corrective via l'API
      await api.post('/actions-correctives', {
        titre: data.titre,
        description: data.description,
        origine_type: data.origine_type,
        origine_ref: data.origine_ref,
        origine_date: data.origine_date,
        origine_resume: data.origine_resume,
        priorite: data.priorite || 'moyenne',
        responsable_nom: data.responsable_nom,
        responsable_email: data.responsable_email,
        date_echeance: data.date_echeance,
        indicateur_efficacite: data.indicateur_efficacite
      });

      toast({
        title: "Action corrective créée",
        description: "L'action corrective a été enregistrée avec succès",
      });

      await fetchActionsCorrectives();
      return true;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer l'action corrective",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateActionCorrective = async (id: string, updates: Partial<ActionCorrective>) => {
    try {
      // Mettre à jour l'action corrective via l'API
      await api.put(`/actions-correctives/${id}`, updates);

      toast({
        title: "Action corrective mise à jour",
        description: "Les modifications ont été sauvegardées",
      });

      await fetchActionsCorrectives();
      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'action corrective",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteActionCorrective = async (id: string) => {
    try {
      await api.delete(`/actions-correctives/${id}`);

      toast({
        title: "Action corrective supprimée",
        description: "L'action corrective a été supprimée avec succès",
      });

      await fetchActionsCorrectives();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer l'action corrective",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchActionsCorrectives();
  }, []);

  return {
    actionsCorrectives,
    loading,
    createActionCorrective,
    updateActionCorrective,
    deleteActionCorrective,
    fetchActionsCorrectives,
  };
};
