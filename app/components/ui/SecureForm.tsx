"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSecureForm } from '@/hooks/useSecureApi';

interface SecureFormProps {
  endpoint: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
  children: React.ReactNode;
  submitButtonText?: string;
  loadingText?: string;
  className?: string;
  rateLimitInfo?: {
    maxAttempts: number;
    windowMinutes: number;
  };
}

interface FormData {
  [key: string]: any;
}

/**
 * Composant de formulaire sécurisé avec protection CSRF, rate limiting et validation
 */
export function SecureForm({
  endpoint,
  onSuccess,
  onError,
  children,
  submitButtonText = "Envoyer",
  loadingText = "Envoi en cours...",
  className = "",
  rateLimitInfo
}: SecureFormProps) {
  const { submitForm, isSubmitting, submitError, submitSuccess, resetForm } = useSecureForm(endpoint);
  const [formData, setFormData] = useState<FormData>({});
  const [attemptCount, setAttemptCount] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [blockUntil, setBlockUntil] = useState<Date | null>(null);

  // Gestion du blocage temporaire côté client
  useEffect(() => {
    if (rateLimitInfo && attemptCount >= rateLimitInfo.maxAttempts) {
      setIsBlocked(true);
      const blockTime = new Date();
      blockTime.setMinutes(blockTime.getMinutes() + rateLimitInfo.windowMinutes);
      setBlockUntil(blockTime);

      // Débloquer automatiquement après la période
      const timeout = setTimeout(() => {
        setIsBlocked(false);
        setBlockUntil(null);
        setAttemptCount(0);
      }, rateLimitInfo.windowMinutes * 60 * 1000);

      return () => clearTimeout(timeout);
    }
  }, [attemptCount, rateLimitInfo]);

  /**
   * Collecte les données du formulaire
   */
  const collectFormData = (form: HTMLFormElement): FormData => {
    const data: FormData = {};
    const formDataObj = new FormData(form);

    formDataObj.forEach((value, key) => {
      // Ignorer les champs CSRF
      if (key !== 'csrf-token') {
        data[key] = value.toString().trim();
      }
    });

    return data;
  };

  /**
   * Validation côté client basique
   */
  const validateForm = (data: FormData): string[] => {
    const errors: string[] = [];

    // Vérifications génériques
    Object.entries(data).forEach(([key, value]) => {
      // Vérifier la longueur des champs
      if (typeof value === 'string') {
        if (value.length > 2000) {
          errors.push(`Le champ ${key} est trop long (max 2000 caractères)`);
        }

        // Détecter du contenu suspect
        const suspiciousPatterns = [
          /<script[^>]*>/i,
          /javascript:/i,
          /on\w+\s*=/i,
          /eval\s*\(/i,
        ];

        if (suspiciousPatterns.some(pattern => pattern.test(value))) {
          errors.push(`Contenu non autorisé détecté dans le champ ${key}`);
        }
      }
    });

    return errors;
  };

  /**
   * Gestion de la soumission du formulaire
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Vérifier si le formulaire est bloqué
    if (isBlocked) {
      return;
    }

    const form = event.currentTarget;
    const data = collectFormData(form);
    setFormData(data);

    // Validation côté client
    const validationErrors = validateForm(data);
    if (validationErrors.length > 0) {
      if (onError) {
        onError(validationErrors.join(', '));
      }
      return;
    }

    // Incrémenter le compteur de tentatives
    setAttemptCount(prev => prev + 1);

    try {
      const success = await submitForm(data);

      if (success) {
        // Réinitialiser le compteur en cas de succès
        setAttemptCount(0);
        form.reset();

        if (onSuccess) {
          onSuccess(data);
        }
      } else if (onError && submitError) {
        onError(submitError);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      if (onError) {
        onError(errorMessage);
      }
    }
  };

  /**
   * Calcul du temps restant de blocage
   */
  const getRemainingBlockTime = (): string => {
    if (!blockUntil) return '';

    const now = new Date();
    const remaining = blockUntil.getTime() - now.getTime();

    if (remaining <= 0) return '';

    const minutes = Math.ceil(remaining / (1000 * 60));
    return `${minutes} minute${minutes > 1 ? 's' : ''}`;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Indicateur de sécurité */}
      <div className="flex items-center gap-2 text-sm text-green-600 mb-4">
        <Shield className="h-4 w-4" />
        <span>Formulaire sécurisé avec protection anti-spam</span>
      </div>

      {/* Alertes de sécurité */}
      {isBlocked && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-700">
            Trop de tentatives. Veuillez patienter {getRemainingBlockTime()} avant de réessayer.
          </AlertDescription>
        </Alert>
      )}

      {/* Alerte d'erreur */}
      {submitError && !isSubmitting && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            {submitError}
          </AlertDescription>
        </Alert>
      )}

      {/* Alerte de succès */}
      {submitSuccess && !isSubmitting && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            Votre message a été envoyé avec succès !
          </AlertDescription>
        </Alert>
      )}

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {children}

        {/* Token CSRF caché - sera automatiquement ajouté par le hook */}

        {/* Informations de rate limiting */}
        {rateLimitInfo && (
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <p>
              <strong>Protection anti-spam :</strong> Maximum {rateLimitInfo.maxAttempts} tentatives
              par période de {rateLimitInfo.windowMinutes} minutes.
            </p>
            {attemptCount > 0 && (
              <p className="mt-1 text-orange-600">
                Tentative {attemptCount} sur {rateLimitInfo.maxAttempts}
              </p>
            )}
          </div>
        )}

        {/* Bouton de soumission */}
        <Button
          type="submit"
          disabled={isSubmitting || isBlocked}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {loadingText}
            </span>
          ) : (
            submitButtonText
          )}
        </Button>

        {/* Bouton de reset des erreurs */}
        {(submitError || submitSuccess) && !isSubmitting && (
          <Button
            type="button"
            variant="ghost"
            onClick={resetForm}
            className="w-full"
          >
            Nouveau message
          </Button>
        )}
      </form>
    </div>
  );
}

export default SecureForm;