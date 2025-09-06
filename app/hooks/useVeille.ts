import { useState, useEffect, useCallback } from 'react';
import { Veille, TypeVeille, StatutVeille } from '@/types/veille';

export function useVeille() {
  const [veilles, setVeilles] = useState<Veille[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les veilles
  const fetchVeilles = useCallback(async (type?: TypeVeille, statut?: StatutVeille) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (type) params.append('type', type);
      if (statut) params.append('statut', statut);

      const response = await fetch(`/api/veille?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des veilles');
      }

      const data = await response.json();
      
      // Transformer les dates string en objets Date
      const veillesFormatees = data.map((veille: any) => ({
        ...veille,
        dateCreation: new Date(veille.dateCreation),
        dateEcheance: veille.dateEcheance ? new Date(veille.dateEcheance) : undefined
      }));

      setVeilles(veillesFormatees);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Erreur lors du chargement des veilles:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer une nouvelle veille
  const createVeille = useCallback(async (nouvelleVeille: Omit<Veille, "id" | "dateCreation" | "commentaires" | "documents" | "historique">) => {
    try {
      const response = await fetch('/api/veille', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...nouvelleVeille,
          dateEcheance: nouvelleVeille.dateEcheance?.toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la veille');
      }

      const data = await response.json();
      const veilleFormatee = {
        ...data,
        dateCreation: new Date(data.dateCreation),
        dateEcheance: data.dateEcheance ? new Date(data.dateEcheance) : undefined
      };

      setVeilles(prev => [veilleFormatee, ...prev]);
      return veilleFormatee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  }, []);

  // Mettre à jour le statut d'une veille
  const updateStatut = useCallback(async (id: string, statut: StatutVeille) => {
    try {
      const response = await fetch(`/api/veille/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ statut }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du statut');
      }

      const data = await response.json();
      const veilleFormatee = {
        ...data,
        dateCreation: new Date(data.dateCreation),
        dateEcheance: data.dateEcheance ? new Date(data.dateEcheance) : undefined
      };

      setVeilles(prev => prev.map(v => v.id === id ? veilleFormatee : v));
      return veilleFormatee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  }, []);

  // Mettre à jour l'avancement d'une veille
  const updateAvancement = useCallback(async (id: string, avancement: number) => {
    try {
      const response = await fetch(`/api/veille/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ avancement }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de l\'avancement');
      }

      const data = await response.json();
      const veilleFormatee = {
        ...data,
        dateCreation: new Date(data.dateCreation),
        dateEcheance: data.dateEcheance ? new Date(data.dateEcheance) : undefined
      };

      setVeilles(prev => prev.map(v => v.id === id ? veilleFormatee : v));
      return veilleFormatee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  }, []);

  // Ajouter un commentaire à une veille
  const addCommentaire = useCallback(async (id: string, contenu: string) => {
    try {
      const response = await fetch(`/api/veille/${id}/commentaire`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contenu }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du commentaire');
      }

      // Recharger la veille pour avoir les données à jour
      await fetchVeilles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  }, [fetchVeilles]);

  // Mettre à jour une veille complètement
  const updateVeille = useCallback(async (id: string, veilleData: Partial<Omit<Veille, "id" | "dateCreation" | "commentaires" | "documents" | "historique">>) => {
    try {
      const response = await fetch(`/api/veille/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(veilleData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour de la veille');
      }

      const veilleUpdated = await response.json();
      
      // Transformer les dates
      const veilleFormatee = {
        ...veilleUpdated,
        dateCreation: new Date(veilleUpdated.dateCreation),
        dateEcheance: veilleUpdated.dateEcheance ? new Date(veilleUpdated.dateEcheance) : undefined
      };

      setVeilles(prev => prev.map(v => v.id === id ? veilleFormatee : v));
      
      return veilleFormatee;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  }, []);

  // Supprimer une veille
  const deleteVeille = useCallback(async (id: string) => {
    try {
      const response = await fetch(`/api/veille/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la veille');
      }

      setVeilles(prev => prev.filter(v => v.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      throw err;
    }
  }, []);

  // Charger les veilles au montage du composant
  useEffect(() => {
    fetchVeilles();
  }, [fetchVeilles]);

  return {
    veilles,
    loading,
    error,
    fetchVeilles,
    createVeille,
    updateVeille,
    updateStatut,
    updateAvancement,
    addCommentaire,
    deleteVeille
  };
}