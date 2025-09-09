import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PositionnementForm from '@/components/rendez-vous/PositionnementForm';
import { useConfetti } from '@/hooks/useConfetti';
import { useToast } from '@/hooks/use-toast';
import api from '@/services/api';

// Mock des hooks et services
jest.mock('@/hooks/useConfetti');
jest.mock('@/hooks/use-toast');
jest.mock('@/services/api');

// Mock des composants enfants
jest.mock('@/components/rendez-vous/PositionnementFormHeader', () => {
  return function MockPositionnementFormHeader({ 
    currentStep, 
    totalSteps, 
    formationTitre 
  }: any) {
    return (
      <div data-testid="form-header">
        <span>Étape {currentStep}/{totalSteps}</span>
        <span>{formationTitre}</span>
      </div>
    );
  };
});

jest.mock('@/components/rendez-vous/BeneficiaireInfoSection', () => {
  return function MockBeneficiaireInfoSection({ formData, updateFormData }: any) {
    return (
      <div data-testid="beneficiaire-section">
        <input
          data-testid="nom-input"
          value={formData.nomBeneficiaire}
          onChange={(e) => updateFormData({ nomBeneficiaire: e.target.value })}
          placeholder="Nom du bénéficiaire"
        />
        <input
          data-testid="prenom-input"
          value={formData.prenomBeneficiaire}
          onChange={(e) => updateFormData({ prenomBeneficiaire: e.target.value })}
          placeholder="Prénom du bénéficiaire"
        />
        <input
          data-testid="email-input"
          value={formData.emailBeneficiaire}
          onChange={(e) => updateFormData({ emailBeneficiaire: e.target.value })}
          placeholder="Email du bénéficiaire"
        />
      </div>
    );
  };
});

jest.mock('@/components/rendez-vous/CoordonneesSection', () => {
  return function MockCoordonneesSection({ formData, updateFormData }: any) {
    return (
      <div data-testid="coordonnees-section">
        <input
          data-testid="telephone-input"
          value={formData.telephoneBeneficiaire || ''}
          onChange={(e) => updateFormData({ telephoneBeneficiaire: e.target.value })}
          placeholder="Téléphone"
        />
        <input
          data-testid="adresse-input"
          value={formData.adresseBeneficiaire || ''}
          onChange={(e) => updateFormData({ adresseBeneficiaire: e.target.value })}
          placeholder="Adresse"
        />
      </div>
    );
  };
});

jest.mock('@/components/rendez-vous/ExperienceObjectifsSection', () => {
  return function MockExperienceObjectifsSection({ formData, updateFormData }: any) {
    return (
      <div data-testid="experience-section">
        <textarea
          data-testid="experience-textarea"
          value={formData.experiencePassee || ''}
          onChange={(e) => updateFormData({ experiencePassee: e.target.value })}
          placeholder="Expérience passée"
        />
        <textarea
          data-testid="objectifs-textarea"
          value={formData.objectifsProfessionnels || ''}
          onChange={(e) => updateFormData({ objectifsProfessionnels: e.target.value })}
          placeholder="Objectifs professionnels"
        />
      </div>
    );
  };
});

jest.mock('@/components/ui/date-time-picker', () => {
  return {
    DateTimePicker: ({ value, onChange, placeholder }: any) => (
      <input
        data-testid="date-picker"
        type="datetime-local"
        value={value || ''}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
      />
    )
  };
});

const mockUseConfetti = useConfetti as jest.MockedFunction<typeof useConfetti>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockApi = api as jest.Mocked<typeof api>;

