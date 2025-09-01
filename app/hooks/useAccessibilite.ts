
import { useState, useEffect } from "react";
import api from "@/services/api";

interface PlanAccessibilite {
  id: string;
  titre: string;
  description: string;
  typeHandicap: string;
  adaptationsPedagogiques: string;
  adaptationsMaterielles: string;
  adaptationsEvaluation: string;
  responsable: string;
  statut: "En cours" | "Validé" | "À réviser";
  dateCreation: Date;
  dateMiseAJour: Date;
}

interface DemandeAccessibilite {
  id: string;
  apprenantNom: string;
  apprenantEmail: string;
  typeHandicap: string;
  besoinsSpecifiques: string;
  documentsMedicaux: boolean;
  statut: "En attente" | "En cours d'analyse" | "Validée" | "Refusée";
  dateCreation: Date;
  commentaires?: string;
}

export const useAccessibilite = () => {
  const [plansAccessibilite, setPlansAccessibilite] = useState<PlanAccessibilite[]>([]);
  const [demandesAccessibilite, setDemandesAccessibilite] = useState<DemandeAccessibilite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Récupérer les plans d'accessibilité via l'API
      const plansResponse = await api.get('/accessibilite/plans');

      // Récupérer les demandes d'accessibilité via l'API
      const demandesResponse = await api.get('/accessibilite/demandes');

      setPlansAccessibilite(plansResponse.data);
      setDemandesAccessibilite(demandesResponse.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données d'accessibilité:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const creerPlanAccessibilite = async (
    planData: Omit<PlanAccessibilite, 'id' | 'dateCreation' | 'dateMiseAJour'>
  ) => {
    try {
      // Créer un plan d'accessibilité via l'API
      const response = await api.post('/accessibilite/plans', {
        titre: planData.titre,
        description: planData.description,
        typeHandicap: planData.typeHandicap,
        adaptationsPedagogiques: planData.adaptationsPedagogiques,
        adaptationsMaterielles: planData.adaptationsMaterielles,
        adaptationsEvaluation: planData.adaptationsEvaluation,
        responsable: planData.responsable,
        statut: planData.statut
      });

      const nouveauPlan = response.data;
      setPlansAccessibilite(prev => [nouveauPlan, ...prev]);
      return nouveauPlan;
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      throw error;
    }
  };

  const traiterDemande = async (
    id: string,
    statut: DemandeAccessibilite['statut'],
    commentaires?: string
  ) => {
    try {
      // Mettre à jour une demande d'accessibilité via l'API
      const response = await api.put(`/accessibilite/demandes/${id}`, {
        statut,
        commentaires
      });

      const updated = response.data;
      setDemandesAccessibilite(prev =>
        prev.map(d => d.id === id ? updated : d)
      );
      return updated;
    } catch (error) {
      console.error("Erreur lors du traitement de la demande:", error);
      throw error;
    }
  };

  return {
    plansAccessibilite,
    demandesAccessibilite,
    loading,
    creerPlanAccessibilite,
    traiterDemande,
  };
};
