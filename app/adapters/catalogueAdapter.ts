// ====================================
// ADAPTATEUR DE TRANSITION - CATALOGUE
// Adapte useProgrammesFormation pour remplacer useProgrammesCatalogue
// ====================================

import { ProgrammeFormation } from '@/types';
import type { CategorieProgramme } from '@prisma/client';

/**
 * Interface pour le hook unifié
 */
interface UnifiedHook {
  allProgrammes: ProgrammeFormation[];
  categories: CategorieProgramme[];
  loading: boolean;
  error?: string | null;
  fetchProgrammes?: () => void;
  updateProgramme?: (id: string, data: Partial<ProgrammeFormation>) => Promise<ProgrammeFormation>;
  duplicateProgramme?: (id: string) => Promise<ProgrammeFormation>;
  deleteProgramme?: (id: string) => Promise<void>;
}

/**
 * Interface de catégorie compatible avec l'ancien hook
 */
export interface CategorieFormation {
  id: string;
  code: string;
  titre: string;
  description: string;
  couleur: string;
  formations: ProgrammeFormation[];
}

/**
 * Adaptateur pour transformer les données du hook unifié
 * vers le format attendu par CataloguePage
 */
export class CatalogueAdapter {
  /**
   * Transforme les programmes par catégories vers le format attendu
   */
  static adaptProgrammesToCategories(
    programmes: ProgrammeFormation[],
    categories: CategorieProgramme[]
  ): CategorieFormation[] {
    // Grouper les programmes par catégorie
    const programmesByCategorie = programmes.reduce((acc, programme) => {
      if (!programme.categorie?.id) return acc;
      
      const categoryId = programme.categorie.id;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(programme);
      return acc;
    }, {} as Record<string, ProgrammeFormation[]>);

    // Construire les catégories avec leurs formations
    return categories
      .filter(category => programmesByCategorie[category.id])
      .map(category => ({
        id: category.id,
        code: category.code || `CAT_${category.id.substring(0, 8)}`,
        titre: category.titre || category.nom,
        description: category.description || '',
        couleur: this.getDefaultColor(category.id),
        formations: programmesByCategorie[category.id] || []
      }));
  }

  /**
   * Génère une couleur par défaut basée sur l'ID de catégorie
   */
  private static getDefaultColor(categoryId: string): string {
    const colors = [
      '#3B82F6', // blue
      '#10B981', // emerald  
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // violet
      '#06B6D4', // cyan
      '#84CC16', // lime
      '#F97316'  // orange
    ];
    
    // Hash simple pour une couleur consistante
    const hash = categoryId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    
    return colors[Math.abs(hash) % colors.length];
  }

  /**
   * Adapte les méthodes du hook unifié pour la compatibilité
   */
  static createCatalogueHookAdapter(unifiedHook: UnifiedHook) {
    return {
      programmes: unifiedHook.allProgrammes || [],
      categories: this.adaptProgrammesToCategories(
        unifiedHook.allProgrammes || [], 
        unifiedHook.categories || []
      ),
      loading: unifiedHook.loading,
      error: unifiedHook.error,
      refreshProgrammes: unifiedHook.fetchProgrammes,
      toggleProgrammeStatus: unifiedHook.updateProgramme 
        ? async (programmeId: string, estActif: boolean) => {
            return await unifiedHook.updateProgramme(programmeId, { estActif });
          }
        : undefined,
      createNewVersion: async (programmeId: string) => {
        if (unifiedHook.duplicateProgramme) {
          return await unifiedHook.duplicateProgramme(programmeId);
        }
        throw new Error('Fonctionnalité non disponible');
      },
      deleteProgramme: unifiedHook.deleteProgramme
    };
  }
}

/**
 * Hook adaptateur pour remplacer useProgrammesCatalogue
 */
export const useCatalogueAdapter = (unifiedHook: UnifiedHook) => {
  return CatalogueAdapter.createCatalogueHookAdapter(unifiedHook);
};