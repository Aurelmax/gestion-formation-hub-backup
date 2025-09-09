import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RendezVousListUnified from '@/components/rendez-vous/RendezVousListUnified';
import { useRendezvous, Rendezvous } from '@/hooks/useRendezvous';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mock des hooks
jest.mock('@/hooks/useRendezvous');
jest.mock('@/hooks/use-toast');
jest.mock('next/navigation');

// Mock des composants de formulaire
jest.mock('@/components/rendez-vous/RendezvousFormUnified', () => {
  return function MockRendezvousFormUnified({ onCancel, onSubmit }: any) {
    return (
      <div data-testid="rendez-vous-form">
        <button onClick={onCancel}>Annuler</button>
        <button onClick={() => onSubmit({
          nomBeneficiaire: 'Test',
          prenomBeneficiaire: 'User',
          emailBeneficiaire: 'test@example.com'
        })}>
          Soumettre
        </button>
      </div>
    );
  };
});

jest.mock('@/components/rendez-vous/ImpactEvaluationForm', () => {
  return function MockImpactEvaluationForm({ onCancel, onSubmit }: any) {
    return (
      <div data-testid="impact-evaluation-form">
        <button onClick={onCancel}>Fermer</button>
        <button onClick={() => onSubmit({
          satisfactionImpact: 8,
          competencesAppliquees: 'Excellentes',
          commentairesImpact: 'Très bien'
        })}>
          Soumettre Évaluation
        </button>
      </div>
    );
  };
});

jest.mock('@/components/rendez-vous/CompteRenduAvanceModal', () => {
  return function MockCompteRenduAvanceModal({ 
    isOpen, 
    onClose, 
    onSave, 
    rendezvous 
  }: any) {
    if (!isOpen) return null;
    return (
      <div data-testid="compte-rendu-modal">
        <button onClick={onClose}>Fermer Modal</button>
        <button onClick={() => onSave('Synthèse de test', 'Notes de test')}>
          Sauvegarder
        </button>
      </div>
    );
  };
});

jest.mock('@/components/rendez-vous/WorkflowPositionnement', () => {
  return function MockWorkflowPositionnement({ onClose }: any) {
    return (
      <div data-testid="workflow-positionnement">
        <button onClick={onClose}>Fermer Workflow</button>
      </div>
    );
  };
});

