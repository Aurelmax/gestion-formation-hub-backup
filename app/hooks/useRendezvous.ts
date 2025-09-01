import { useState, useEffect } from 'react';
import api from '@/services/api';
import { ApiResponse } from '@/types';

// Interface pour le modèle unifié de rendez-vous
export interface Rendezvous {
  id: string;
  statut: string; // 'nouveau', 'rdv_planifie', 'termine', 'annule', 'impact'
  type?: string; // 'standard', 'impact'
  
  // Informations personnelles
  nomBeneficiaire: string;
  prenomBeneficiaire: string;
  emailBeneficiaire: string;
  telephoneBeneficiaire?: string;
  
  // Informations pédagogiques
  objectifs?: string[];
  niveauBeneficiaire?: string;
  situationActuelle?: string;
  attentes?: string;
  pratiqueActuelle?: string;
  
  // Informations de rendez-vous
  canal?: string;
  dateRdv?: string | Date;
  synthese?: string;
  
  // Informations de formation
  formationSelectionnee?: string;
  
  // Disponibilités
  dateDispo?: string;
  modaliteFormation?: string;
  
  // Financement
  isFinancement?: boolean;
  typeFinancement?: string;
  
  // Handicap
  hasHandicap?: boolean;
  detailsHandicap?: string;
  besoinHandicap?: string;
  
  // Entreprise
  entreprise?: string;
  siret?: string;
  adresseEntreprise?: string;
  interlocuteurNom?: string;
  interlocuteurFonction?: string;
  interlocuteurEmail?: string;
  interlocuteurTelephone?: string;
  organismeFinanceur?: string;
  
  // Commentaires
  commentaires?: string;
  
  // Informations d'impact (pour les rendez-vous de type impact)
  dateImpact?: string | Date;
  satisfactionImpact?: number;
  competencesAppliquees?: string;
  ameliorationsSuggeres?: string;
  commentairesImpact?: string;
  rendezvousParentId?: string;
  
  // Compétences du bénéficiaire (pour la génération de programme)
  competencesActuelles?: string;
  competencesRecherchees?: string;
  
