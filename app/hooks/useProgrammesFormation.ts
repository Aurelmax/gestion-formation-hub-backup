/**
 * Hook personnalisé pour gérer les programmes de formation
 * 
 * Ce hook fournit une interface complète pour gérer les programmes de formation,
 * y compris le chargement, la création, la mise à jour, la suppression et la duplication
 * des programmes, ainsi que la gestion des catégories et des filtres.
 * 
 * @example
 * // Utilisation de base
 * const {
 *   programmes,
 *   loading,
 *   error,
 *   fetchProgrammes,
 *   createProgramme,
 *   updateProgramme,
 *   deleteProgramme,
 *   duplicateProgramme,
 *   updateProgrammeStatus,
 *   categories,
 *   fetchCategories,
 *   getProgrammesByCategorie,
 *   getProgrammesByType
 * } = useProgrammesFormation();
 * 
 * // Charger les programmes et catégories au montage du composant
 * useEffect(() => {
 *   fetchProgrammes();
 *   fetchCategories();
 * }, []);
 * 
 * // Filtrer les programmes par catégorie
 * const programmesFiltres = getProgrammesByCategorie('categorie-id');
 * 
 * // Créer un nouveau programme
 * const handleCreate = async () => {
 *   try {
 *     const nouveauProgramme = await createProgramme({
 *       code: 'NCODE',
 *       type: 'catalogue',
 *       titre: 'Nouveau programme',
 *       description: 'Description du programme',
 *       // ... autres champs requis
 *     });
 *     console.log('Programme créé:', nouveauProgramme);
 *   } catch (error) {
 *     console.error('Erreur lors de la création:', error);
 *   }
 * };
 */
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { ApiError, ApiResponse } from "@/types";
import { z } from 'zod';

// Hook connecté aux vraies APIs - Données mockées supprimées

// Interface pour les programmes de formation unifiés
export interface ProgrammeFormation {
  id: string;
  code: string;
  type: "catalogue" | "personnalise"; // Type du programme (catalogue ou personnalisé)
  titre: string;
  description: string;
  
  // Champs descriptifs
  niveau: string;
  participants: string;
  duree: string;
  prix: string;
  objectifs: string[];
  prerequis: string;
  modalites: string;
  
  // Champs réglementaires
  publicConcerne: string;
  contenuDetailleJours: string;
  modalitesAcces: string;
  modalitesTechniques: string;
  modalitesReglement: string;
  formateur: string;
  ressourcesDisposition: string;
  modalitesEvaluation: string;
  sanctionFormation: string;
  niveauCertification: string;
  delaiAcceptation: string;
  accessibiliteHandicap: string;
  cessationAbandon: string;
  
  // Champs spécifiques aux programmes personnalisés
  beneficiaireId: string | null; // ID de l'apprenant pour programmes personnalisés
  objectifsSpecifiques: string | null; // Objectifs adaptés pour programmes personnalisés
  positionnementRequestId: string | null; // Lien vers demande de positionnement
  programmeCatalogueId: string | null; // Référence vers le programme catalogue source
  programmeCatalogue?: ProgrammeFormation; // Programme catalogue d'origine (si personnalisé)
  
  // URL vers le programme HTML
  programmeUrl: string | null;
  programme?: string; // Contenu détaillé du programme au format HTML ou texte
  contenuDetailleHtml?: string; // Contenu détaillé au format HTML
  
  // Catégorie
  categorieId: string | null;
  categorie?: {
    id: string;
    code: string;
    titre: string;
    description: string;
  };
  
  // Style
  pictogramme: string;
  
  // Statut
  estActif?: boolean;
  version?: string;
  typeProgramme?: string;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
}

// Schéma de validation pour les programmes
const programmeSchema = z.object({
  code: z.string().min(1, 'Le code est requis'),
  titre: z.string().min(1, 'Le titre est requis'),
  description: z.string().optional(),
  type: z.enum(['catalogue', 'personnalise']),
  duree: z.number().int().positive('La durée doit être un nombre positif').optional(),
  prix: z.number().min(0, 'Le prix ne peut pas être négatif').optional(),
  categorieId: z.string().uuid('ID de catégorie invalide').optional().nullable(),
  objectifs: z.array(z.string()).optional(),
  prerequis: z.string().optional(),
  modalites: z.string().optional(),
  estActif: z.boolean().default(true)
});