const mockUseRendezvous = useRendezvous as jest.MockedFunction<typeof useRendezvous>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe('RendezVousListUnified Component', () => {
  let queryClient: QueryClient;
  let mockToast: jest.Mock;
  let mockPush: jest.Mock;
  let mockRendezvousActions: any;

  const mockRendezvous: Rendezvous[] = [
    {
      id: 'rdv-001',
      statut: 'nouveau',
      type: 'standard',
      nomBeneficiaire: 'Dupont',
      prenomBeneficiaire: 'Jean',
      emailBeneficiaire: 'jean.dupont@email.com',
      telephoneBeneficiaire: '0123456789',
      formationSelectionnee: 'Formation React',
      objectifs: ['Améliorer compétences React', 'Obtenir certification'],
      niveauBeneficiaire: 'intermédiaire',
      situationActuelle: 'Développeur junior',
      attentes: 'Monter en compétences',
      canal: 'visio',
      dateRdv: new Date('2024-12-15T10:00:00'),
      synthese: 'Rendez-vous de positionnement réussi',
      commentaires: 'Candidat motivé',
      createdAt: new Date('2024-12-01T09:00:00'),
      updatedAt: new Date('2024-12-01T09:00:00')
    },
    {
      id: 'rdv-002',
      statut: 'rdv_planifie',
      type: 'standard',
      nomBeneficiaire: 'Martin',
      prenomBeneficiaire: 'Sophie',
      emailBeneficiaire: 'sophie.martin@email.com',
      formationSelectionnee: 'Formation Angular',
      canal: 'présentiel',
      dateRdv: new Date('2024-12-20T14:00:00'),
      createdAt: new Date('2024-12-05T10:00:00'),
      updatedAt: new Date('2024-12-05T10:00:00')
    },
    {
      id: 'rdv-003',
      statut: 'termine',
      type: 'standard',
      nomBeneficiaire: 'Durand',
      prenomBeneficiaire: 'Pierre',
      emailBeneficiaire: 'pierre.durand@email.com',
      formationSelectionnee: 'Formation Vue.js',
      canal: 'visio',
      dateRdv: new Date('2024-12-10T09:00:00'),
      synthese: 'Formation terminée avec succès',
      createdAt: new Date('2024-11-20T09:00:00'),
      updatedAt: new Date('2024-12-10T16:00:00')
    },
    {
      id: 'rdv-004',
      statut: 'impact',
      type: 'impact',
      nomBeneficiaire: 'Leclerc',
      prenomBeneficiaire: 'Marie',
      emailBeneficiaire: 'marie.leclerc@email.com',
      formationSelectionnee: 'Formation Node.js',
      rendezvousParentId: 'rdv-005',
      dateImpact: new Date('2024-12-18T11:00:00'),
      satisfactionImpact: 8,
      competencesAppliquees: 'Très bonnes compétences appliquées',
      createdAt: new Date('2024-11-15T09:00:00'),
      updatedAt: new Date('2024-12-01T10:00:00')
    }
  ];

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockToast = jest.fn();
    mockPush = jest.fn();

    mockRendezvousActions = {
      rendezvous: mockRendezvous,
      loading: false,
      error: null,
      fetchRendezvous: jest.fn(),
      createRendezvous: jest.fn(),
      updateRendezvous: jest.fn(),
      updateRendezvousStatut: jest.fn(),
      validerRendezvous: jest.fn(),
      deleteRendezvous: jest.fn(),
      annulerRendezvous: jest.fn(),
      reprogrammerRendezvous: jest.fn(),
      planifierImpact: jest.fn(),
      completerEvaluationImpact: jest.fn(),
      saveImpactEvaluation: jest.fn(),
      terminerImpact: jest.fn(),
      genererRapportImpact: jest.fn(),
      editerCompteRendu: jest.fn(),
      genererProgrammeEtDossier: jest.fn()
    };

    mockUseRendezvous.mockReturnValue(mockRendezvousActions);
    mockUseToast.mockReturnValue({ toast: mockToast });
    mockUseRouter.mockReturnValue({ push: mockPush });

    // Clear all mocks
    jest.clearAllMocks();
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  describe('Rendu initial', () => {
    it('should render the component with correct title', () => {
      renderWithProviders(<RendezVousListUnified />);
      
      expect(screen.getByText('Gestion des Rendez-vous')).toBeInTheDocument();
    });

    it('should render tab navigation correctly', () => {
      renderWithProviders(<RendezVousListUnified />);
      
      expect(screen.getByText('Tous')).toBeInTheDocument();
      expect(screen.getByText('Nouveaux')).toBeInTheDocument();
      expect(screen.getByText('Planifiés')).toBeInTheDocument();
      expect(screen.getByText('Terminés')).toBeInTheDocument();
      expect(screen.getByText('Impact')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      renderWithProviders(<RendezVousListUnified />);
      
      expect(screen.getByText('Nouveau Positionnement')).toBeInTheDocument();
      expect(screen.getByText('Workflow Positionnement')).toBeInTheDocument();
    });

    it('should display rendez-vous cards', () => {
      renderWithProviders(<RendezVousListUnified />);
      
      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('Sophie Martin')).toBeInTheDocument();
      expect(screen.getByText('Pierre Durand')).toBeInTheDocument();
      expect(screen.getByText('Marie Leclerc')).toBeInTheDocument();
    });
  });

  describe('États de chargement et d\'erreur', () => {
    it('should show loading state', () => {
      mockUseRendezvous.mockReturnValue({
        ...mockRendezvousActions,
        loading: true,
        rendezvous: []
      });

      renderWithProviders(<RendezVousListUnified />);
      
      expect(screen.getByText('Chargement des rendez-vous...')).toBeInTheDocument();
    });

    it('should show error state', () => {
      mockUseRendezvous.mockReturnValue({
        ...mockRendezvousActions,
        loading: false,
        error: 'Erreur de chargement',
        rendezvous: []
      });

      renderWithProviders(<RendezVousListUnified />);
      
      expect(screen.getByText('Erreur: Erreur de chargement')).toBeInTheDocument();
    });

    it('should show empty state', () => {
      mockUseRendezvous.mockReturnValue({
        ...mockRendezvousActions,
        loading: false,
        error: null,
        rendezvous: []
      });

      renderWithProviders(<RendezVousListUnified />);
      
      expect(screen.getByText('Aucun rendez-vous trouvé')).toBeInTheDocument();
    });
  });

  describe('Filtrage par onglets', () => {
    it('should filter by "Nouveaux" status', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RendezVousListUnified />);

      await user.click(screen.getByText('Nouveaux'));

      await waitFor(() => {
        expect(mockRendezvousActions.fetchRendezvous).toHaveBeenCalledWith('nouveau');
      });
    });

    it('should filter by "Planifiés" status', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RendezVousListUnified />);

      await user.click(screen.getByText('Planifiés'));

      await waitFor(() => {
        expect(mockRendezvousActions.fetchRendezvous).toHaveBeenCalledWith('rdv_planifie');
      });
    });

    it('should filter by "Terminés" status', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RendezVousListUnified />);

      await user.click(screen.getByText('Terminés'));

      await waitFor(() => {
        expect(mockRendezvousActions.fetchRendezvous).toHaveBeenCalledWith('termine');
      });
    });

    it('should filter by "Impact" type', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RendezVousListUnified />);

      await user.click(screen.getByText('Impact'));

      await waitFor(() => {
        expect(mockRendezvousActions.fetchRendezvous).toHaveBeenCalledWith('impact', 'impact');
      });
    });

    it('should show all rendez-vous when clicking "Tous"', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RendezVousListUnified />);

      // First click on another tab
      await user.click(screen.getByText('Nouveaux'));
      // Then click on "Tous"
      await user.click(screen.getByText('Tous'));

      await waitFor(() => {
        expect(mockRendezvousActions.fetchRendezvous).toHaveBeenLastCalledWith();
      });
    });
  });

  describe('Actions sur les rendez-vous', () => {
    describe('Nouveau positionnement', () => {
      it('should open new positionnement form', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        await user.click(screen.getByText('Nouveau Positionnement'));

        expect(screen.getByTestId('rendez-vous-form')).toBeInTheDocument();
      });

      it('should submit new positionnement form', async () => {
        const user = userEvent.setup();
        const mockNewRendezvous = { ...mockRendezvous[0], id: 'new-rdv' };
        mockRendezvousActions.createRendezvous.mockResolvedValue(mockNewRendezvous);

        renderWithProviders(<RendezVousListUnified />);

        await user.click(screen.getByText('Nouveau Positionnement'));
        await user.click(screen.getByText('Soumettre'));

        await waitFor(() => {
          expect(mockRendezvousActions.createRendezvous).toHaveBeenCalledWith({
            nomBeneficiaire: 'Test',
            prenomBeneficiaire: 'User',
            emailBeneficiaire: 'test@example.com'
          });
        });

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Succès',
            description: 'Rendez-vous créé avec succès',
            duration: 3000
          });
        });
      });

      it('should handle form submission error', async () => {
        const user = userEvent.setup();
        mockRendezvousActions.createRendezvous.mockRejectedValue(new Error('Creation failed'));

        renderWithProviders(<RendezVousListUnified />);

        await user.click(screen.getByText('Nouveau Positionnement'));
        await user.click(screen.getByText('Soumettre'));

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Erreur',
            description: 'Erreur lors de la création du rendez-vous',
            variant: 'destructive',
            duration: 5000
          });
        });
      });

      it('should cancel form and close modal', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        await user.click(screen.getByText('Nouveau Positionnement'));
        expect(screen.getByTestId('rendez-vous-form')).toBeInTheDocument();

        await user.click(screen.getByText('Annuler'));
        expect(screen.queryByTestId('rendez-vous-form')).not.toBeInTheDocument();
      });
    });

    describe('Workflow positionnement', () => {
      it('should open workflow positionnement', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        await user.click(screen.getByText('Workflow Positionnement'));

        expect(screen.getByTestId('workflow-positionnement')).toBeInTheDocument();
      });

      it('should close workflow positionnement', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        await user.click(screen.getByText('Workflow Positionnement'));
        expect(screen.getByTestId('workflow-positionnement')).toBeInTheDocument();

        await user.click(screen.getByText('Fermer Workflow'));
        expect(screen.queryByTestId('workflow-positionnement')).not.toBeInTheDocument();
      });
    });

    describe('Actions sur les cartes de rendez-vous', () => {
      it('should display correct badges for different statuses', () => {
        renderWithProviders(<RendezVousListUnified />);

        // Vérifier les badges de statut
        expect(screen.getByText('Nouveau')).toBeInTheDocument();
        expect(screen.getByText('RDV Planifié')).toBeInTheDocument();
        expect(screen.getByText('Terminé')).toBeInTheDocument();
        expect(screen.getByText('Impact')).toBeInTheDocument();
      });

      it('should show correct action buttons based on status', () => {
        renderWithProviders(<RendezVousListUnified />);

        // Pour les rendez-vous nouveaux - bouton "Valider"
        const nouveauCard = screen.getByText('Jean Dupont').closest('.card');
        expect(nouveauCard).toBeInTheDocument();

        // Pour les rendez-vous terminés - bouton "Planifier Impact"
        const termineCard = screen.getByText('Pierre Durand').closest('.card');
        expect(termineCard).toBeInTheDocument();
      });

      it('should validate rendez-vous successfully', async () => {
        const user = userEvent.setup();
        const validatedRendezvous = { ...mockRendezvous[0], statut: 'rdv_planifie' };
        mockRendezvousActions.validerRendezvous.mockResolvedValue(validatedRendezvous);

        renderWithProviders(<RendezVousListUnified />);

        // Trouver et cliquer sur le bouton Valider du premier rendez-vous
        const validerButtons = screen.getAllByText('Valider');
        await user.click(validerButtons[0]);

        await waitFor(() => {
          expect(mockRendezvousActions.validerRendezvous).toHaveBeenCalledWith('rdv-001');
        });

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Succès',
            description: 'Rendez-vous validé avec succès',
            duration: 3000
          });
        });
      });

      it('should handle validation error', async () => {
        const user = userEvent.setup();
        mockRendezvousActions.validerRendezvous.mockRejectedValue(new Error('Validation failed'));

        renderWithProviders(<RendezVousListUnified />);

        const validerButtons = screen.getAllByText('Valider');
        await user.click(validerButtons[0]);

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Erreur',
            description: 'Erreur lors de la validation du rendez-vous',
            variant: 'destructive',
            duration: 5000
          });
        });
      });

      it('should delete rendez-vous with confirmation', async () => {
        const user = userEvent.setup();
        const confirmSpy = jest.spyOn(window, 'confirm');
        confirmSpy.mockReturnValue(true);
        mockRendezvousActions.deleteRendezvous.mockResolvedValue(undefined);

        renderWithProviders(<RendezVousListUnified />);

        const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
        await user.click(deleteButtons[0]);

        expect(confirmSpy).toHaveBeenCalledWith(
          'Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.'
        );

        await waitFor(() => {
          expect(mockRendezvousActions.deleteRendezvous).toHaveBeenCalledWith('rdv-001');
        });

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Succès',
            description: 'Rendez-vous supprimé avec succès',
            duration: 3000
          });
        });

        confirmSpy.mockRestore();
      });

      it('should cancel delete when user rejects confirmation', async () => {
        const user = userEvent.setup();
        const confirmSpy = jest.spyOn(window, 'confirm');
        confirmSpy.mockReturnValue(false);

        renderWithProviders(<RendezVousListUnified />);

        const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });
        await user.click(deleteButtons[0]);

        expect(confirmSpy).toHaveBeenCalled();
        expect(mockRendezvousActions.deleteRendezvous).not.toHaveBeenCalled();

        confirmSpy.mockRestore();
      });
    });

    describe('Gestion des rendez-vous d\'impact', () => {
      it('should plan impact rendez-vous', async () => {
        const user = userEvent.setup();
        const impactRendezvous = {
          ...mockRendezvous[0],
          id: 'rdv-impact-001',
          type: 'impact',
          statut: 'impact'
        };
        mockRendezvousActions.planifierImpact.mockResolvedValue(impactRendezvous);

        renderWithProviders(<RendezVousListUnified />);

        // Trouver le rendez-vous terminé et cliquer sur "Planifier Impact"
        const planifierButtons = screen.getAllByText('Planifier Impact');
        await user.click(planifierButtons[0]);

        await waitFor(() => {
          expect(mockRendezvousActions.planifierImpact).toHaveBeenCalledWith('rdv-003');
        });

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Succès',
            description: 'Rendez-vous d\'impact planifié pour dans 6 mois',
            duration: 3000
          });
        });
      });

      it('should open impact evaluation form', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        // Trouver le rendez-vous d'impact et cliquer sur "Évaluer Impact"
        const evaluerButtons = screen.getAllByText('Évaluer Impact');
        await user.click(evaluerButtons[0]);

        expect(screen.getByTestId('impact-evaluation-form')).toBeInTheDocument();
      });

      it('should submit impact evaluation', async () => {
        const user = userEvent.setup();
        const evaluatedRendezvous = { ...mockRendezvous[3], statut: 'impact_complete' };
        mockRendezvousActions.saveImpactEvaluation.mockResolvedValue(evaluatedRendezvous);

        renderWithProviders(<RendezVousListUnified />);

        // Ouvrir le formulaire d'évaluation
        const evaluerButtons = screen.getAllByText('Évaluer Impact');
        await user.click(evaluerButtons[0]);

        // Soumettre l'évaluation
        await user.click(screen.getByText('Soumettre Évaluation'));

        await waitFor(() => {
          expect(mockRendezvousActions.saveImpactEvaluation).toHaveBeenCalledWith('rdv-004', {
            satisfactionImpact: 8,
            competencesAppliquees: 'Excellentes',
            commentairesImpact: 'Très bien'
          });
        });

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Succès',
            description: 'Évaluation d\'impact enregistrée avec succès',
            duration: 3000
          });
        });
      });

      it('should generate impact report', async () => {
        const user = userEvent.setup();
        mockRendezvousActions.genererRapportImpact.mockResolvedValue({
          rapportUrl: '/api/rapports/impact-rdv-004.pdf'
        });

        renderWithProviders(<RendezVousListUnified />);

        // Trouver et cliquer sur "Générer Rapport"
        const rapportButtons = screen.getAllByText('Générer Rapport');
        await user.click(rapportButtons[0]);

        await waitFor(() => {
          expect(mockRendezvousActions.genererRapportImpact).toHaveBeenCalledWith('rdv-004');
        });

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Succès',
            description: 'Rapport d\'impact généré avec succès',
            duration: 3000
          });
        });
      });
    });

    describe('Compte rendu', () => {
      it('should open compte rendu modal', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        // Trouver et cliquer sur le bouton "Compte Rendu"
        const compteRenduButtons = screen.getAllByText('Compte Rendu');
        await user.click(compteRenduButtons[0]);

        expect(screen.getByTestId('compte-rendu-modal')).toBeInTheDocument();
      });

      it('should save compte rendu', async () => {
        const user = userEvent.setup();
        const updatedRendezvous = { 
          ...mockRendezvous[0], 
          synthese: 'Synthèse de test',
          commentaires: 'Notes de test'
        };
        mockRendezvousActions.editerCompteRendu.mockResolvedValue(updatedRendezvous);

        renderWithProviders(<RendezVousListUnified />);

        // Ouvrir la modal
        const compteRenduButtons = screen.getAllByText('Compte Rendu');
        await user.click(compteRenduButtons[0]);

        // Sauvegarder
        await user.click(screen.getByText('Sauvegarder'));

        await waitFor(() => {
          expect(mockRendezvousActions.editerCompteRendu).toHaveBeenCalledWith(
            'rdv-001', 
            'Synthèse de test', 
            'Notes de test'
          );
        });

        await waitFor(() => {
          expect(mockToast).toHaveBeenCalledWith({
            title: 'Succès',
            description: 'Compte rendu mis à jour avec succès',
            duration: 3000
          });
        });
      });
    });

    describe('Navigation', () => {
      it('should navigate to formations on formation title click', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        // Simuler le clic sur le titre d'une formation
        const formationLink = screen.getByText('Formation React');
        await user.click(formationLink);

        expect(mockPush).toHaveBeenCalledWith('/formations?search=Formation%20React');
      });

      it('should handle navigation to programmes personnalisés', async () => {
        const user = userEvent.setup();
        renderWithProviders(<RendezVousListUnified />);

        // Trouver et cliquer sur "Générer Programme"
        const programmeButtons = screen.getAllByText('Générer Programme');
        await user.click(programmeButtons[0]);

        const confirmSpy = jest.spyOn(window, 'confirm');
        confirmSpy.mockReturnValue(true);

        mockRendezvousActions.genererProgrammeEtDossier.mockResolvedValue({
          programmeId: 'prog-001',
          dossierId: 'doss-001'
        });

        // Re-cliquer après avoir mocké la confirmation
        await user.click(programmeButtons[0]);

        await waitFor(() => {
          expect(mockPush).toHaveBeenCalledWith('/programmes-personnalises');
        });

        confirmSpy.mockRestore();
      });
    });
  });

  describe('Affichage des données', () => {
    it('should format dates correctly', () => {
      renderWithProviders(<RendezVousListUnified />);

      // Vérifier que les dates sont affichées
      expect(screen.getByText('15/12/2024 à 10:00')).toBeInTheDocument();
      expect(screen.getByText('20/12/2024 à 14:00')).toBeInTheDocument();
    });

    it('should display formation information correctly', () => {
      renderWithProviders(<RendezVousListUnified />);

      expect(screen.getByText('Formation React')).toBeInTheDocument();
      expect(screen.getByText('Formation Angular')).toBeInTheDocument();
      expect(screen.getByText('Formation Vue.js')).toBeInTheDocument();
      expect(screen.getByText('Formation Node.js')).toBeInTheDocument();
    });

    it('should display contact information', () => {
      renderWithProviders(<RendezVousListUnified />);

      expect(screen.getByText('jean.dupont@email.com')).toBeInTheDocument();
      expect(screen.getByText('sophie.martin@email.com')).toBeInTheDocument();
      expect(screen.getByText('pierre.durand@email.com')).toBeInTheDocument();
      expect(screen.getByText('marie.leclerc@email.com')).toBeInTheDocument();
    });

    it('should show canal information with correct icons', () => {
      renderWithProviders(<RendezVousListUnified />);

      // Vérifier la présence des canaux
      const visioElements = screen.getAllByText('Visio');
      const presentielElements = screen.getAllByText('Présentiel');
      
      expect(visioElements.length).toBeGreaterThan(0);
      expect(presentielElements.length).toBeGreaterThan(0);
    });

    it('should display impact evaluation data', () => {
      renderWithProviders(<RendezVousListUnified />);

      // Vérifier l'affichage des données d'impact
      expect(screen.getByText('Satisfaction: 8/10')).toBeInTheDocument();
      expect(screen.getByText('Très bonnes compétences appliquées')).toBeInTheDocument();
    });
  });

  describe('Gestion d\'erreurs et edge cases', () => {
    it('should handle missing optional data gracefully', () => {
      const incompleteRendezvous: Rendezvous[] = [{
        id: 'rdv-incomplete',
        statut: 'nouveau',
        nomBeneficiaire: 'Dupont',
        prenomBeneficiaire: 'Jean',
        emailBeneficiaire: 'jean@example.com'
      }];

      mockUseRendezvous.mockReturnValue({
        ...mockRendezvousActions,
        rendezvous: incompleteRendezvous
      });

      renderWithProviders(<RendezVousListUnified />);

      expect(screen.getByText('Jean Dupont')).toBeInTheDocument();
      expect(screen.getByText('jean@example.com')).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();
      mockRendezvousActions.planifierImpact.mockRejectedValue(new Error('API Error'));

      renderWithProviders(<RendezVousListUnified />);

      const planifierButtons = screen.getAllByText('Planifier Impact');
      await user.click(planifierButtons[0]);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Erreur',
          description: 'Erreur lors de la planification du rendez-vous d\'impact',
          variant: 'destructive',
          duration: 5000
        });
      });
    });

    it('should handle concurrent operations', async () => {
      const user = userEvent.setup();
      mockRendezvousActions.validerRendezvous.mockResolvedValue(mockRendezvous[0]);
      mockRendezvousActions.deleteRendezvous.mockResolvedValue(undefined);

      const confirmSpy = jest.spyOn(window, 'confirm');
      confirmSpy.mockReturnValue(true);

      renderWithProviders(<RendezVousListUnified />);

      // Déclencher plusieurs actions simultanément
      const validerButtons = screen.getAllByText('Valider');
      const deleteButtons = screen.getAllByRole('button', { name: /supprimer/i });

      await Promise.all([
        user.click(validerButtons[0]),
        user.click(deleteButtons[1])
      ]);

      await waitFor(() => {
        expect(mockRendezvousActions.validerRendezvous).toHaveBeenCalled();
        expect(mockRendezvousActions.deleteRendezvous).toHaveBeenCalled();
      });

      confirmSpy.mockRestore();
    });
  });

  describe('Accessibilité', () => {
    it('should have proper ARIA labels and roles', () => {
      renderWithProviders(<RendezVousListUnified />);

      // Vérifier les rôles des boutons
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);

      // Vérifier la présence de tablist pour les onglets
      expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithProviders(<RendezVousListUnified />);

      // Tester la navigation par onglets
      const tousTabs = screen.getByRole('tab', { name: /tous/i });
      
      tousTabs.focus();
      expect(tousTabs).toHaveFocus();

      // Naviguer avec les touches fléchées
      await user.keyboard('{ArrowRight}');
      
      const nouveauxTab = screen.getByRole('tab', { name: /nouveaux/i });
      expect(nouveauxTab).toHaveFocus();
    });
  });
});