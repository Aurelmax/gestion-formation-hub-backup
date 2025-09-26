import { useState, useEffect, useCallback } from 'react';
import { addCSRFToken } from '@/lib/csrf';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    type: string;
    message: string;
    details?: any;
  };
  message?: string;
}

interface UseSecureApiOptions {
  autoFetch?: boolean;
  onError?: (error: any) => void;
  onSuccess?: (data: any) => void;
}

interface UseSecureApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  post: (data: any) => Promise<boolean>;
  put: (data: any) => Promise<boolean>;
  delete: () => Promise<boolean>;
}

/**
 * Hook pour utiliser les APIs avec protection CSRF et gestion d'erreurs sécurisée
 */
export function useSecureApi<T>(
  endpoint: string,
  options: UseSecureApiOptions = {}
): UseSecureApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État pour le token CSRF
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  // Récupérer le token CSRF au montage
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('/api/csrf');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.csrfToken) {
            setCsrfToken(result.csrfToken);
          }
        }
      } catch (error) {
        console.warn('Could not fetch CSRF token:', error);
      }
    };

    fetchCSRFToken();
  }, []);

  /**
   * Fonction générique pour effectuer des requêtes sécurisées
   */
  const secureRequest = useCallback(async (
    url: string,
    requestOptions: RequestInit = {}
  ): Promise<ApiResponse<T>> => {
    try {
      // Ajouter le token CSRF automatiquement
      const secureOptions = addCSRFToken({
        headers: {
          'Content-Type': 'application/json',
          ...requestOptions.headers,
        },
        ...requestOptions,
      });

      const response = await fetch(url, secureOptions);
      const result = await response.json();

      // Gestion des erreurs de rate limiting
      if (response.status === 429) {
        const retryAfter = response.headers.get('retry-after');
        throw new Error(
          `Trop de requêtes. Veuillez réessayer ${retryAfter ? `dans ${retryAfter} secondes` : 'plus tard'}.`
        );
      }

      // Gestion des erreurs CSRF
      if (result.error?.type === 'csrf_validation_failed') {
        // Tenter de récupérer un nouveau token CSRF
        const csrfResponse = await fetch('/api/csrf');
        if (csrfResponse.ok) {
          const csrfResult = await csrfResponse.json();
          if (csrfResult.success) {
            setCsrfToken(csrfResult.csrfToken);
            throw new Error('Token de sécurité expiré. Veuillez réessayer.');
          }
        }
        throw new Error('Erreur de sécurité. Veuillez actualiser la page.');
      }

      if (!response.ok) {
        throw new Error(result.error?.message || `Erreur ${response.status}`);
      }

      return result;
    } catch (err) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('Erreur de connexion');
    }
  }, []);

  /**
   * Récupérer les données (GET)
   */
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await secureRequest(endpoint);
      setData(result.data || null);

      if (options.onSuccess) {
        options.onSuccess(result.data);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, secureRequest, options]);

  /**
   * Créer une ressource (POST)
   */
  const post = useCallback(async (postData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await secureRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(postData),
      });

      if (result.success) {
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
        return true;
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la création');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [endpoint, secureRequest, options]);

  /**
   * Mettre à jour une ressource (PUT)
   */
  const put = useCallback(async (putData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await secureRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify(putData),
      });

      if (result.success) {
        if (options.onSuccess) {
          options.onSuccess(result.data);
        }
        return true;
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [endpoint, secureRequest, options]);

  /**
   * Supprimer une ressource (DELETE)
   */
  const deleteResource = useCallback(async (): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const result = await secureRequest(endpoint, {
        method: 'DELETE',
      });

      if (result.success) {
        if (options.onSuccess) {
          options.onSuccess(null);
        }
        return true;
      } else {
        throw new Error(result.error?.message || 'Erreur lors de la suppression');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(errorMessage);

      if (options.onError) {
        options.onError(errorMessage);
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, [endpoint, secureRequest, options]);

  // Auto-fetch si demandé
  useEffect(() => {
    if (options.autoFetch && csrfToken) {
      refetch();
    }
  }, [options.autoFetch, csrfToken, refetch]);

  return {
    data,
    loading,
    error,
    refetch,
    post,
    put,
    delete: deleteResource,
  };
}

/**
 * Hook spécialisé pour les réclamations avec toutes les protections
 */
export function useSecureReclamations() {
  return useSecureApi<any>('/api/reclamations', {
    autoFetch: true,
    onError: (error) => {
      // Log des erreurs côté client pour le debugging (sans données sensibles)
      console.warn('Reclamations API error:', error);
    }
  });
}

/**
 * Hook pour les formulaires sécurisés
 */
export function useSecureForm<T>(endpoint: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const submitForm = useCallback(async (formData: T): Promise<boolean> => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const secureOptions = addCSRFToken({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const response = await fetch(endpoint, secureOptions);
      const result = await response.json();

      if (response.status === 429) {
        throw new Error('Trop de soumissions. Veuillez patienter avant de réessayer.');
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error?.message || 'Erreur lors de l\'envoi');
      }

      setSubmitSuccess(true);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de soumission';
      setSubmitError(errorMessage);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [endpoint]);

  return {
    submitForm,
    isSubmitting,
    submitError,
    submitSuccess,
    resetForm: () => {
      setSubmitError(null);
      setSubmitSuccess(false);
    }
  };
}