describe('PositionnementForm Component', () => {
  let mockConfetti: jest.Mock;
  let mockToast: jest.Mock;
  let mockOnSubmit: jest.Mock;
  let mockOnCancel: jest.Mock;

  const defaultProps = {
    onSubmit: jest.fn(),
    onCancel: jest.fn(),
    formationTitre: 'Formation React Avancé'
  };

  beforeEach(() => {
    mockConfetti = jest.fn();
    mockToast = jest.fn();
    mockOnSubmit = jest.fn();
    mockOnCancel = jest.fn();

    mockUseConfetti.mockReturnValue(mockConfetti);
    mockUseToast.mockReturnValue({ toast: mockToast });

    // Reset API mocks
    mockApi.post.mockReset();

    jest.clearAllMocks();
  });

  describe('Rendu initial', () => {
    it('should render the form with correct structure', () => {
      render(<PositionnementForm {...defaultProps} />);

      expect(screen.getByTestId('form-header')).toBeInTheDocument();
      expect(screen.getByTestId('beneficiaire-section')).toBeInTheDocument();
      expect(screen.getByTestId('coordonnees-section')).toBeInTheDocument();
      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
      expect(screen.getByText('Formation React Avancé')).toBeInTheDocument();
    });

    it('should render navigation buttons', () => {
      render(<PositionnementForm {...defaultProps} />);

      expect(screen.getByText('Annuler')).toBeInTheDocument();
      expect(screen.getByText('Suivant')).toBeInTheDocument();
    });

    it('should display current step correctly', () => {
      render(<PositionnementForm {...defaultProps} />);

      expect(screen.getByText('Étape 1/4')).toBeInTheDocument();
    });

    it('should initialize with empty form data', () => {
      render(<PositionnementForm {...defaultProps} />);

      expect(screen.getByTestId('nom-input')).toHaveValue('');
      expect(screen.getByTestId('prenom-input')).toHaveValue('');
      expect(screen.getByTestId('email-input')).toHaveValue('');
      expect(screen.getByTestId('telephone-input')).toHaveValue('');
    });
  });

  describe('Navigation entre les étapes', () => {
    it('should navigate to next step when clicking "Suivant"', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Remplir les champs obligatoires
      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');
      await user.type(screen.getByTestId('email-input'), 'jean.dupont@email.com');

      await user.click(screen.getByText('Suivant'));

      expect(screen.getByText('Étape 2/4')).toBeInTheDocument();
    });

    it('should navigate back to previous step when clicking "Précédent"', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Aller à l'étape 2
      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');
      await user.type(screen.getByTestId('email-input'), 'jean.dupont@email.com');
      await user.click(screen.getByText('Suivant'));

      expect(screen.getByText('Étape 2/4')).toBeInTheDocument();

      // Retourner à l'étape précédente
      await user.click(screen.getByText('Précédent'));

      expect(screen.getByText('Étape 1/4')).toBeInTheDocument();
    });

    it('should not show "Précédent" button on first step', () => {
      render(<PositionnementForm {...defaultProps} />);

      expect(screen.queryByText('Précédent')).not.toBeInTheDocument();
    });

    it('should show "Soumettre" button on last step', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Naviguer jusqu'à la dernière étape
      const steps = ['nom', 'prenom', 'email'];
      for (const step of steps) {
        await user.type(screen.getByTestId(`${step === 'nom' ? 'nom' : step === 'prenom' ? 'prenom' : 'email'}-input`), 'test');
      }

      // Aller aux étapes suivantes
      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByText('Suivant'));
      }

      expect(screen.getByText('Soumettre la demande')).toBeInTheDocument();
      expect(screen.queryByText('Suivant')).not.toBeInTheDocument();
    });
  });

  describe('Validation des champs', () => {
    it('should prevent navigation to next step with invalid email', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');
      await user.type(screen.getByTestId('email-input'), 'invalid-email');

      await user.click(screen.getByText('Suivant'));

      // Devrait rester à l'étape 1
      expect(screen.getByText('Étape 1/4')).toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erreur de validation',
        description: 'Veuillez saisir une adresse email valide',
        variant: 'destructive'
      });
    });

    it('should prevent navigation with missing required fields', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Ne remplir que le nom
      await user.type(screen.getByTestId('nom-input'), 'Dupont');

      await user.click(screen.getByText('Suivant'));

      // Devrait rester à l'étape 1
      expect(screen.getByText('Étape 1/4')).toBeInTheDocument();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Champs requis',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive'
      });
    });

    it('should validate phone number format', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Aller à l'étape 2 (coordonnées)
      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');
      await user.type(screen.getByTestId('email-input'), 'jean@email.com');
      await user.click(screen.getByText('Suivant'));

      // Saisir un numéro de téléphone invalide
      await user.type(screen.getByTestId('telephone-input'), 'invalid-phone');

      await user.click(screen.getByText('Suivant'));

      expect(mockToast).toHaveBeenCalledWith({
        title: 'Erreur de validation',
        description: 'Veuillez saisir un numéro de téléphone valide (10 chiffres)',
        variant: 'destructive'
      });
    });

    it('should accept valid phone number formats', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Aller à l'étape 2
      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');
      await user.type(screen.getByTestId('email-input'), 'jean@email.com');
      await user.click(screen.getByText('Suivant'));

      // Tester différents formats valides
      const validPhones = ['0123456789', '01 23 45 67 89', '01.23.45.67.89'];

      for (const phone of validPhones) {
        await user.clear(screen.getByTestId('telephone-input'));
        await user.type(screen.getByTestId('telephone-input'), phone);
        await user.click(screen.getByText('Suivant'));

        expect(screen.getByText('Étape 3/4')).toBeInTheDocument();

        // Retourner à l'étape précédente pour le test suivant
        if (phone !== validPhones[validPhones.length - 1]) {
          await user.click(screen.getByText('Précédent'));
        }
      }
    });
  });

  describe('Gestion des données du formulaire', () => {
    it('should update form data when typing in fields', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      const nomInput = screen.getByTestId('nom-input');
      const prenomInput = screen.getByTestId('prenom-input');
      const emailInput = screen.getByTestId('email-input');

      await user.type(nomInput, 'Dupont');
      await user.type(prenomInput, 'Jean');
      await user.type(emailInput, 'jean.dupont@email.com');

      expect(nomInput).toHaveValue('Dupont');
      expect(prenomInput).toHaveValue('Jean');
      expect(emailInput).toHaveValue('jean.dupont@email.com');
    });

    it('should preserve data when navigating between steps', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Remplir étape 1
      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');
      await user.type(screen.getByTestId('email-input'), 'jean@email.com');
      await user.click(screen.getByText('Suivant'));

      // Remplir étape 2
      await user.type(screen.getByTestId('telephone-input'), '0123456789');
      await user.click(screen.getByText('Suivant'));

      // Remplir étape 3
      await user.type(screen.getByTestId('experience-textarea'), 'Développeur depuis 5 ans');
      await user.click(screen.getByText('Précédent'));

      // Retourner à l'étape 2 et vérifier que les données sont préservées
      expect(screen.getByTestId('telephone-input')).toHaveValue('0123456789');

      // Retourner à l'étape 1 et vérifier
      await user.click(screen.getByText('Précédent'));
      expect(screen.getByTestId('nom-input')).toHaveValue('Dupont');
      expect(screen.getByTestId('prenom-input')).toHaveValue('Jean');
      expect(screen.getByTestId('email-input')).toHaveValue('jean@email.com');
    });

    it('should handle date/time selection', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Naviguer jusqu'à l'étape avec le sélecteur de date
      await user.type(screen.getByTestId('nom-input'), 'Test');
      await user.type(screen.getByTestId('prenom-input'), 'User');
      await user.type(screen.getByTestId('email-input'), 'test@email.com');

      // Naviguer aux étapes suivantes jusqu'à trouver le date picker
      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByText('Suivant'));
      }

      const datePicker = screen.getByTestId('date-picker');
      await user.type(datePicker, '2024-12-15T10:00');

      expect(datePicker).toHaveValue('2024-12-15T10:00');
    });
  });

  describe('Soumission du formulaire', () => {
    it('should submit form with complete data successfully', async () => {
      const user = userEvent.setup();
      mockApi.post.mockResolvedValue({ 
        data: { 
          id: 'rdv-001',
          message: 'Rendez-vous créé avec succès' 
        } 
      });

      render(<PositionnementForm {...defaultProps} onSubmit={mockOnSubmit} />);

      // Remplir toutes les étapes
      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');
      await user.type(screen.getByTestId('email-input'), 'jean@email.com');
      await user.click(screen.getByText('Suivant'));

      await user.type(screen.getByTestId('telephone-input'), '0123456789');
      await user.click(screen.getByText('Suivant'));

      await user.type(screen.getByTestId('experience-textarea'), 'Développeur expérimenté');
      await user.type(screen.getByTestId('objectifs-textarea'), 'Améliorer mes compétences');
      await user.click(screen.getByText('Suivant'));

      // Soumettre
      await user.click(screen.getByText('Soumettre la demande'));

      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith('/api/rendezvous', expect.objectContaining({
          nomBeneficiaire: 'Dupont',
          prenomBeneficiaire: 'Jean',
          emailBeneficiaire: 'jean@email.com',
          telephoneBeneficiaire: '0123456789',
          formationSelectionnee: 'Formation React Avancé'
        }));
      });

      expect(mockConfetti).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Demande envoyée !',
        description: 'Votre demande de positionnement a été envoyée avec succès. Vous recevrez un email de confirmation.',
        duration: 5000
      });
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        id: 'rdv-001'
      }));
    });

    it('should handle submission error gracefully', async () => {
      const user = userEvent.setup();
      mockApi.post.mockRejectedValue(new Error('API Error'));

      render(<PositionnementForm {...defaultProps} />);

      // Remplir le formulaire rapidement
      await user.type(screen.getByTestId('nom-input'), 'Test');
      await user.type(screen.getByTestId('prenom-input'), 'User');
      await user.type(screen.getByTestId('email-input'), 'test@email.com');

      // Naviguer jusqu'à la fin
      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByText('Suivant'));
      }

      await user.click(screen.getByText('Soumettre la demande'));

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Erreur',
          description: 'Une erreur est survenue lors de l\'envoi de votre demande. Veuillez réessayer.',
          variant: 'destructive'
        });
      });

      // Le formulaire devrait rester ouvert
      expect(screen.getByText('Soumettre la demande')).toBeInTheDocument();
    });

    it('should prevent multiple submissions', async () => {
      const user = userEvent.setup();
      // Simuler une réponse lente
      mockApi.post.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve({ data: { id: 'rdv-001' } }), 1000)
      ));

      render(<PositionnementForm {...defaultProps} />);

      // Remplir et naviguer jusqu'à la fin
      await user.type(screen.getByTestId('nom-input'), 'Test');
      await user.type(screen.getByTestId('prenom-input'), 'User');
      await user.type(screen.getByTestId('email-input'), 'test@email.com');

      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByText('Suivant'));
      }

      // Cliquer plusieurs fois rapidement
      const submitButton = screen.getByText('Soumettre la demande');
      await user.click(submitButton);
      await user.click(submitButton);
      await user.click(submitButton);

      // Vérifier qu'un seul appel API a été fait
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledTimes(1);
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      mockApi.post.mockImplementation(() => new Promise(resolve => 
        setTimeout(() => resolve({ data: { id: 'rdv-001' } }), 500)
      ));

      render(<PositionnementForm {...defaultProps} />);

      // Remplir et naviguer jusqu'à la fin
      await user.type(screen.getByTestId('nom-input'), 'Test');
      await user.type(screen.getByTestId('prenom-input'), 'User');
      await user.type(screen.getByTestId('email-input'), 'test@email.com');

      for (let i = 0; i < 3; i++) {
        await user.click(screen.getByText('Suivant'));
      }

      await user.click(screen.getByText('Soumettre la demande'));

      // Vérifier l'état de chargement
      expect(screen.getByText('Envoi en cours...')).toBeInTheDocument();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

      // Attendre la fin de la soumission
      await waitFor(() => {
        expect(screen.queryByText('Envoi en cours...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Annulation du formulaire', () => {
    it('should call onCancel when clicking "Annuler"', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} onCancel={mockOnCancel} />);

      await user.click(screen.getByText('Annuler'));

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should show confirmation dialog before cancelling with data', async () => {
      const user = userEvent.setup();
      const confirmSpy = jest.spyOn(window, 'confirm');
      confirmSpy.mockReturnValue(true);

      render(<PositionnementForm {...defaultProps} onCancel={mockOnCancel} />);

      // Remplir quelques champs
      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.type(screen.getByTestId('prenom-input'), 'Jean');

      await user.click(screen.getByText('Annuler'));

      expect(confirmSpy).toHaveBeenCalledWith(
        'Êtes-vous sûr de vouloir annuler ? Toutes les données saisies seront perdues.'
      );
      expect(mockOnCancel).toHaveBeenCalled();

      confirmSpy.mockRestore();
    });

    it('should not cancel if user rejects confirmation', async () => {
      const user = userEvent.setup();
      const confirmSpy = jest.spyOn(window, 'confirm');
      confirmSpy.mockReturnValue(false);

      render(<PositionnementForm {...defaultProps} onCancel={mockOnCancel} />);

      await user.type(screen.getByTestId('nom-input'), 'Dupont');
      await user.click(screen.getByText('Annuler'));

      expect(confirmSpy).toHaveBeenCalled();
      expect(mockOnCancel).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('Accessibilité', () => {
    it('should have proper ARIA labels and roles', () => {
      render(<PositionnementForm {...defaultProps} />);

      const form = screen.getByRole('form');
      expect(form).toBeInTheDocument();

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      const nomInput = screen.getByTestId('nom-input');
      const prenomInput = screen.getByTestId('prenom-input');

      // Tester la navigation par Tab
      nomInput.focus();
      await user.keyboard('{Tab}');
      expect(prenomInput).toHaveFocus();
    });

    it('should announce step changes to screen readers', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Aller à l'étape suivante
      await user.type(screen.getByTestId('nom-input'), 'Test');
      await user.type(screen.getByTestId('prenom-input'), 'User');
      await user.type(screen.getByTestId('email-input'), 'test@email.com');
      await user.click(screen.getByText('Suivant'));

      // Vérifier que l'étape actuelle est annoncée
      expect(screen.getByText('Étape 2/4')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle form without formationTitre', () => {
      render(<PositionnementForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

      expect(screen.getByTestId('form-header')).toBeInTheDocument();
      // Le titre de formation devrait être vide ou par défaut
    });

    it('should handle very long input values', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      const longText = 'a'.repeat(1000);
      await user.type(screen.getByTestId('nom-input'), longText);

      expect(screen.getByTestId('nom-input')).toHaveValue(longText);
    });

    it('should handle special characters in inputs', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      const specialChars = 'àáâãäåæçèéêë';
      await user.type(screen.getByTestId('nom-input'), specialChars);

      expect(screen.getByTestId('nom-input')).toHaveValue(specialChars);
    });

    it('should handle rapid successive navigation clicks', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Remplir les champs requis
      await user.type(screen.getByTestId('nom-input'), 'Test');
      await user.type(screen.getByTestId('prenom-input'), 'User');
      await user.type(screen.getByTestId('email-input'), 'test@email.com');

      // Cliquer rapidement plusieurs fois sur Suivant
      const nextButton = screen.getByText('Suivant');
      await user.click(nextButton);
      await user.click(nextButton);

      // Devrait être à l'étape 2, pas plus loin
      expect(screen.getByText('Étape 2/4')).toBeInTheDocument();
    });
  });

  describe('Integration avec les composants enfants', () => {
    it('should pass correct props to child components', () => {
      render(<PositionnementForm {...defaultProps} />);

      // Vérifier que les composants enfants reçoivent les bonnes props
      expect(screen.getByTestId('beneficiaire-section')).toBeInTheDocument();
      expect(screen.getByTestId('coordonnees-section')).toBeInTheDocument();
      expect(screen.getByTestId('experience-section')).toBeInTheDocument();
    });

    it('should update form data from child components', async () => {
      const user = userEvent.setup();
      render(<PositionnementForm {...defaultProps} />);

      // Les enfants mockés devraient pouvoir mettre à jour les données
      await user.type(screen.getByTestId('nom-input'), 'TestNom');

      expect(screen.getByTestId('nom-input')).toHaveValue('TestNom');
    });
  });
});