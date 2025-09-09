
import { useState, useEffect } from "react";
import api from "@/services/api";

interface PlanAccessibilite {
  id: string;
  titre: string;
  description: string;
  dateCreation: Date;
  dateModification: Date;
  actionsRequises: string[];
  statut: string;
}

interface DemandeAccessibilite {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  description: string;
  dateCreation: Date;
  statut: string;
  reponse?: string;
  dateResolution?: Date;
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

      // Convertir les dates string en objets Date
      const plansFormates = plansResponse.data.map((plan: any) => ({
        ...plan,
        dateCreation: new Date(plan.dateCreation),
        dateModification: new Date(plan.dateModification)
      }));

      const demandesFormatees = demandesResponse.data.map((demande: any) => ({
        ...demande,
        dateCreation: new Date(demande.dateCreation),
        dateResolution: demande.dateResolution ? new Date(demande.dateResolution) : undefined
      }));

      setPlansAccessibilite(plansFormates);
      setDemandesAccessibilite(demandesFormatees);
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
    planData: Omit<PlanAccessibilite, 'id' | 'dateCreation' | 'dateModification'>
  ) => {
    try {
      // Créer un plan d'accessibilité via l'API
      const response = await api.post('/accessibilite/plans', {
        titre: planData.titre,
        description: planData.description,
        actionsRequises: planData.actionsRequises,
        statut: planData.statut
      });

      const nouveauPlan = {
        ...response.data,
        dateCreation: new Date(response.data.dateCreation),
        dateModification: new Date(response.data.dateModification)
      };
      setPlansAccessibilite(prev => [nouveauPlan, ...prev]);
      return nouveauPlan;
    } catch (error) {
      console.error('Erreur lors de la création du plan:', error);
      throw error;
    }
  };

  const traiterDemande = async (
    id: string,
    statut: string,
    reponse?: string
  ) => {
    try {
      // Mettre à jour une demande d'accessibilité via l'API
      const response = await api.put(`/accessibilite/demandes/${id}`, {
        statut,
        reponse
      });

      const updated = {
        ...response.data,
        dateCreation: new Date(response.data.dateCreation),
        dateResolution: response.data.dateResolution ? new Date(response.data.dateResolution) : undefined
      };
      setDemandesAccessibilite(prev =>
        prev.map(d => d.id === id ? updated : d)
      );
      return updated;
    } catch (error) {
      console.error("Erreur lors du traitement de la demande:", error);
      throw error;
    }
  };

  const creerDemandeAccessibilite = async (
    demandeData: Omit<DemandeAccessibilite, 'id' | 'dateCreation' | 'dateResolution'>
  ) => {
    try {
      const response = await api.post('/accessibilite/demandes', demandeData);
      const nouvelleDemande = {
        ...response.data,
        dateCreation: new Date(response.data.dateCreation),
        dateResolution: response.data.dateResolution ? new Date(response.data.dateResolution) : undefined
      };
      setDemandesAccessibilite(prev => [nouvelleDemande, ...prev]);
      return nouvelleDemande;
    } catch (error) {
      console.error('Erreur lors de la création de la demande:', error);
      throw error;
    }
  };

  const supprimerPlanAccessibilite = async (id: string) => {
    try {
      await api.delete(`/accessibilite/plans/${id}`);
      setPlansAccessibilite(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression du plan:', error);
      throw error;
    }
  };

  const supprimerDemandeAccessibilite = async (id: string) => {
    try {
      await api.delete(`/accessibilite/demandes/${id}`);
      setDemandesAccessibilite(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Erreur lors de la suppression de la demande:', error);
      throw error;
    }
  };

  return {
    plansAccessibilite,
    demandesAccessibilite,
    loading,
    creerPlanAccessibilite,
    creerDemandeAccessibilite,
    traiterDemande,
    supprimerPlanAccessibilite,
    supprimerDemandeAccessibilite,
    fetchData
  };
};
