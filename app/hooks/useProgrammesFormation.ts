import { useState, useEffect, useCallback, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { 
  ProgrammeFormation, 
  ProgrammeType, 
  ProgrammeFilters,
  UseProgrammesFormationOptions,
  CategoryInfo,
  ProgrammesByType 
} from "@/types";


export const useProgrammesFormation = (options: UseProgrammesFormationOptions = {}) => {
  const {
    autoFetch = true,
    filterType = null,
    enableCache = true
  } = options;

  // États centralisés
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  
  const { toast } = useToast();

  // Programmes filtrés et mémorisés
  const filteredProgrammes = useMemo(() => {
    if (!filterType) return programmes;
    return programmes.filter(p => p.type === filterType);
  }, [programmes, filterType]);

  const programmesByType = useMemo(() => ({
    catalogue: programmes.filter(p => p.type === "catalogue"),
    personnalise: programmes.filter(p => p.type === "personnalise"),
    all: programmes
  }), [programmes]);

  // Charger les catégories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const categoriesData = await response.json();
      console.log('📂 Categories fetched:', categoriesData?.length || 0, 'items');
      setCategories(categoriesData || []);
      return categoriesData || [];
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      return [];
    }
  }, []);

  // Méthodes CRUD complètes
  const fetchProgrammes = useCallback(async (filters?: ProgrammeFilters) => {
    try {
      console.log('🔄 Hook unifié - Fetching programmes...');
      setLoading(true);
      setError(null);

      let url = '/api/programmes-formation';
      const params = new URLSearchParams();

      if (filters?.type) params.append('type', filters.type);
      if (filters?.categorieId) params.append('categorieId', filters.categorieId);
      if (filters?.search) params.append('search', filters.search);
      if (filters?.estActif !== undefined) params.append('estActif', filters.estActif.toString());

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      const responseData = await response.json();
      console.log('📡 Fetch response:', responseData);
      console.log('📡 Full response structure:', {
        status: response.status,
        hasData: !!responseData,
        dataKeys: Object.keys(responseData || {}),
        dataType: typeof responseData
      });

      const programmesData = responseData.data || [];
      console.log('💾 Setting programmes:', programmesData.length, 'items');
      console.log('💾 Programmes data sample:', programmesData.slice(0, 2));
      setProgrammes(programmesData);

      return programmesData;
    } catch (error: any) {
      console.error('❌ Error fetching programmes:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Erreur de chargement';
      setError(errorMessage);
      if (toast) {
        toast({
          title: 'Erreur',
          description: `Impossible de charger les programmes: ${errorMessage}`,
        });
      }
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createProgramme = useCallback(async (programmeData: Partial<ProgrammeFormation>) => {
    try {
      setLoading(true);

      // Debug: Log des données envoyées côté client
      console.log('🚀 Client - Données à envoyer:', JSON.stringify(programmeData, null, 2));

      const response = await fetch('/api/programmes-formation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programmeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création');
      }

      const responseData = await response.json();
      await fetchProgrammes();

      if (toast) {
        toast({
          title: 'Succès',
          description: 'Programme créé avec succès',
        });
      }
      return responseData;
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur lors de la création';
      if (toast) {
        toast({
          title: 'Erreur',
          description: errorMessage,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProgrammes, toast]);

  const updateProgramme = useCallback(async (id: string, programmeData: Partial<ProgrammeFormation>) => {
    try {
      setLoading(true);

      console.log('🔄 Données envoyées à l\'API:', programmeData);

      const response = await fetch(`/api/programmes-formation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(programmeData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour');
      }

      const responseData = await response.json();
      await fetchProgrammes();

      if (toast) {
        toast({
          title: 'Succès',
          description: 'Programme mis à jour avec succès',
        });
      }
      return responseData;
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur lors de la mise à jour';
      if (toast) {
        toast({
          title: 'Erreur',
          description: errorMessage,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProgrammes, toast]);

  const deleteProgramme = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/programmes-formation/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      await fetchProgrammes();
      if (toast) {
        toast({
          title: 'Succès',
          description: 'Programme supprimé avec succès',
        });
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur lors de la suppression';
      if (toast) {
        toast({
          title: 'Erreur',
          description: errorMessage,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProgrammes, toast]);

  const duplicateProgramme = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/programmes-formation/duplicate/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la duplication');
      }

      const responseData = await response.json();
      await fetchProgrammes();

      if (toast) {
        toast({
          title: 'Succès',
          description: 'Programme dupliqué avec succès',
        });
      }
      return responseData;
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur lors de la duplication';
      if (toast) {
        toast({
          title: 'Erreur',
          description: errorMessage,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProgrammes, toast]);

  const updateProgrammeStatus = useCallback(async (id: string, estActif: boolean) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/programmes-formation/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ estActif: estActif }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la mise à jour du statut');
      }

      const responseData = await response.json();
      await fetchProgrammes();

      if (toast) {
        toast({
          title: 'Succès',
          description: `Programme ${estActif ? 'activé' : 'désactivé'} avec succès`,
        });
      }
      return responseData;
    } catch (error: any) {
      const errorMessage = error?.message || 'Erreur lors de la mise à jour du statut';
      if (toast) {
        toast({
          title: 'Erreur',
          description: errorMessage,
        });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [fetchProgrammes, toast]);

  // Méthodes utilitaires
  const getProgrammeById = useCallback((id: string) => {
    return programmes.find(p => p.id === id);
  }, [programmes]);

  const searchProgrammes = useCallback((query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return programmes.filter(p => 
      p.titre?.toLowerCase().includes(lowercaseQuery) ||
      p.code?.toLowerCase().includes(lowercaseQuery) ||
      p.description?.toLowerCase().includes(lowercaseQuery)
    );
  }, [programmes]);

  const getProgrammesByCategory = useCallback((categorieId: string) => {
    return programmes.filter(p => p.categorieId === categorieId);
  }, [programmes]);

  const getActiveProgrammes = useCallback(() => {
    return programmes.filter(p => p.estActif);
  }, [programmes]);

  const getVisibleProgrammes = useCallback(() => {
    return programmes.filter(p => p.estVisible);
  }, [programmes]);

  // Initialisation au montage
  useEffect(() => {
    console.log('🔄 Hook unifié - useEffect called with:', { autoFetch });
    if (autoFetch) {
      console.log('🔄 Hook unifié - useEffect initial load - calling fetchProgrammes');
      fetchProgrammes().then(() => {
        console.log('✅ fetchProgrammes completed');
      }).catch((err) => {
        console.error('❌ fetchProgrammes failed:', err);
      });
      fetchCategories().then(() => {
        console.log('✅ fetchCategories completed');
      }).catch((err) => {
        console.error('❌ fetchCategories failed:', err);
      });
    } else {
      console.log('🔄 Hook unifié - autoFetch disabled, skipping fetch');
    }
  }, [autoFetch]); // Suppression des dépendances circulaires

  // Retour de l'API complète unifiée
  return {
    // États de base
    programmes: filteredProgrammes,
    allProgrammes: programmes,
    programmesByType,
    loading,
    error,
    categories,
    
    // Méthodes CRUD principales
    fetchProgrammes,
    createProgramme,
    updateProgramme,
    deleteProgramme,
    duplicateProgramme,
    updateProgrammeStatus,
    
    // Méthodes utilitaires de recherche et filtrage
    getProgrammeById,
    searchProgrammes,
    getProgrammesByCategory,
    getActiveProgrammes,
    getVisibleProgrammes,
    
    // Méthodes de gestion des catégories
    fetchCategories,
    
    // Alias pour compatibilité
    refreshProgrammes: fetchProgrammes,
    
    // Méthodes de filtrage avancées
    filterProgrammes: (filters: ProgrammeFilters) => fetchProgrammes(filters)
  };
};