  // Métadonnées
  dateContact?: string | Date;
  dateDebutSouhaitee?: string | Date;
  dateFinSouhaitee?: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface RendezvousFormData {
  // Informations personnelles
  nomBeneficiaire: string;
  prenomBeneficiaire: string;
  emailBeneficiaire: string;
  telephoneBeneficiaire?: string;
  
  // Informations sur la formation
  formationSelectionnee?: string;
  niveauBeneficiaire?: string;
  situationActuelle?: string;
  attentes?: string;
  pratiqueActuelle?: string;
  objectifs?: string[];
  
  // Informations sur le rendez-vous
  dateRdv?: string | Date;
  canal?: string;
  synthese?: string;
  commentaires?: string;
  dateDispo?: string;
  modaliteFormation?: string;
  
  // Informations sur l'entreprise
  entreprise?: string;
  siret?: string;
  adresseEntreprise?: string;
  interlocuteurNom?: string;
  interlocuteurFonction?: string;
  interlocuteurEmail?: string;
  interlocuteurTelephone?: string;
  
  // Informations sur le handicap
  hasHandicap?: boolean;
  detailsHandicap?: string;
  besoinHandicap?: string;
  
  // Informations sur le financement
  isFinancement?: boolean;
  typeFinancement?: string;
  organismeFinanceur?: string;
}

/**
 * Interface pour les données d'évaluation d'impact
 */
export interface ImpactEvaluationData {
  satisfactionImpact: number;
  competencesAppliquees?: string;
  ameliorationsSuggeres?: string;
  commentairesImpact?: string;
}

export interface UseRendezvousReturn {
  rendezvous: Rendezvous[];
  loading: boolean;
  error: string | null;
  fetchRendezvous: (statut?: string, type?: string) => Promise<void>;
  createRendezvous: (data: RendezvousFormData) => Promise<Rendezvous>;
  updateRendezvous: (id: string, data: Partial<Rendezvous>) => Promise<Rendezvous>;
  updateRendezvousStatut: (id: string, statut: string) => Promise<Rendezvous>;
  validerRendezvous: (id: string, formatRdv?: string, dateRdv?: string) => Promise<Rendezvous>;
  deleteRendezvous: (id: string) => Promise<void>;
  // Actions sur les rendez-vous
  annulerRendezvous: (id: string, raison?: string) => Promise<Rendezvous>;
  reprogrammerRendezvous: (id: string, nouvelleDateRdv: string, formatRdv?: string) => Promise<Rendezvous>;
  // Fonctions pour la gestion du compte rendu et des programmes
  editerCompteRendu: (id: string, synthese: string, notes?: string) => Promise<Rendezvous>;
  genererProgrammeEtDossier: (id: string) => Promise<{programmeId: string; dossierId: string}>;
  // Fonctions pour les rendez-vous d'impact
  planifierImpact: (id: string, dateImpact?: string) => Promise<Rendezvous>;
  completerEvaluationImpact: (id: string, evaluationData: ImpactEvaluationData) => Promise<Rendezvous>;
  saveImpactEvaluation: (id: string, evaluationData: {satisfactionImpact?: number; competencesAppliquees?: string; ameliorationsSuggeres?: string; commentairesImpact?: string;}) => Promise<Rendezvous>;
  terminerImpact: (id: string) => Promise<Rendezvous>;
  genererRapportImpact: (id: string) => Promise<{rapportUrl: string}>;
}

/**
 * Hook pour gérer les rendez-vous (unification des demandes de positionnement et rendez-vous planifiés)
 */
export const useRendezvous = (): UseRendezvousReturn => {
  const [rendezvous, setRendezvous] = useState<Rendezvous[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // L'interface ImpactEvaluationData a été déplacée au niveau du fichier
  
  const fetchRendezvous = async (statut?: string, type?: string) => {
    setLoading(true);
    setError(null);
    try {
      // Construction de l'URL avec filtrage optionnel par statut et/ou type
      let url = '/api/rendezvous';
      const params = [];
      
      if (statut) params.push(`statut=${encodeURIComponent(statut)}`);
      if (type) params.push(`type=${encodeURIComponent(type)}`);
      
      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const response = await api.get<ApiResponse<Rendezvous[]>>(url);

      // Traitement de la réponse en fonction de sa structure
      if (response.data && Array.isArray(response.data)) {
        setRendezvous(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setRendezvous(response.data.data);
      } else {
        console.error('Structure de réponse API inattendue:', response.data);
        setRendezvous([]);
        setError('Format de réponse invalide');
      }
    } catch (err) {
      console.error('Erreur lors du chargement des rendez-vous:', err);
      setError('Impossible de charger les rendez-vous');
      setRendezvous([]);
    } finally {
      setLoading(false);
    }
  };

  const createRendezvous = async (data: RendezvousFormData): Promise<Rendezvous> => {
    try {
      const response = await api.post<ApiResponse<Rendezvous>>('/api/rendezvous', data);
      const newRendezvous = Array.isArray(response.data) ? response.data[0] : response.data;
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return newRendezvous as Rendezvous;
    } catch (err) {
      console.error('Erreur lors de la création du rendez-vous:', err);
      throw new Error('Impossible de créer le rendez-vous');
    }
  };

  const updateRendezvous = async (id: string, data: Partial<Rendezvous>): Promise<Rendezvous> => {
    try {
      const response = await api.put<ApiResponse<Rendezvous>>(`/api/rendezvous/${id}`, data);
      const updatedRendezvous = Array.isArray(response.data) ? response.data[0] : response.data;
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRendezvous as Rendezvous;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du rendez-vous:', err);
      throw new Error('Impossible de mettre à jour le rendez-vous');
    }
  };

  const updateRendezvousStatut = async (id: string, statut: string): Promise<Rendezvous> => {
    try {
      const response = await api.put<ApiResponse<Rendezvous>>(`/api/rendezvous/${id}/statut`, { statut });
      const updatedRendezvous = Array.isArray(response.data) ? response.data[0] : response.data;
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRendezvous as Rendezvous;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      throw new Error('Impossible de mettre à jour le statut du rendez-vous');
    }
  };

  const deleteRendezvous = async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/rendezvous/${id}`);
      // Mettre à jour la liste locale
      await fetchRendezvous();
    } catch (err) {
      console.error('Erreur lors de la suppression du rendez-vous:', err);
      throw new Error('Impossible de supprimer le rendez-vous');
    }
  };

  /**
   * Valide un rendez-vous en un clic en utilisant l'endpoint de validation
   * @param id - ID du rendez-vous à valider
   * @param formatRdv - Format du RDV (visio, presentiel, etc.)
   * @param dateRdv - Date du RDV (si fournie)
   * @returns Le rendez-vous mis à jour
   */
  // La fonction planifierImpact est définie plus bas dans le fichier

  const validerRendezvous = async (id: string, formatRdv?: string, dateRdv?: string): Promise<Rendezvous> => {
    try {
      const response = await api.put<ApiResponse<Rendezvous>>(
        `/api/rendezvous/${id}/valider`, 
        { formatRdv, dateRdv }
      );
      
      // Gestion des différents formats de réponse possibles de l'API
      let updatedRendezvous;
      if (Array.isArray(response.data)) {
        updatedRendezvous = response.data[0];
      } else if (response.data && typeof response.data === 'object') {
        // Si la réponse contient directement un objet avec les données du rendez-vous
        updatedRendezvous = response.data;
      } else {
        console.error('Format de réponse inattendu:', response.data);
        throw new Error('Format de réponse invalide');
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRendezvous as Rendezvous;
    } catch (err) {
      console.error('Erreur lors de la validation du rendez-vous:', err);
      throw new Error('Impossible de valider le rendez-vous');
    }
  };

  /**
   * Planifie un rendez-vous d'impact à partir d'un rendez-vous terminé
   * @param id - ID du rendez-vous terminé
   * @param dateImpact - Date du rendez-vous d'impact (optionnel, par défaut +6 mois)
   * @returns Le nouveau rendez-vous d'impact créé
   */
  const planifierImpact = async (id: string, dateImpact?: string): Promise<Rendezvous> => {
    try {
      const response = await api.post<ApiResponse<{rendezvous: Rendezvous}>>(
        `/api/rendezvous/${id}/impact/planifier`, 
        { dateImpact }
      );
      
      let newImpactRdv: Rendezvous;
      if (response.data && 'rendezvous' in response.data) {
        newImpactRdv = response.data.rendezvous as Rendezvous;
      } else if (Array.isArray(response.data) && response.data[0]) {
        newImpactRdv = response.data[0] as Rendezvous;
      } else {
        // Si la réponse est directement un objet, supposons que c'est le rendez-vous
        newImpactRdv = response.data as unknown as Rendezvous;
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return newImpactRdv as Rendezvous;
    } catch (err) {
      console.error('Erreur lors de la planification du rendez-vous d\'impact:', err);
      throw new Error('Impossible de planifier le rendez-vous d\'impact');
    }
  };

  /**
   * Complète l'évaluation d'un rendez-vous d'impact
   * @param id - ID du rendez-vous d'impact
   * @param evaluationData - Données d'évaluation
   * @returns Le rendez-vous d'impact mis à jour
   */
  const completerEvaluationImpact = async (id: string, evaluationData: ImpactEvaluationData): Promise<Rendezvous> => {
    try {
      const response = await api.put<ApiResponse<{rendezvous: Rendezvous}>>(
        `/api/rendezvous/${id}/impact/evaluation`, 
        evaluationData
      );
      
      let updatedRendezvous: Rendezvous;
      if (response.data && 'rendezvous' in response.data) {
        updatedRendezvous = response.data.rendezvous as Rendezvous;
      } else if (Array.isArray(response.data) && response.data[0]) {
        updatedRendezvous = response.data[0] as Rendezvous;
      } else {
        // Si la réponse est directement un objet, supposons que c'est le rendez-vous
        updatedRendezvous = response.data as unknown as Rendezvous;
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRendezvous as Rendezvous;
    } catch (err) {
      console.error('Erreur lors de la complétion de l\'évaluation d\'impact:', err);
      throw new Error('Impossible de compléter l\'évaluation d\'impact');
    }
  };

  /**
   * Termine un rendez-vous d'impact
   * @param id - ID du rendez-vous d'impact
   * @returns Le rendez-vous d'impact mis à jour
   */
  const terminerImpact = async (id: string): Promise<Rendezvous> => {
    try {
      const response = await api.put<ApiResponse<{rendezvous: Rendezvous}>>(
        `/api/rendezvous/${id}/impact/terminer`
      );
      
      let updatedRendezvous: Rendezvous;
      if (response.data && 'rendezvous' in response.data) {
        updatedRendezvous = response.data.rendezvous as Rendezvous;
      } else if (Array.isArray(response.data) && response.data[0]) {
        updatedRendezvous = response.data[0] as Rendezvous;
      } else {
        // Si la réponse est directement un objet, supposons que c'est le rendez-vous
        updatedRendezvous = response.data as unknown as Rendezvous;
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRendezvous as Rendezvous;
    } catch (err) {
      console.error('Erreur lors de la clôture du rendez-vous d\'impact:', err);
      throw new Error('Impossible de terminer le rendez-vous d\'impact');
    }
  };

  /**
   * Génère un rapport d'impact pour un rendez-vous d'impact
   * @param id - ID du rendez-vous d'impact
   * @returns URL du rapport généré
   */
  const genererRapportImpact = async (id: string): Promise<{rapportUrl: string}> => {
    try {
      const response = await api.get<ApiResponse<{rapportUrl: string}>>(
        `/api/rendezvous/${id}/impact/rapport`
      );
      
      let result: {rapportUrl: string};
      if (response.data && typeof response.data === 'object' && 'rapportUrl' in response.data) {
        result = { rapportUrl: String(response.data.rapportUrl) };
      } else if (Array.isArray(response.data) && response.data[0] && typeof response.data[0] === 'object' && 'rapportUrl' in response.data[0]) {
        result = { rapportUrl: String((response.data[0] as {rapportUrl: unknown}).rapportUrl) };
      } else if (response.data && typeof response.data === 'object' && 'message' in response.data && response.data.message && 
                typeof response.data.message === 'object' && 'rapportUrl' in (response.data.message as object)) {
        result = { rapportUrl: String(((response.data.message as {rapportUrl: unknown}).rapportUrl)) };
      } else {
        // Fallback si le format de réponse est différent
        result = { rapportUrl: '/api/rapports/default.pdf' };
      }
      
      return result;
    } catch (err) {
      console.error('Erreur lors de la génération du rapport d\'impact:', err);
      throw new Error('Impossible de générer le rapport d\'impact');
    }
  };

  /**
   * Annule un rendez-vous existant
   * @param id - ID du rendez-vous à annuler
   * @param raison - Raison optionnelle de l'annulation
   * @returns Le rendez-vous mis à jour avec le statut 'annule'
   */
  const annulerRendezvous = async (id: string, raison?: string): Promise<Rendezvous> => {
    try {
      const response = await api.post<ApiResponse<Rendezvous>>(
        `/api/rendezvous/${id}/annuler`, 
        { raison }
      );
      
      let updatedRdv: Rendezvous;
      if (Array.isArray(response.data) && response.data[0]) {
        updatedRdv = response.data[0] as Rendezvous;
      } else {
        updatedRdv = response.data as unknown as Rendezvous;
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRdv;
    } catch (err) {
      console.error('Erreur lors de l\'annulation du rendez-vous:', err);
      throw new Error('Impossible d\'annuler le rendez-vous');
    }
  };

  /**
   * Reprogramme un rendez-vous existant
   * @param id - ID du rendez-vous à reprogrammer
   * @param nouvelleDateRdv - Nouvelle date du rendez-vous
   * @param formatRdv - Format optionnel du rendez-vous (visio, présentiel, etc.)
   * @returns Le rendez-vous mis à jour avec la nouvelle date
   */
  const reprogrammerRendezvous = async (
    id: string, 
    nouvelleDateRdv: string, 
    formatRdv?: string
  ): Promise<Rendezvous> => {
    try {
      const response = await api.post<ApiResponse<Rendezvous>>(
        `/api/rendezvous/${id}/reprogrammer`, 
        { dateRdv: nouvelleDateRdv, formatRdv }
      );
      
      let updatedRdv: Rendezvous;
      if (Array.isArray(response.data) && response.data[0]) {
        updatedRdv = response.data[0] as Rendezvous;
      } else {
        updatedRdv = response.data as unknown as Rendezvous;
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRdv;
    } catch (err) {
      console.error('Erreur lors de la reprogrammation du rendez-vous:', err);
      throw new Error('Impossible de reprogrammer le rendez-vous');
    }
  };

  /**
   * Enregistre l'évaluation d'impact pour un rendez-vous d'impact
   * @param id - ID du rendez-vous d'impact
   * @param evaluationData - Données d'évaluation d'impact
   * @returns Le rendez-vous mis à jour avec les données d'évaluation
   */
  const saveImpactEvaluation = async (id: string, evaluationData: {
    satisfactionImpact?: number;
    competencesAppliquees?: string;
    ameliorationsSuggeres?: string;
    commentairesImpact?: string;
  }): Promise<Rendezvous> => {
    try {
      const response = await api.post<ApiResponse<Rendezvous>>(
        `/api/rendezvous/${id}/impact/evaluation`, 
        evaluationData
      );
      
      let updatedRdv: Rendezvous;
      if (Array.isArray(response.data) && response.data[0]) {
        updatedRdv = response.data[0] as Rendezvous;
      } else {
        updatedRdv = response.data as unknown as Rendezvous;
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRdv;
    } catch (err) {
      console.error('Erreur lors de l\'enregistrement de l\'évaluation d\'impact:', err);
      throw new Error('Impossible d\'enregistrer l\'évaluation d\'impact');
    }
  };

  // Charger les rendez-vous au montage du composant
  useEffect(() => {
    fetchRendezvous();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Éditer le compte rendu d'un rendez-vous traité
   * @param id - ID du rendez-vous
   * @param synthese - Synthèse du rendez-vous (compte rendu principal)
   * @param notes - Notes additionnelles (optionnel)
   * @returns Le rendez-vous mis à jour
   */
  const editerCompteRendu = async (id: string, synthese: string, notes?: string): Promise<Rendezvous> => {
    try {
      const response = await api.put<ApiResponse<Rendezvous>>(
        `/api/rendezvous/${id}/compte-rendu`, 
        { synthese, notes }
      );
      
      let updatedRdv: Rendezvous;
      if (Array.isArray(response.data) && response.data[0]) {
        updatedRdv = response.data[0] as Rendezvous;
      } else {
        updatedRdv = response.data as unknown as Rendezvous;
      }
      
      // Mettre à jour la liste locale
      await fetchRendezvous();
      return updatedRdv;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du compte rendu:', err);
      throw new Error('Impossible de mettre à jour le compte rendu');
    }
  };

  /**
   * Générer un programme personnalisé et un dossier à partir d'un rendez-vous
   * @param id - ID du rendez-vous pour lequel générer un programme et un dossier
   * @returns Les identifiants du programme et du dossier créés
   */
  const genererProgrammeEtDossier = async (id: string): Promise<{programmeId: string; dossierId: string}> => {
    try {
      const response = await api.post<{programmeId: string; dossierId: string}>(
        `/api/rendezvous/${id}/generer-programme`
      );
      
      if (response.data && 'programmeId' in response.data && 'dossierId' in response.data) {
        // Mettre à jour la liste locale pour refléter les changements
        await fetchRendezvous();
        return {
          programmeId: response.data.programmeId,
          dossierId: response.data.dossierId
        };
      }
      
      throw new Error('Format de réponse incorrect');
    } catch (err) {
      console.error('Erreur lors de la génération du programme et du dossier:', err);
      throw new Error('Impossible de générer le programme et le dossier');
    }
  };

  return {
    rendezvous,
    loading,
    error,
    fetchRendezvous,
    createRendezvous,
    updateRendezvous,
    updateRendezvousStatut,
    validerRendezvous,
    deleteRendezvous,
    // Fonctions pour les rendez-vous d'impact
    planifierImpact,
    completerEvaluationImpact,
    terminerImpact,
    genererRapportImpact,
    // Actions sur les rendez-vous
    annulerRendezvous,
    reprogrammerRendezvous,
    saveImpactEvaluation,
    // Nouvelles fonctions pour la gestion du compte rendu et des programmes
    editerCompteRendu,
    genererProgrammeEtDossier,
  };
};

export default useRendezvous;
