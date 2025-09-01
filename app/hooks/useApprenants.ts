
import { useState, useEffect } from "react";
import api from "@/services/api";

interface Apprenant {
  id: string;
  nom: string;
  email: string;
  telephone?: string;
  createdAt: Date;
}

export const useApprenants = () => {
  const [apprenants, setApprenants] = useState<Apprenant[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprenants = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/apprenants');
      setApprenants(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des apprenants:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprenants();
  }, []);

  const createApprenant = async (
    apprenantData: Omit<Apprenant, 'id' | 'createdAt'>
  ) => {
    try {
      const response = await api.post('/api/apprenants', apprenantData);
      const newApprenant = response.data;
      setApprenants(prev => [newApprenant, ...prev]);
      return newApprenant;
    } catch (error) {
      console.error('Erreur lors de la création de l\'apprenant:', error);
      throw error;
    }
  };

  const updateApprenant = async (id: string, apprenantData: Partial<Apprenant>) => {
    try {
      const response = await api.put(`/api/apprenants/${id}`, apprenantData);
      const updated = response.data;
      setApprenants(prev => prev.map(a => (a.id === id ? updated : a)));
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'apprenant:', error);
      throw error;
    }
  };

  return {
    apprenants,
    loading,
    createApprenant,
    updateApprenant,
  };
};
