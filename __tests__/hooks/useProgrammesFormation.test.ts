/**
 * Tests unitaires pour le hook critique useProgrammesFormation
 * Couverture des fonctionnalités CRUD et gestion d'état
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { useProgrammesFormation } from '@/hooks/useProgrammesFormation';
import api from '@/services/api';
import { ProgrammeFormation, ProgrammeType } from '@/types';

// Mock des dépendances
jest.mock('@/services/api');
jest.mock('@/hooks/use-toast');

const mockApi = api as jest.Mocked<typeof api>;
const mockToast = { toast: jest.fn() };

// Mock du hook toast
jest.requireMock('@/hooks/use-toast').useToast.mockReturnValue(mockToast);

describe('useProgrammesFormation - Hook Critique', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =====================================
  // TESTS D'INITIALISATION ET FETCH
  // =====================================

  describe('Initialisation et Fetch', () => {
    
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));
      
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.programmes).toEqual([]);
      expect(result.current.categories).toEqual([]);
    });

    it('should fetch programmes automatically when autoFetch is true', async () => {
      const mockProgrammes = [
        createMockProgramme({ id: '1', type: 'catalogue' }),
        createMockProgramme({ id: '2', type: 'personnalise' })
      ];
      
      mockApi.get.mockImplementation((url) => {
        if (url === '/api/programmes-formation') {
          return Promise.resolve({ data: { data: mockProgrammes } });
        }
        if (url === '/api/categories') {
          return Promise.resolve({ data: [] });
        }
        return Promise.reject(new Error('Unknown URL'));
      });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: true }));
      
      expect(result.current.loading).toBe(true);
      
      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.programmes).toEqual(mockProgrammes);
      expect(result.current.error).toBeNull();
      expect(mockApi.get).toHaveBeenCalledWith('/api/programmes-formation');
    });

    it('should handle fetch error correctly', async () => {
      const errorMessage = 'Network error';
      mockApi.get.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: true }));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.programmes).toEqual([]);
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Erreur',
        description: `Impossible de charger les programmes: ${errorMessage}`,
      });
    });
  });

  // =====================================
  // TESTS DE FILTRAGE
  // =====================================

  describe('Filtrage et Recherche', () => {
    
    it('should filter programmes by type correctly', async () => {
      const catalogueProgramme = createMockProgramme({ id: '1', type: 'catalogue' });
      const personnaliseProgramme = createMockProgramme({ id: '2', type: 'personnalise' });
      
      mockApi.get.mockResolvedValue({ 
        data: { data: [catalogueProgramme, personnaliseProgramme] } 
      });

      const { result } = renderHook(() => 
        useProgrammesFormation({ filterType: 'catalogue' })
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.programmes).toEqual([catalogueProgramme]);
      expect(result.current.allProgrammes).toEqual([catalogueProgramme, personnaliseProgramme]);
    });

    it('should group programmes by type correctly', async () => {
      const catalogueProgramme = createMockProgramme({ id: '1', type: 'catalogue' });
      const personnaliseProgramme = createMockProgramme({ id: '2', type: 'personnalise' });
      
      mockApi.get.mockResolvedValue({ 
        data: { data: [catalogueProgramme, personnaliseProgramme] } 
      });

      const { result } = renderHook(() => useProgrammesFormation());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.programmesByType).toEqual({
        catalogue: [catalogueProgramme],
        personnalise: [personnaliseProgramme],
        all: [catalogueProgramme, personnaliseProgramme]
      });
    });

    it('should fetch programmes with filters', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [] } });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      await act(async () => {
        await result.current.fetchProgrammes({
          type: 'catalogue',
          categorieId: 'test-cat',
          search: 'test',
          estActif: true
        });
      });

      expect(mockApi.get).toHaveBeenCalledWith(
        '/api/programmes-formation?type=catalogue&categorieId=test-cat&search=test&estActif=true'
      );
    });
  });

  // =====================================
  // TESTS CRUD - CRÉATION
  // =====================================

  describe('CRUD - Création', () => {
    
    it('should create programme successfully', async () => {
      const newProgramme = createMockProgramme({ id: 'new-id' });
      const existingProgrammes = [createMockProgramme({ id: 'existing-id' })];
      
      mockApi.post.mockResolvedValue({ data: newProgramme });
      mockApi.get.mockResolvedValue({ 
        data: { data: [...existingProgrammes, newProgramme] } 
      });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      let createdProgramme;
      await act(async () => {
        createdProgramme = await result.current.createProgramme({
          titre: 'Nouveau Programme',
          type: 'catalogue'
        });
      });

      expect(mockApi.post).toHaveBeenCalledWith('/api/programmes-formation', {
        titre: 'Nouveau Programme',
        type: 'catalogue'
      });
      expect(createdProgramme).toEqual(newProgramme);
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Succès',
        description: 'Programme créé avec succès',
      });
    });

    it('should handle creation error', async () => {
      const errorMessage = 'Validation failed';
      mockApi.post.mockRejectedValue({ 
        response: { data: { error: errorMessage } } 
      });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      await act(async () => {
        try {
          await result.current.createProgramme({ titre: 'Test' });
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Erreur',
        description: errorMessage,
      });
    });
  });

  // =====================================
  // TESTS CRUD - MODIFICATION
  // =====================================

  describe('CRUD - Modification', () => {
    
    it('should update programme successfully', async () => {
      const updatedProgramme = createMockProgramme({ 
        id: 'test-id',
        titre: 'Programme Modifié' 
      });
      
      mockApi.put.mockResolvedValue({ data: updatedProgramme });
      mockApi.get.mockResolvedValue({ data: { data: [updatedProgramme] } });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      await act(async () => {
        await result.current.updateProgramme('test-id', {
          titre: 'Programme Modifié'
        });
      });

      expect(mockApi.put).toHaveBeenCalledWith('/api/programmes-formation/test-id', {
        titre: 'Programme Modifié'
      });
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Succès',
        description: 'Programme mis à jour avec succès',
      });
    });

    it('should handle update error', async () => {
      mockApi.put.mockRejectedValue({ 
        response: { data: { error: 'Update failed' } } 
      });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      await act(async () => {
        try {
          await result.current.updateProgramme('test-id', { titre: 'Test' });
        } catch (error) {
          expect(error).toBeDefined();
        }
      });

      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Erreur',
        description: 'Update failed',
      });
    });
  });

  // =====================================
  // TESTS CRUD - SUPPRESSION
  // =====================================

  describe('CRUD - Suppression', () => {
    
    it('should delete programme successfully', async () => {
      mockApi.delete.mockResolvedValue({});
      mockApi.get.mockResolvedValue({ data: { data: [] } });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      await act(async () => {
        await result.current.deleteProgramme('test-id');
      });

      expect(mockApi.delete).toHaveBeenCalledWith('/api/programmes-formation/test-id');
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Succès',
        description: 'Programme supprimé avec succès',
      });
    });

    it('should handle deletion error', async () => {
      mockApi.delete.mockRejectedValue({ 
        response: { data: { error: 'Delete failed' } } 
      });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      await act(async () => {
        await result.current.deleteProgramme('test-id');
      });

      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Erreur',
        description: 'Delete failed',
      });
    });
  });

  // =====================================
  // TESTS CRUD - DUPLICATION
  // =====================================

  describe('CRUD - Duplication', () => {
    
    it('should duplicate programme successfully', async () => {
      const duplicatedProgramme = createMockProgramme({ 
        id: 'duplicated-id',
        code: 'COPY-001' 
      });
      
      mockApi.post.mockResolvedValue({ data: duplicatedProgramme });
      mockApi.get.mockResolvedValue({ data: { data: [duplicatedProgramme] } });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      await act(async () => {
        await result.current.duplicateProgramme('original-id');
      });

      expect(mockApi.post).toHaveBeenCalledWith('/api/programmes-formation/duplicate/original-id');
      expect(mockToast.toast).toHaveBeenCalledWith({
        title: 'Succès',
        description: 'Programme dupliqué avec succès',
      });
    });
  });

  // =====================================
  // TESTS UTILITAIRES
  // =====================================

  describe('Méthodes Utilitaires', () => {
    
    it('should find programme by ID', async () => {
      const targetProgramme = createMockProgramme({ id: 'target-id' });
      const programmes = [
        createMockProgramme({ id: 'other-id' }),
        targetProgramme
      ];
      
      mockApi.get.mockResolvedValue({ data: { data: programmes } });

      const { result } = renderHook(() => useProgrammesFormation());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const foundProgramme = result.current.getProgrammeById('target-id');
      expect(foundProgramme).toEqual(targetProgramme);
    });

    it('should search programmes by query', async () => {
      const programmes = [
        createMockProgramme({ id: '1', titre: 'Formation React' }),
        createMockProgramme({ id: '2', titre: 'Formation Vue.js' }),
        createMockProgramme({ id: '3', code: 'REACT-001', titre: 'Angular' })
      ];
      
      mockApi.get.mockResolvedValue({ data: { data: programmes } });

      const { result } = renderHook(() => useProgrammesFormation());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const searchResults = result.current.searchProgrammes('react');
      expect(searchResults).toHaveLength(2);
      expect(searchResults.map(p => p.id)).toEqual(['1', '3']);
    });

    it('should filter active programmes', async () => {
      const programmes = [
        createMockProgramme({ id: '1', estActif: true }),
        createMockProgramme({ id: '2', estActif: false }),
        createMockProgramme({ id: '3', estActif: true })
      ];
      
      mockApi.get.mockResolvedValue({ data: { data: programmes } });

      const { result } = renderHook(() => useProgrammesFormation());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const activeProgrammes = result.current.getActiveProgrammes();
      expect(activeProgrammes).toHaveLength(2);
      expect(activeProgrammes.map(p => p.id)).toEqual(['1', '3']);
    });
  });

  // =====================================
  // TESTS D'INTÉGRATION ET EDGE CASES
  // =====================================

  describe('Edge Cases et Intégration', () => {
    
    it('should handle empty response gracefully', async () => {
      mockApi.get.mockResolvedValue({ data: {} });

      const { result } = renderHook(() => useProgrammesFormation());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.programmes).toEqual([]);
      expect(result.current.error).toBeNull();
    });

    it('should refresh programmes correctly', async () => {
      const initialProgrammes = [createMockProgramme({ id: '1' })];
      const refreshedProgrammes = [
        createMockProgramme({ id: '1' }),
        createMockProgramme({ id: '2' })
      ];
      
      mockApi.get
        .mockResolvedValueOnce({ data: { data: initialProgrammes } })
        .mockResolvedValueOnce({ data: { data: refreshedProgrammes } });

      const { result } = renderHook(() => useProgrammesFormation());

      await waitFor(() => {
        expect(result.current.programmes).toHaveLength(1);
      });

      await act(async () => {
        await result.current.refreshProgrammes();
      });

      expect(result.current.programmes).toHaveLength(2);
    });

    it('should handle concurrent operations correctly', async () => {
      mockApi.get.mockResolvedValue({ data: { data: [] } });
      mockApi.post.mockResolvedValue({ data: createMockProgramme() });

      const { result } = renderHook(() => useProgrammesFormation({ autoFetch: false }));

      // Simulation d'opérations concurrentes
      await act(async () => {
        const promises = [
          result.current.createProgramme({ titre: 'Programme 1' }),
          result.current.fetchProgrammes(),
          result.current.createProgramme({ titre: 'Programme 2' })
        ];
        
        await Promise.all(promises);
      });

      // Vérifier que toutes les opérations ont été appelées
      expect(mockApi.post).toHaveBeenCalledTimes(2);
      expect(mockApi.get).toHaveBeenCalled();
    });
  });
});