import { renderHook, act } from '@testing-library/react';
import { useRendezvous, Rendezvous, RendezvousFormData, ImpactEvaluationData } from '@/hooks/useRendezvous';
import api from '@/services/api';
import { ApiResponse } from '@/types';

// Mock du service API
jest.mock('@/services/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}));

const mockApi = api as jest.Mocked<typeof api>;

describe('useRendezvous Hook', () => {
  const mockRendezvous: Rendezvous = {
    id: 'rdv-001',
    statut: 'nouveau',
    type: 'standard',
    nomBeneficiaire: 'Dupont',
    prenomBeneficiaire: 'Jean',
    emailBeneficiaire: 'jean.dupont@email.com',
    telephoneBeneficiaire: '0123456789',
    objectifs: ['Améliorer compétences', 'Obtenir certification'],
    niveauBeneficiaire: 'intermédiaire',
    situationActuelle: 'Emploi CDI',
    attentes: 'Monter en compétences',
    pratiqueActuelle: 'Utilisation basique',
    canal: 'visio',
    dateRdv: new Date('2024-12-15T10:00:00'),
    formationSelectionnee: 'Formation React',
    dateDispo: '2024-12-15',
    modaliteFormation: 'présentiel',
    isFinancement: true,
    typeFinancement: 'CPF',
    hasHandicap: false,
    entreprise: 'TechCorp',
    siret: '12345678901234',
    commentaires: 'Rendez-vous de positionnement',
    createdAt: new Date('2024-12-01T09:00:00'),
    updatedAt: new Date('2024-12-01T09:00:00')
  };

  const mockFormData: RendezvousFormData = {
    type: 'positionnement',
    nomBeneficiaire: 'Martin',
    prenomBeneficiaire: 'Sophie',
    emailBeneficiaire: 'sophie.martin@email.com',
    telephoneBeneficiaire: '0987654321',
    formationSelectionnee: 'Formation Angular',
    niveauBeneficiaire: 'débutant',
    situationActuelle: 'Demandeur emploi',
    attentes: 'Reconversion professionnelle',
    objectifs: ['Maîtriser Angular', 'Trouver emploi'],
    canal: 'présentiel',
    commentaires: 'Motivation très forte'
  };

  const mockImpactData: ImpactEvaluationData = {
    satisfactionImpact: 8,
    competencesAppliquees: 'Toutes les compétences acquises',
    ameliorationsSuggeres: 'Plus de pratique',
    commentairesImpact: 'Formation très satisfaisante'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    console.log = jest.fn(); // Mock console.log pour éviter les logs de test
    console.error = jest.fn(); // Mock console.error pour éviter les logs d'erreur
  });

  describe('État initial', () => {
    it('should initialize with correct default values', () => {
      const { result } = renderHook(() => useRendezvous());

      expect(result.current.rendezvous).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBe(null);
    });

    it('should fetch rendez-vous on mount', async () => {
      const mockResponse = { data: [mockRendezvous] };
      mockApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        // Attendre que l'effet useEffect se termine
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(mockApi.get).toHaveBeenCalledWith('/api/rendezvous');
      expect(result.current.loading).toBe(false);
      expect(result.current.rendezvous).toHaveLength(1);
    });
  });

  describe('fetchRendezvous', () => {
    it('should fetch all rendez-vous without filters', async () => {
      const mockResponse = { data: [mockRendezvous] };
      mockApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      expect(mockApi.get).toHaveBeenCalledWith('/api/rendezvous');
      expect(result.current.rendezvous).toEqual([mockRendezvous]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should fetch rendez-vous with statut filter', async () => {
      const mockResponse = { data: [mockRendezvous] };
      mockApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous('rdv_planifie');
      });

      expect(mockApi.get).toHaveBeenCalledWith('/api/rendezvous?statut=rdv_planifie');
    });

    it('should fetch rendez-vous with type and statut filters', async () => {
      const mockResponse = { data: [mockRendezvous] };
      mockApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous('termine', 'impact');
      });

      expect(mockApi.get).toHaveBeenCalledWith('/api/rendezvous?statut=termine&type=impact');
    });

    it('should handle API response with nested data structure', async () => {
      const mockResponse = { data: { data: [mockRendezvous] } };
      mockApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      expect(result.current.rendezvous).toEqual([mockRendezvous]);
    });

    it('should handle fetch error gracefully', async () => {
      const mockError = new Error('Network error');
      mockApi.get.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      expect(result.current.error).toBe('Impossible de charger les rendez-vous');
      expect(result.current.rendezvous).toEqual([]);
      expect(result.current.loading).toBe(false);
    });

    it('should handle invalid API response format', async () => {
      const mockResponse = { data: 'invalid format' };
      mockApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      expect(result.current.error).toBe('Format de réponse invalide');
      expect(result.current.rendezvous).toEqual([]);
    });

    it('should map API fields correctly to Rendezvous interface', async () => {
      const apiData = {
        id: 'rdv-002',
        status: 'rdv_planifie', // API uses 'status'
        nom: 'Durand', // API uses 'nom'
        prenom: 'Marie', // API uses 'prenom'
        email: 'marie@email.com', // API uses 'email'
        telephone: '0123456789', // API uses 'telephone'
        formatRdv: 'visio', // API uses 'formatRdv'
        formationTitre: 'React Avancé', // API uses 'formationTitre'
        niveau: 'expert', // API uses 'niveau'
        disponibilites: '2024-12-20', // API uses 'disponibilites'
        formatSouhaite: 'visio' // API uses 'formatSouhaite'
      };

      const mockResponse = { data: [apiData] };
      mockApi.get.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      const mappedRendezvous = result.current.rendezvous[0];
      expect(mappedRendezvous.statut).toBe('rdv_planifie');
      expect(mappedRendezvous.nomBeneficiaire).toBe('Durand');
      expect(mappedRendezvous.prenomBeneficiaire).toBe('Marie');
      expect(mappedRendezvous.emailBeneficiaire).toBe('marie@email.com');
      expect(mappedRendezvous.canal).toBe('visio');
      expect(mappedRendezvous.formationSelectionnee).toBe('React Avancé');
      expect(mappedRendezvous.niveauBeneficiaire).toBe('expert');
      expect(mappedRendezvous.dateDispo).toBe('2024-12-20');
      expect(mappedRendezvous.modaliteFormation).toBe('visio');
    });
  });

  describe('createRendezvous', () => {
    it('should create new rendez-vous successfully', async () => {
      const mockResponse = { data: mockRendezvous };
      mockApi.post.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [mockRendezvous] });

      const { result } = renderHook(() => useRendezvous());

      let createdRendezvous;
      await act(async () => {
        createdRendezvous = await result.current.createRendezvous(mockFormData);
      });

      expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous', {
        type: 'positionnement',
        prenom: 'Sophie',
        nom: 'Martin',
        email: 'sophie.martin@email.com',
        telephone: '0987654321',
        objectifs: 'Maîtriser Angular, Trouver emploi',
        formationSelectionnee: 'Formation Angular',
        commentaires: 'Motivation très forte'
      });
      expect(createdRendezvous).toEqual(mockRendezvous);
    });

    it('should handle create error gracefully', async () => {
      const mockError = new Error('Creation failed');
      mockApi.post.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await expect(result.current.createRendezvous(mockFormData)).rejects.toThrow(
          'Impossible de créer le rendez-vous'
        );
      });
    });

    it('should map array objectives to string', async () => {
      const mockResponse = { data: mockRendezvous };
      mockApi.post.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useRendezvous());

      const formDataWithArrayObjectifs = {
        ...mockFormData,
        objectifs: ['Objectif 1', 'Objectif 2']
      };

      await act(async () => {
        await result.current.createRendezvous(formDataWithArrayObjectifs);
      });

      expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous', 
        expect.objectContaining({
          objectifs: 'Objectif 1, Objectif 2'
        })
      );
    });

    it('should handle array response correctly', async () => {
      const mockResponse = { data: [mockRendezvous] };
      mockApi.post.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useRendezvous());

      let createdRendezvous;
      await act(async () => {
        createdRendezvous = await result.current.createRendezvous(mockFormData);
      });

      expect(createdRendezvous).toEqual(mockRendezvous);
    });
  });

  describe('updateRendezvous', () => {
    it('should update rendez-vous successfully', async () => {
      const updatedData = { synthese: 'Synthèse du rendez-vous', statut: 'termine' };
      const updatedRendezvous = { ...mockRendezvous, ...updatedData };
      
      const mockResponse = { data: updatedRendezvous };
      mockApi.put.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [updatedRendezvous] });

      const { result } = renderHook(() => useRendezvous());

      let result_rdv;
      await act(async () => {
        result_rdv = await result.current.updateRendezvous('rdv-001', updatedData);
      });

      expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-001', updatedData);
      expect(result_rdv).toEqual(updatedRendezvous);
    });

    it('should handle update error gracefully', async () => {
      const mockError = new Error('Update failed');
      mockApi.put.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await expect(result.current.updateRendezvous('rdv-001', {})).rejects.toThrow(
          'Impossible de mettre à jour le rendez-vous'
        );
      });
    });

    it('should handle array response in update', async () => {
      const updatedData = { statut: 'termine' };
      const updatedRendezvous = { ...mockRendezvous, ...updatedData };
      
      const mockResponse = { data: [updatedRendezvous] };
      mockApi.put.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useRendezvous());

      let result_rdv;
      await act(async () => {
        result_rdv = await result.current.updateRendezvous('rdv-001', updatedData);
      });

      expect(result_rdv).toEqual(updatedRendezvous);
    });
  });

  describe('updateRendezvousStatut', () => {
    it('should update rendez-vous statut successfully', async () => {
      const updatedRendezvous = { ...mockRendezvous, statut: 'rdv_planifie' };
      const mockResponse = { data: updatedRendezvous };
      mockApi.put.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [updatedRendezvous] });

      const { result } = renderHook(() => useRendezvous());

      let result_rdv;
      await act(async () => {
        result_rdv = await result.current.updateRendezvousStatut('rdv-001', 'rdv_planifie');
      });

      expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-001/statut', { statut: 'rdv_planifie' });
      expect(result_rdv).toEqual(updatedRendezvous);
    });

    it('should handle statut update error gracefully', async () => {
      const mockError = new Error('Statut update failed');
      mockApi.put.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await expect(result.current.updateRendezvousStatut('rdv-001', 'termine')).rejects.toThrow(
          'Impossible de mettre à jour le statut du rendez-vous'
        );
      });
    });
  });

  describe('deleteRendezvous', () => {
    it('should delete rendez-vous successfully', async () => {
      mockApi.delete.mockResolvedValue({});
      mockApi.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.deleteRendezvous('rdv-001');
      });

      expect(mockApi.delete).toHaveBeenCalledWith('/api/rendezvous/rdv-001');
    });

    it('should handle delete error gracefully', async () => {
      const mockError = new Error('Delete failed');
      mockApi.delete.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await expect(result.current.deleteRendezvous('rdv-001')).rejects.toThrow(
          'Impossible de supprimer le rendez-vous'
        );
      });
    });
  });

  describe('validerRendezvous', () => {
    it('should validate rendez-vous successfully', async () => {
      const validatedRendezvous = { ...mockRendezvous, statut: 'rdv_planifie' };
      const mockResponse = { data: validatedRendezvous };
      mockApi.put.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [validatedRendezvous] });

      const { result } = renderHook(() => useRendezvous());

      let result_rdv;
      await act(async () => {
        result_rdv = await result.current.validerRendezvous('rdv-001', 'visio', '2024-12-15T10:00:00');
      });

      expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-001/valider', {
        formatRdv: 'visio',
        dateRdv: '2024-12-15T10:00:00'
      });
      expect(result_rdv).toEqual(validatedRendezvous);
    });

    it('should handle validation without optional parameters', async () => {
      const validatedRendezvous = { ...mockRendezvous, statut: 'rdv_planifie' };
      const mockResponse = { data: validatedRendezvous };
      mockApi.put.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.validerRendezvous('rdv-001');
      });

      expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-001/valider', {
        formatRdv: undefined,
        dateRdv: undefined
      });
    });

    it('should handle validation error gracefully', async () => {
      const mockError = new Error('Validation failed');
      mockApi.put.mockRejectedValue(mockError);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await expect(result.current.validerRendezvous('rdv-001')).rejects.toThrow(
          'Impossible de valider le rendez-vous'
        );
      });
    });

    it('should handle unexpected response format', async () => {
      const mockResponse = { data: 'unexpected format' };
      mockApi.put.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await expect(result.current.validerRendezvous('rdv-001')).rejects.toThrow(
          'Format de réponse invalide'
        );
      });
    });

    it('should handle array response in validation', async () => {
      const validatedRendezvous = { ...mockRendezvous, statut: 'rdv_planifie' };
      const mockResponse = { data: [validatedRendezvous] };
      mockApi.put.mockResolvedValue(mockResponse);
      mockApi.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useRendezvous());

      let result_rdv;
      await act(async () => {
        result_rdv = await result.current.validerRendezvous('rdv-001');
      });

      expect(result_rdv).toEqual(validatedRendezvous);
    });
  });

  describe('Impact Management', () => {
    describe('planifierImpact', () => {
      it('should plan impact rendez-vous successfully', async () => {
        const impactRendezvous = { 
          ...mockRendezvous, 
          id: 'rdv-impact-001', 
          type: 'impact',
          rendezvousParentId: 'rdv-001',
          statut: 'impact'
        };
        const mockResponse = { data: { rendezvous: impactRendezvous } };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [impactRendezvous] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.planifierImpact('rdv-001', '2025-06-15T10:00:00');
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-001/impact/planifier', {
          dateImpact: '2025-06-15T10:00:00'
        });
        expect(result_rdv).toEqual(impactRendezvous);
      });

      it('should plan impact without date (default +6 months)', async () => {
        const impactRendezvous = { 
          ...mockRendezvous, 
          id: 'rdv-impact-001', 
          type: 'impact'
        };
        const mockResponse = { data: { rendezvous: impactRendezvous } };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [] });

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await result.current.planifierImpact('rdv-001');
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-001/impact/planifier', {
          dateImpact: undefined
        });
      });

      it('should handle different response formats for impact planning', async () => {
        const impactRendezvous = { 
          ...mockRendezvous, 
          id: 'rdv-impact-001', 
          type: 'impact'
        };

        // Test array response
        const mockArrayResponse = { data: [impactRendezvous] };
        mockApi.post.mockResolvedValue(mockArrayResponse);
        mockApi.get.mockResolvedValue({ data: [] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.planifierImpact('rdv-001');
        });

        expect(result_rdv).toEqual(impactRendezvous);
      });

      it('should handle impact planning error gracefully', async () => {
        const mockError = new Error('Impact planning failed');
        mockApi.post.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.planifierImpact('rdv-001')).rejects.toThrow(
            'Impossible de planifier le rendez-vous d\'impact'
          );
        });
      });
    });

    describe('completerEvaluationImpact', () => {
      it('should complete impact evaluation successfully', async () => {
        const evaluatedRendezvous = { 
          ...mockRendezvous, 
          satisfactionImpact: 8,
          competencesAppliquees: 'Toutes les compétences',
          statut: 'impact_complete'
        };
        const mockResponse = { data: { rendezvous: evaluatedRendezvous } };
        mockApi.put.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [evaluatedRendezvous] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.completerEvaluationImpact('rdv-impact-001', mockImpactData);
        });

        expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-impact-001/impact/evaluation', mockImpactData);
        expect(result_rdv).toEqual(evaluatedRendezvous);
      });

      it('should handle impact evaluation error gracefully', async () => {
        const mockError = new Error('Impact evaluation failed');
        mockApi.put.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.completerEvaluationImpact('rdv-impact-001', mockImpactData)).rejects.toThrow(
            'Impossible de compléter l\'évaluation d\'impact'
          );
        });
      });
    });

    describe('saveImpactEvaluation', () => {
      it('should save impact evaluation successfully', async () => {
        const evaluationData = {
          satisfactionImpact: 9,
          competencesAppliquees: 'Excellentes compétences appliquées',
          ameliorationsSuggeres: 'Continuer la pratique',
          commentairesImpact: 'Très bonne évolution'
        };

        const savedRendezvous = { ...mockRendezvous, ...evaluationData };
        const mockResponse = { data: savedRendezvous };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [savedRendezvous] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.saveImpactEvaluation('rdv-impact-001', evaluationData);
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-impact-001/impact/evaluation', evaluationData);
        expect(result_rdv).toEqual(savedRendezvous);
      });

      it('should save partial impact evaluation', async () => {
        const partialEvaluationData = {
          satisfactionImpact: 7,
          commentairesImpact: 'Bonne formation'
        };

        const savedRendezvous = { ...mockRendezvous, ...partialEvaluationData };
        const mockResponse = { data: [savedRendezvous] };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.saveImpactEvaluation('rdv-impact-001', partialEvaluationData);
        });

        expect(result_rdv).toEqual(savedRendezvous);
      });

      it('should handle save impact evaluation error gracefully', async () => {
        const mockError = new Error('Save evaluation failed');
        mockApi.post.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.saveImpactEvaluation('rdv-impact-001', {})).rejects.toThrow(
            'Impossible d\'enregistrer l\'évaluation d\'impact'
          );
        });
      });
    });

    describe('terminerImpact', () => {
      it('should terminate impact rendez-vous successfully', async () => {
        const terminatedRendezvous = { ...mockRendezvous, statut: 'impact_termine' };
        const mockResponse = { data: { rendezvous: terminatedRendezvous } };
        mockApi.put.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [terminatedRendezvous] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.terminerImpact('rdv-impact-001');
        });

        expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-impact-001/impact/terminer');
        expect(result_rdv).toEqual(terminatedRendezvous);
      });

      it('should handle terminate impact error gracefully', async () => {
        const mockError = new Error('Terminate impact failed');
        mockApi.put.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.terminerImpact('rdv-impact-001')).rejects.toThrow(
            'Impossible de terminer le rendez-vous d\'impact'
          );
        });
      });
    });

    describe('genererRapportImpact', () => {
      it('should generate impact report successfully', async () => {
        const mockResponse = { data: { rapportUrl: '/api/rapports/impact-rdv-001.pdf' } };
        mockApi.get.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useRendezvous());

        let result_report;
        await act(async () => {
          result_report = await result.current.genererRapportImpact('rdv-impact-001');
        });

        expect(mockApi.get).toHaveBeenCalledWith('/api/rendezvous/rdv-impact-001/impact/rapport');
        expect(result_report).toEqual({ rapportUrl: '/api/rapports/impact-rdv-001.pdf' });
      });

      it('should handle nested response format for report generation', async () => {
        const mockResponse = { data: { message: { rapportUrl: '/api/rapports/nested-report.pdf' } } };
        mockApi.get.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useRendezvous());

        let result_report;
        await act(async () => {
          result_report = await result.current.genererRapportImpact('rdv-impact-001');
        });

        expect(result_report).toEqual({ rapportUrl: '/api/rapports/nested-report.pdf' });
      });

      it('should use fallback URL for unexpected response format', async () => {
        const mockResponse = { data: { unexpected: 'format' } };
        mockApi.get.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useRendezvous());

        let result_report;
        await act(async () => {
          result_report = await result.current.genererRapportImpact('rdv-impact-001');
        });

        expect(result_report).toEqual({ rapportUrl: '/api/rapports/default.pdf' });
      });

      it('should handle report generation error gracefully', async () => {
        const mockError = new Error('Report generation failed');
        mockApi.get.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.genererRapportImpact('rdv-impact-001')).rejects.toThrow(
            'Impossible de générer le rapport d\'impact'
          );
        });
      });
    });
  });

  describe('Rendez-vous Actions', () => {
    describe('annulerRendezvous', () => {
      it('should cancel rendez-vous successfully', async () => {
        const cancelledRendezvous = { ...mockRendezvous, statut: 'annule' };
        const mockResponse = { data: cancelledRendezvous };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [cancelledRendezvous] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.annulerRendezvous('rdv-001', 'Conflit d\'horaire');
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-001/annuler', {
          raison: 'Conflit d\'horaire'
        });
        expect(result_rdv).toEqual(cancelledRendezvous);
      });

      it('should cancel rendez-vous without reason', async () => {
        const cancelledRendezvous = { ...mockRendezvous, statut: 'annule' };
        const mockResponse = { data: [cancelledRendezvous] };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.annulerRendezvous('rdv-001');
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-001/annuler', {
          raison: undefined
        });
        expect(result_rdv).toEqual(cancelledRendezvous);
      });

      it('should handle cancel error gracefully', async () => {
        const mockError = new Error('Cancel failed');
        mockApi.post.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.annulerRendezvous('rdv-001')).rejects.toThrow(
            'Impossible d\'annuler le rendez-vous'
          );
        });
      });
    });

    describe('reprogrammerRendezvous', () => {
      it('should reschedule rendez-vous successfully', async () => {
        const rescheduledRendezvous = { 
          ...mockRendezvous, 
          dateRdv: new Date('2024-12-20T14:00:00'),
          canal: 'présentiel'
        };
        const mockResponse = { data: rescheduledRendezvous };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [rescheduledRendezvous] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.reprogrammerRendezvous(
            'rdv-001', 
            '2024-12-20T14:00:00', 
            'présentiel'
          );
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-001/reprogrammer', {
          dateRdv: '2024-12-20T14:00:00',
          formatRdv: 'présentiel'
        });
        expect(result_rdv).toEqual(rescheduledRendezvous);
      });

      it('should reschedule rendez-vous without format', async () => {
        const rescheduledRendezvous = { 
          ...mockRendezvous, 
          dateRdv: new Date('2024-12-20T14:00:00')
        };
        const mockResponse = { data: [rescheduledRendezvous] };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.reprogrammerRendezvous('rdv-001', '2024-12-20T14:00:00');
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-001/reprogrammer', {
          dateRdv: '2024-12-20T14:00:00',
          formatRdv: undefined
        });
        expect(result_rdv).toEqual(rescheduledRendezvous);
      });

      it('should handle reschedule error gracefully', async () => {
        const mockError = new Error('Reschedule failed');
        mockApi.post.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.reprogrammerRendezvous('rdv-001', '2024-12-20T14:00:00')).rejects.toThrow(
            'Impossible de reprogrammer le rendez-vous'
          );
        });
      });
    });
  });

  describe('Advanced Operations', () => {
    describe('editerCompteRendu', () => {
      it('should edit compte rendu successfully', async () => {
        const updatedRendezvous = { 
          ...mockRendezvous, 
          synthese: 'Synthèse détaillée du rendez-vous',
          commentaires: 'Notes supplémentaires'
        };
        const mockResponse = { data: updatedRendezvous };
        mockApi.put.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [updatedRendezvous] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.editerCompteRendu(
            'rdv-001', 
            'Synthèse détaillée du rendez-vous',
            'Notes supplémentaires'
          );
        });

        expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-001/compte-rendu', {
          synthese: 'Synthèse détaillée du rendez-vous',
          notes: 'Notes supplémentaires'
        });
        expect(result_rdv).toEqual(updatedRendezvous);
      });

      it('should edit compte rendu without notes', async () => {
        const updatedRendezvous = { 
          ...mockRendezvous, 
          synthese: 'Synthèse simple'
        };
        const mockResponse = { data: [updatedRendezvous] };
        mockApi.put.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [] });

        const { result } = renderHook(() => useRendezvous());

        let result_rdv;
        await act(async () => {
          result_rdv = await result.current.editerCompteRendu('rdv-001', 'Synthèse simple');
        });

        expect(mockApi.put).toHaveBeenCalledWith('/api/rendezvous/rdv-001/compte-rendu', {
          synthese: 'Synthèse simple',
          notes: undefined
        });
        expect(result_rdv).toEqual(updatedRendezvous);
      });

      it('should handle compte rendu edit error gracefully', async () => {
        const mockError = new Error('Compte rendu edit failed');
        mockApi.put.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.editerCompteRendu('rdv-001', 'Synthèse')).rejects.toThrow(
            'Impossible de mettre à jour le compte rendu'
          );
        });
      });
    });

    describe('genererProgrammeEtDossier', () => {
      it('should generate programme and dossier successfully', async () => {
        const mockResponse = {
          data: {
            programmeId: 'prog-001',
            dossierId: 'doss-001'
          }
        };
        mockApi.post.mockResolvedValue(mockResponse);
        mockApi.get.mockResolvedValue({ data: [] });

        const { result } = renderHook(() => useRendezvous());

        let result_data;
        await act(async () => {
          result_data = await result.current.genererProgrammeEtDossier('rdv-001');
        });

        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous/rdv-001/generer-programme');
        expect(result_data).toEqual({
          programmeId: 'prog-001',
          dossierId: 'doss-001'
        });
      });

      it('should handle incorrect response format for programme generation', async () => {
        const mockResponse = { data: { incorrectFormat: true } };
        mockApi.post.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.genererProgrammeEtDossier('rdv-001')).rejects.toThrow(
            'Format de réponse incorrect'
          );
        });
      });

      it('should handle programme generation error gracefully', async () => {
        const mockError = new Error('Programme generation failed');
        mockApi.post.mockRejectedValue(mockError);

        const { result } = renderHook(() => useRendezvous());

        await act(async () => {
          await expect(result.current.genererProgrammeEtDossier('rdv-001')).rejects.toThrow(
            'Impossible de générer le programme et le dossier'
          );
        });
      });
    });
  });

  describe('Edge Cases & Concurrency', () => {
    it('should handle concurrent operations correctly', async () => {
      const rdv1 = { ...mockRendezvous, id: 'rdv-001' };
      const rdv2 = { ...mockRendezvous, id: 'rdv-002' };
      
      mockApi.get.mockResolvedValue({ data: [rdv1, rdv2] });
      mockApi.put.mockResolvedValue({ data: rdv1 });

      const { result } = renderHook(() => useRendezvous());

      // Attendre le chargement initial
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      // Exécuter des opérations concurrentes
      await act(async () => {
        const promises = [
          result.current.updateRendezvousStatut('rdv-001', 'termine'),
          result.current.fetchRendezvous(),
          result.current.updateRendezvousStatut('rdv-002', 'rdv_planifie')
        ];
        
        await Promise.all(promises);
      });

      // Vérifier que toutes les opérations ont été appelées
      expect(mockApi.get).toHaveBeenCalledTimes(4); // 1 initial + 3 refreshes
      expect(mockApi.put).toHaveBeenCalledTimes(2); // 2 status updates
    });

    it('should handle empty response arrays gracefully', async () => {
      mockApi.get.mockResolvedValue({ data: [] });

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      expect(result.current.rendezvous).toEqual([]);
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe(null);
    });

    it('should handle null/undefined objectifs in mapping', async () => {
      const apiDataWithNullObjectifs = {
        ...mockRendezvous,
        objectifs: null
      };

      mockApi.get.mockResolvedValue({ data: [apiDataWithNullObjectifs] });

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      expect(result.current.rendezvous[0].objectifs).toBeUndefined();
    });

    it('should handle string objectifs in mapping', async () => {
      const apiDataWithStringObjectifs = {
        ...mockRendezvous,
        objectifs: 'Améliorer compétences'
      };

      mockApi.get.mockResolvedValue({ data: [apiDataWithStringObjectifs] });

      const { result } = renderHook(() => useRendezvous());

      await act(async () => {
        await result.current.fetchRendezvous();
      });

      expect(result.current.rendezvous[0].objectifs).toEqual(['Améliorer compétences']);
    });
  });

  describe('Performance & Memory Management', () => {
    it('should not cause memory leaks during multiple fetch operations', async () => {
      mockApi.get.mockResolvedValue({ data: [mockRendezvous] });

      const { result, unmount } = renderHook(() => useRendezvous());

      // Simuler de nombreuses opérations
      for (let i = 0; i < 10; i++) {
        await act(async () => {
          await result.current.fetchRendezvous();
        });
      }

      // Nettoyer
      unmount();

      expect(mockApi.get).toHaveBeenCalledTimes(11); // 1 initial + 10 manual calls
    });

    it('should handle rapid successive state updates without race conditions', async () => {
      const responses = [
        { data: [{ ...mockRendezvous, id: 'rdv-001' }] },
        { data: [{ ...mockRendezvous, id: 'rdv-002' }] },
        { data: [{ ...mockRendezvous, id: 'rdv-003' }] }
      ];

      mockApi.get.mockImplementation(() => 
        Promise.resolve(responses[mockApi.get.mock.calls.length - 1])
      );

      const { result } = renderHook(() => useRendezvous());

      // Déclencher des mises à jour rapides
      await act(async () => {
        const promises = [
          result.current.fetchRendezvous(),
          result.current.fetchRendezvous(),
          result.current.fetchRendezvous()
        ];
        await Promise.all(promises);
      });

      // Le dernier état devrait être maintenu
      expect(result.current.rendezvous).toHaveLength(1);
      expect(result.current.loading).toBe(false);
    });
  });
});