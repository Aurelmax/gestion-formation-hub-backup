/**
 * Tests complets pour le FormulaireInscription
 * Couvre tous les scénarios de validation et soumission
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import FormulaireInscription from './FormulaireInscription';

// Mock du router Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock de fetch
global.fetch = jest.fn();

describe('FormulaireInscription', () => {
  const mockPush = jest.fn();
  
  beforeEach(() => {
    // Reset des mocks avant chaque test
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    (fetch as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Rendu initial', () => {
    it('affiche tous les champs requis', () => {
      render(<FormulaireInscription />);
      
      expect(screen.getByLabelText('Nom complet')).toBeInTheDocument();
      expect(screen.getByLabelText('Adresse email')).toBeInTheDocument();
      expect(screen.getByLabelText('Mot de passe')).toBeInTheDocument();
      expect(screen.getByLabelText('Confirmer le mot de passe')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /s'inscrire/i })).toBeInTheDocument();
    });

    it('affiche le titre du formulaire', () => {
      render(<FormulaireInscription />);
      expect(screen.getByRole('heading', { name: /créer un compte/i })).toBeInTheDocument();
    });

    it('affiche le lien vers la connexion', () => {
      render(<FormulaireInscription />);
      expect(screen.getByText(/déjà un compte/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /se connecter/i })).toBeInTheDocument();
    });
  });

  describe('Validation des champs obligatoires', () => {
    it('affiche une erreur quand le nom est manquant', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.getByText(/le nom est obligatoire/i)).toBeInTheDocument();
      expect(screen.getByText(/le nom est obligatoire/i)).toHaveAttribute('role', 'alert');
    });

    it('affiche une erreur quand l\'email est manquant', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.getByText(/l'email est obligatoire/i)).toBeInTheDocument();
    });

    it('affiche une erreur quand le mot de passe est manquant', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.getByText(/le mot de passe est obligatoire/i)).toBeInTheDocument();
    });

    it('affiche une erreur quand la confirmation du mot de passe est manquante', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.getByText(/la confirmation du mot de passe est obligatoire/i)).toBeInTheDocument();
    });

    it('affiche toutes les erreurs simultanément quand tous les champs sont vides', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.getByText(/le nom est obligatoire/i)).toBeInTheDocument();
      expect(screen.getByText(/l'email est obligatoire/i)).toBeInTheDocument();
      expect(screen.getByText(/le mot de passe est obligatoire/i)).toBeInTheDocument();
      expect(screen.getByText(/la confirmation du mot de passe est obligatoire/i)).toBeInTheDocument();
    });
  });

  describe('Validation du format email', () => {
    const validEmails = [
      'test@exemple.com',
      'utilisateur.test@domaine.fr',
      'admin+test@site.org',
      'user123@domaine-test.co.uk'
    ];

    const invalidEmails = [
      'email-invalide',
      'test@',
      '@domaine.com',
      'test@domaine',
      'test@.com',
      'test@domaine.',
      ''
    ];

    validEmails.forEach(email => {
      it(`accepte l'email valide: ${email}`, async () => {
        const user = userEvent.setup();
        render(<FormulaireInscription />);

        const emailInput = screen.getByLabelText('Adresse email');
        await user.type(emailInput, email);
        
        const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
        await user.click(submitButton);

        expect(screen.queryByText(/format d'email invalide/i)).not.toBeInTheDocument();
      });
    });

    invalidEmails.forEach(email => {
      it(`rejette l'email invalide: "${email}"`, async () => {
        const user = userEvent.setup();
        render(<FormulaireInscription />);

        const emailInput = screen.getByLabelText('Adresse email');
        if (email) {
          await user.type(emailInput, email);
        }
        
        const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
        await user.click(submitButton);

        if (email === '') {
          expect(screen.getByText(/l'email est obligatoire/i)).toBeInTheDocument();
        } else {
          expect(screen.getByText(/format d'email invalide/i)).toBeInTheDocument();
        }
      });
    });
  });

  describe('Validation du mot de passe', () => {
    it('rejette un mot de passe trop court (moins de 8 caractères)', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const passwordInput = screen.getByLabelText('Mot de passe');
      await user.type(passwordInput, '1234567'); // 7 characters
      
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.getByText(/le mot de passe doit contenir au moins 8 caractères/i)).toBeInTheDocument();
    });

    it('accepte un mot de passe de 8 caractères ou plus', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const passwordInput = screen.getByLabelText('Mot de passe');
      await user.type(passwordInput, '12345678'); // 8 characters
      
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.queryByText(/le mot de passe doit contenir au moins 8 caractères/i)).not.toBeInTheDocument();
    });
  });

  describe('Validation de la correspondance des mots de passe', () => {
    it('affiche une erreur quand les mots de passe ne correspondent pas', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const passwordInput = screen.getByLabelText('Mot de passe');
      const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');

      await user.type(passwordInput, 'motdepasse123');
      await user.type(confirmPasswordInput, 'motdepasse456');
      
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.getByText(/les mots de passe ne correspondent pas/i)).toBeInTheDocument();
    });

    it('n\'affiche pas d\'erreur quand les mots de passe correspondent', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const passwordInput = screen.getByLabelText('Mot de passe');
      const confirmPasswordInput = screen.getByLabelText('Confirmer le mot de passe');

      await user.type(passwordInput, 'motdepasse123');
      await user.type(confirmPasswordInput, 'motdepasse123');
      
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      expect(screen.queryByText(/les mots de passe ne correspondent pas/i)).not.toBeInTheDocument();
    });
  });

  describe('Effacement des erreurs lors de la saisie', () => {
    it('efface l\'erreur du nom quand l\'utilisateur commence à taper', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      // Déclencher l'erreur
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);
      expect(screen.getByText(/le nom est obligatoire/i)).toBeInTheDocument();

      // Commencer à taper
      const nomInput = screen.getByLabelText('Nom complet');
      await user.type(nomInput, 'J');

      expect(screen.queryByText(/le nom est obligatoire/i)).not.toBeInTheDocument();
    });

    it('efface l\'erreur de l\'email quand l\'utilisateur commence à taper', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      // Déclencher l'erreur
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);
      expect(screen.getByText(/l'email est obligatoire/i)).toBeInTheDocument();

      // Commencer à taper
      const emailInput = screen.getByLabelText('Adresse email');
      await user.type(emailInput, 't');

      expect(screen.queryByText(/l'email est obligatoire/i)).not.toBeInTheDocument();
    });
  });

  describe('Soumission du formulaire et requêtes réseau', () => {
    const validFormData = {
      nom: 'Jean Dupont',
      email: 'jean.dupont@exemple.com',
      motDePasse: 'motdepasse123',
      confirmationMotDePasse: 'motdepasse123'
    };

    it('empêche la soumission si le formulaire contient des erreurs', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      // Laisser tous les champs vides
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      // Vérifier qu'aucune requête n'a été envoyée
      expect(fetch).not.toHaveBeenCalled();
    });

    it('envoie une requête POST avec les bonnes données quand le formulaire est valide', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(<FormulaireInscription />);

      // Remplir le formulaire
      await user.type(screen.getByLabelText('Nom complet'), validFormData.nom);
      await user.type(screen.getByLabelText('Adresse email'), validFormData.email);
      await user.type(screen.getByLabelText('Mot de passe'), validFormData.motDePasse);
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), validFormData.confirmationMotDePasse);

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      // Vérifier la requête
      expect(fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: validFormData.nom,
          email: validFormData.email,
          password: validFormData.motDePasse,
        }),
      });
    });

    it('redirige vers /login en cas de succès', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      render(<FormulaireInscription />);

      // Remplir le formulaire
      await user.type(screen.getByLabelText('Nom complet'), validFormData.nom);
      await user.type(screen.getByLabelText('Adresse email'), validFormData.email);
      await user.type(screen.getByLabelText('Mot de passe'), validFormData.motDePasse);
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), validFormData.confirmationMotDePasse);

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/login?message=Inscription réussie, veuillez vous connecter');
      });
    });

    it('affiche une erreur en cas d\'échec de l\'API', async () => {
      const user = userEvent.setup();
      const errorMessage = 'Cet email est déjà utilisé';
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: errorMessage })
      });

      render(<FormulaireInscription />);

      // Remplir le formulaire
      await user.type(screen.getByLabelText('Nom complet'), validFormData.nom);
      await user.type(screen.getByLabelText('Adresse email'), validFormData.email);
      await user.type(screen.getByLabelText('Mot de passe'), validFormData.motDePasse);
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), validFormData.confirmationMotDePasse);

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });

    it('affiche une erreur générique en cas d\'échec sans message', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({})
      });

      render(<FormulaireInscription />);

      // Remplir le formulaire
      await user.type(screen.getByLabelText('Nom complet'), validFormData.nom);
      await user.type(screen.getByLabelText('Adresse email'), validFormData.email);
      await user.type(screen.getByLabelText('Mot de passe'), validFormData.motDePasse);
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), validFormData.confirmationMotDePasse);

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/erreur lors de l'inscription/i)).toBeInTheDocument();
      });
    });

    it('affiche une erreur réseau en cas d\'exception', async () => {
      const user = userEvent.setup();
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      render(<FormulaireInscription />);

      // Remplir le formulaire
      await user.type(screen.getByLabelText('Nom complet'), validFormData.nom);
      await user.type(screen.getByLabelText('Adresse email'), validFormData.email);
      await user.type(screen.getByLabelText('Mot de passe'), validFormData.motDePasse);
      await user.type(screen.getByLabelText('Confirmer le mot de passe'), validFormData.confirmationMotDePasse);

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/erreur réseau. veuillez réessayer/i)).toBeInTheDocument();
      });
    });
  });

  describe('État du bouton de soumission', () => {
    it('désactive le bouton pendant la soumission', async () => {
      const user = userEvent.setup();
      
      // Mock d'une requête qui prend du temps
      (fetch as jest.Mock).mockImplementationOnce(() => 
        new Promise(resolve => setTimeout(() => resolve({ ok: true, json: () => ({}) }), 100))
      );

      render(<FormulaireInscription />);

      // Remplir le formulaire
      await user.type(screen.getByLabelText(/nom complet/i), 'Jean Dupont');
      await user.type(screen.getByLabelText(/adresse email/i), 'jean@exemple.com');
      await user.type(screen.getByLabelText(/^mot de passe$/i), 'motdepasse123');
      await user.type(screen.getByLabelText(/confirmer le mot de passe/i), 'motdepasse123');

      // Soumettre
      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      // Vérifier que le bouton est désactivé et affiche le texte de chargement
      expect(submitButton).toBeDisabled();
      expect(screen.getByText(/inscription en cours/i)).toBeInTheDocument();

      // Attendre la fin de la requête
      await waitFor(() => {
        expect(submitButton).not.toBeDisabled();
      });
    });
  });

  describe('Navigation', () => {
    it('redirige vers la page de connexion quand on clique sur "Se connecter"', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const loginLink = screen.getByRole('button', { name: /se connecter/i });
      await user.click(loginLink);

      expect(mockPush).toHaveBeenCalledWith('/login');
    });
  });

  describe('Accessibilité', () => {
    it('associe correctement les messages d\'erreur aux champs via aria-describedby', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      const nomInput = screen.getByLabelText('Nom complet');
      const nomError = screen.getByText(/le nom est obligatoire/i);
      
      expect(nomInput).toHaveAttribute('aria-describedby', 'nom-error');
      expect(nomError).toHaveAttribute('id', 'nom-error');
    });

    it('utilise role="alert" pour les messages d\'erreur', async () => {
      const user = userEvent.setup();
      render(<FormulaireInscription />);

      const submitButton = screen.getByRole('button', { name: /s'inscrire/i });
      await user.click(submitButton);

      const alertElements = screen.getAllByRole('alert');
      expect(alertElements).toHaveLength(4); // Une pour chaque champ obligatoire
    });
  });
});