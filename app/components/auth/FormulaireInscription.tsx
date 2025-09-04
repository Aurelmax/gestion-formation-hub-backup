'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormErrors {
  nom?: string;
  email?: string;
  motDePasse?: string;
  confirmationMotDePasse?: string;
  general?: string;
}

interface FormData {
  nom: string;
  email: string;
  motDePasse: string;
  confirmationMotDePasse: string;
}

export default function FormulaireInscription() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    email: '',
    motDePasse: '',
    confirmationMotDePasse: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    // Validation du nom (obligatoire)
    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est obligatoire';
    }

    // Validation de l'email (obligatoire et format valide)
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }

    // Validation du mot de passe (obligatoire et longueur minimale)
    if (!formData.motDePasse) {
      newErrors.motDePasse = 'Le mot de passe est obligatoire';
    } else if (formData.motDePasse.length < 8) {
      newErrors.motDePasse = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    // Validation de la confirmation du mot de passe
    if (!formData.confirmationMotDePasse) {
      newErrors.confirmationMotDePasse = 'La confirmation du mot de passe est obligatoire';
    } else if (formData.motDePasse !== formData.confirmationMotDePasse) {
      newErrors.confirmationMotDePasse = 'Les mots de passe ne correspondent pas';
    }

    return newErrors;
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Effacer l'erreur du champ lors de la saisie
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation des champs
    const formErrors = validateForm();
    setErrors(formErrors);
    
    // Si il y a des erreurs de validation, arrêter la soumission
    if (Object.keys(formErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nom,
          email: formData.email,
          password: formData.motDePasse,
        }),
      });

      if (response.ok) {
        // Inscription réussie
        router.push('/login?message=Inscription réussie, veuillez vous connecter');
      } else {
        const data = await response.json();
        setErrors({ general: data.error || 'Erreur lors de l\'inscription' });
      }
    } catch (error) {
      setErrors({ general: 'Erreur réseau. Veuillez réessayer.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            {/* Champ Nom */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                id="nom"
                name="nom"
                type="text"
                value={formData.nom}
                onChange={handleInputChange('nom')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.nom ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Votre nom complet"
                aria-describedby={errors.nom ? 'nom-error' : undefined}
              />
              {errors.nom && (
                <p id="nom-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.nom}
                </p>
              )}
            </div>

            {/* Champ Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="votre.email@exemple.com"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="motDePasse"
                name="motDePasse"
                type="password"
                value={formData.motDePasse}
                onChange={handleInputChange('motDePasse')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.motDePasse ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Au moins 8 caractères"
                aria-describedby={errors.motDePasse ? 'motDePasse-error' : undefined}
              />
              {errors.motDePasse && (
                <p id="motDePasse-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.motDePasse}
                </p>
              )}
            </div>

            {/* Champ Confirmation mot de passe */}
            <div>
              <label htmlFor="confirmationMotDePasse" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmationMotDePasse"
                name="confirmationMotDePasse"
                type="password"
                value={formData.confirmationMotDePasse}
                onChange={handleInputChange('confirmationMotDePasse')}
                className={`mt-1 appearance-none relative block w-full px-3 py-2 border rounded-md placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                  errors.confirmationMotDePasse ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirmer votre mot de passe"
                aria-describedby={errors.confirmationMotDePasse ? 'confirmationMotDePasse-error' : undefined}
              />
              {errors.confirmationMotDePasse && (
                <p id="confirmationMotDePasse-error" className="mt-1 text-sm text-red-600" role="alert">
                  {errors.confirmationMotDePasse}
                </p>
              )}
            </div>
          </div>

          {/* Erreur générale */}
          {errors.general && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-800" role="alert">
                {errors.general}
              </p>
            </div>
          )}

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Inscription en cours...' : 'S\'inscrire'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Déjà un compte ?{' '}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Se connecter
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}