// Schéma de validation pour les paramètres de requête
const queryParamsSchema = z.object({
  type: z.enum(['catalogue', 'personnalise']).optional(),
  version: z.string().regex(/^\d+$/).optional(),
  fields: z.string().optional().transform(fields => 
    fields ? fields.split(',').map(f => f.trim()) : []
  ),
  categorieId: z.string().uuid('ID de catégorie invalide').optional(),
  estActif: z.preprocess(
    val => val === 'true' || val === true,
    z.boolean().optional()
  ),
  search: z.string().optional(),
  page: z.preprocess(
    val => Number(val) || 1,
    z.number().int().positive()
  ).default(1),
  limit: z.preprocess(
    val => Number(val) || 20,
    z.number().int().min(1).max(100)
  ).default(20)
});

type QueryParams = z.infer<typeof queryParamsSchema>;

export const useProgrammesFormation = () => {
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [categories, setCategories] = useState<Array<{
    id: string;
    code: string;
    titre: string;
    description: string;
    ordre: number;
  }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchProgrammes = async (params: Partial<QueryParams> = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Valider les paramètres
      const validatedParams = queryParamsSchema.safeParse(params);
      
      if (!validatedParams.success) {
        const errorMessage = 'Paramètres de requête invalides: ' + 
          validatedParams.error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ');
        
        toast({
          title: 'Erreur de validation',
          description: errorMessage
        });
        
        throw new Error(errorMessage);
      }

      const { data } = validatedParams;
      
      // Construire les paramètres de requête
      const queryParams = new URLSearchParams();
      
      if (data.type) queryParams.set('type', data.type);
      if (data.categorieId) queryParams.set('categorieId', data.categorieId);
      if (data.estActif !== undefined) queryParams.set('estActif', String(data.estActif));
      if (data.search) queryParams.set('search', data.search);
      if (data.page) queryParams.set('page', String(data.page));
      if (data.limit) queryParams.set('limit', String(data.limit));
      if (data.fields?.length) queryParams.set('fields', data.fields.join(','));

      const response = await api.get(`/api/programmes-formation?${queryParams.toString()}`, {
        validateStatus: (status) => status < 500
      });

      // Gérer les erreurs HTTP
      if (response.status >= 400) {
        const errorMessage = response.data?.error || `Erreur ${response.status}`;
        throw new Error(errorMessage);
      }

      // Mettre à jour le cache local
      setProgrammes(response.data.data || []);
      
      return response.data;
      
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Une erreur inattendue est survenue';
      
      toast({
        title: 'Erreur',
        description: `Impossible de charger les programmes: ${errorMessage}`
      });
      
      setError(errorMessage);
      throw error;
      
    } finally {
      setLoading(false);
    }
  };

  const createProgramme = async (data: Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      
      // Valider les données avant envoi
      const validatedData = programmeSchema.parse(data);
      
      const response = await api.post('/api/programmes-formation', validatedData);
      
      // Mettre à jour le cache local
      setProgrammes(prev => [...prev, response.data]);
      
      toast({
        title: 'Succès',
        description: 'Le programme a été créé avec succès'
      });
      
      return response.data;
      
    } catch (error) {
      let errorMessage = 'Erreur lors de la création du programme';
      
      if (error instanceof z.ZodError) {
        errorMessage = 'Données invalides: ' + 
          error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast({
        title: 'Erreur',
        description: errorMessage
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProgramme = async (id: string, data: Partial<ProgrammeFormation>) => {
    try {
      setLoading(true);
      
      // Valider les données avant envoi
      const validatedData = programmeSchema.partial().parse(data);
      
      const response = await api.patch(`/api/programmes-formation/${id}`, validatedData);
      
      // Mettre à jour le cache local
      setProgrammes(prev => 
        prev.map(programme => 
          programme.id === id ? { ...programme, ...response.data } : programme
        )
      );
      
      toast({
        title: 'Succès',
        description: 'Le programme a été mis à jour avec succès'
      });
      
      return response.data;
      
    } catch (error) {
      let errorMessage = 'Erreur lors de la mise à jour du programme';
      
      if (error instanceof z.ZodError) {
        errorMessage = 'Données invalides: ' + 
          error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ');
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      toast({
        title: 'Erreur',
        description: errorMessage
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Récupère la liste des catégories de programmes depuis l'API
   * @returns {Promise<void>}
   * 
   * @example
   * // Charger les catégories
   * await fetchCategories();
   * // Utiliser les catégories chargées
   * console.log(categories);
   */
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/categories');
      setCategories(response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les catégories',
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Supprime un programme
   * @param {string} id - ID du programme à supprimer
   * @returns {Promise<void>}
   * 
   * @example
   * try {
   *   await deleteProgramme('123');
   *   console.log('Programme supprimé');
   * } catch (error) {
   *   console.error('Erreur:', error);
   * }
   */
  const deleteProgramme = async (id: string) => {
    try {
      const programme = programmes.find(p => p.id === id);
      await api.delete(`/api/programmes-formation/${id}`);
      setProgrammes(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Programme supprimé',
        description: `Programme "${programme?.titre}" supprimé avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le programme',
      });
      throw error;
    }
  };

  /**
   * Duplique un programme existant avec un nouveau code
   * @param {string} id - ID du programme à dupliquer
   * @param {Partial<ProgrammeFormation>} modificationData - Champs à modifier pour la copie
   * @returns {Promise<ProgrammeFormation>} Le nouveau programme créé
   * 
   * @example
   * try {
   *   const copie = await duplicateProgramme('123', { code: 'WEB-101-COPY' });
   *   console.log('Copie créée:', copie);
   * } catch (error) {
   *   console.error('Erreur:', error);
   * }
   */
  const duplicateProgramme = async (id: string, modificationData: Partial<ProgrammeFormation>) => {
    try {
      console.log('duplicateProgramme appelé avec id:', id, 'et modifications:', modificationData);
      
      // Récupérer le programme source
      const sourceProgramme = programmes.find(p => p.id === id);
      if (!sourceProgramme) {
        console.error('Programme source introuvable avec id:', id);
        throw new Error('Programme source introuvable');
      }
      console.log('Programme source trouvé:', sourceProgramme);

      // Créer un nouveau programme basé sur le programme source avec les modifications
      const duplicateData = {
        ...sourceProgramme,
        ...modificationData,
        id: undefined // Le backend va générer un nouvel ID
      };
      console.log('Données pour duplication préparées:', duplicateData);

      // Essayons d'abord une approche alternative si l'API originale échoue
      let response;
      try {
        // Approche 1: Endpoint spécifique de duplication
        console.log('Tentative d\'appel API 1: /api/programmes-formation/duplicate');
        response = await api.post('/api/programmes-formation/duplicate', { 
          sourceId: id,
          newData: duplicateData
        });
      } catch (dupError) {
        console.warn('Première tentative échouée, essai avec création standard...', dupError);
        
        // Approche 2: Créer un nouveau programme avec les données dupliquées
        console.log('Tentative d\'appel API 2: /api/programmes-formation (création standard)');
        const newProgrammeData = {
          ...duplicateData,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined
        };
        response = await api.post('/api/programmes-formation', newProgrammeData);
      }

      const duplicatedProgramme = response.data;
      console.log('Programme dupliqué avec succès:', duplicatedProgramme);
      
      setProgrammes(prev => [duplicatedProgramme, ...prev]);

      toast({
        title: 'Programme dupliqué',
        description: `Programme "${duplicatedProgramme.titre}" créé avec succès`,
      });

      return duplicatedProgramme;
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de dupliquer le programme',
      });
      throw error;
    }
  };

  /**
   * Active ou désactive un programme
   * @param {string} id - ID du programme
   * @param {boolean} estActif - Nouvel état d'activation
   * @returns {Promise<void>}
   * 
   * @example
   * // Désactiver un programme
   * await updateProgrammeStatus('123', false);
   */
  const updateProgrammeStatus = async (id: string, estActif: boolean) => {
    console.log('updateProgrammeStatus appelé avec id:', id, 'estActif:', estActif);
    try {
      // Récupérer le programme pour les logs
      const programme = programmes.find(p => p.id === id);
      console.log('Programme trouvé pour mise à jour de statut:', programme);
      
      // Essayer plusieurs approches en cas d'échec
      let response;
      try {
        // Approche 1: Endpoint dédié au statut
        console.log('Tentative API 1: PATCH /api/programmes-formation/:id/status');
        response = await api.patch(`/api/programmes-formation/${id}/status`, { estActif });
      } catch (statusError) {
        console.warn('Première tentative échouée, essai avec mise à jour standard...', statusError);
        
        // Approche 2: Update standard
        console.log('Tentative API 2: PUT /api/programmes-formation/:id (update standard)');
        response = await api.put(`/api/programmes-formation/${id}`, { estActif });
      }
      
      const updated = response.data;
      console.log('Programme mis à jour avec succès:', updated);
      
      // Mettre à jour l'état local avant la notification
      setProgrammes(prev => prev.map(p => (p.id === id ? updated : p)));
      console.log('Liste des programmes mise à jour');
      
      toast({
        title: estActif ? 'Programme activé' : 'Programme désactivé',
        description: `Le statut du programme a été mis à jour`,
      });
      
      return updated;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut du programme',
      });
      throw error;
    }
  };

  /**
   * Filtre les programmes par catégorie
   * @param {string | null} categorieId - ID de la catégorie (null pour tout afficher)
   * @returns {ProgrammeFormation[]} Programmes filtrés
   * 
   * @example
   * // Filtrer par catégorie
   * const programmesFiltres = getProgrammesByCategorie('categorie-123');
   * // Afficher tous les programmes
   * const tousLesProgrammes = getProgrammesByCategorie(null);
   */
  const getProgrammesByCategorie = (categorieId: string | null): ProgrammeFormation[] => {
    return programmes.filter(prog => prog.categorieId === categorieId);
  };

  /**
   * Filtre les programmes par type (catalogue ou personnalisé)
   * @param {'catalogue' | 'personnalise' | null} type - Type de programme
   * @returns {ProgrammeFormation[]} Programmes filtrés
   * 
   * @example
   * // Filtrer les programmes catalogue
   * const catalogue = getProgrammesByType('catalogue');
   */
  const getProgrammesByType = (type: 'catalogue' | 'personnalise' | null): ProgrammeFormation[] => {
    return programmes.filter(prog => prog.type === type);
  };

  /**
   * Crée un programme personnalisé à partir d'un programme catalogue
   * @param {string} programmeCatalogueId - ID du programme catalogue source
   * @param {string} beneficiaireId - ID de l'apprenant bénéficiaire
   * @param {Partial<ProgrammeFormation>} personnalisations - Adaptations spécifiques
   * @returns {Promise<ProgrammeFormation>} Programme personnalisé créé
   * 
   * @example
   * const programmePerso = await createProgrammePersonnalise('cat-123', 'app-456', {
   *   objectifsSpecifiques: 'Objectifs adaptés pour cet apprenant',
   *   duree: '2 jours au lieu de 3'
   * });
   */
  const createProgrammePersonnalise = async (
    programmeCatalogueId: string, 
    beneficiaireId: string,
    personnalisations: Partial<ProgrammeFormation> = {}
  ) => {
    try {
      const programmeCatalogue = programmes.find(p => p.id === programmeCatalogueId);
      if (!programmeCatalogue) {
        throw new Error('Programme catalogue introuvable');
      }

      if (programmeCatalogue.type !== 'catalogue') {
        throw new Error('Seuls les programmes catalogue peuvent être personnalisés');
      }

      const programmePersonnalise = {
        ...programmeCatalogue,
        type: 'personnalise' as const,
        programmeCatalogueId,
        beneficiaireId,
        code: `${programmeCatalogue.code}-PERSO-${Date.now()}`,
        titre: `${programmeCatalogue.titre} (Personnalisé)`,
        estVisible: false, // Les programmes personnalisés ne sont pas visibles publiquement
        ...personnalisations,
        id: undefined, // Le backend générera un nouvel ID
        createdAt: undefined,
        updatedAt: undefined
      };

      return await createProgramme(programmePersonnalise);
      
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le programme personnalisé'
      });
      throw error;
    }
  };

  // Chargement initial des données
  useEffect(() => {
    const loadData = async () => {
      await fetchProgrammes();
      await fetchCategories();
    };
    loadData();
  }, []);

  return {
    programmes,
    categories,
    loading,
    error,
    fetchProgrammes,
    createProgramme,
    updateProgramme,
    fetchCategories,
    deleteProgramme,
    duplicateProgramme,
    updateProgrammeStatus,
    getProgrammesByCategorie,
    getProgrammesByType,
    createProgrammePersonnalise
  };
};
