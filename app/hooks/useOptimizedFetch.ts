import { useState, useEffect, useRef } from 'react';

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

// Cache global pour réutiliser les données entre composants
const globalCache = new Map<string, CacheItem<any>>();

interface UseOptimizedFetchOptions {
  cacheTime?: number; // Durée de cache en millisecondes (défaut: 5 min)
  staleTime?: number; // Temps avant de considérer les données obsolètes (défaut: 30s)
}

/**
 * Hook optimisé pour réduire les appels API redondants
 */
export function useOptimizedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  options: UseOptimizedFetchOptions = {}
) {
  const { cacheTime = 5 * 60 * 1000, staleTime = 30 * 1000 } = options;
  
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchRef = useRef<AbortController | null>(null);

  const fetchData = async (force = false) => {
    // Vérifier le cache d'abord
    const cached = globalCache.get(key);
    if (cached && !force) {
      const age = Date.now() - cached.timestamp;
      if (age < cacheTime) {
        setData(cached.data);
        if (age < staleTime) {
          return; // Données fraîches, pas besoin de refetch
        }
      }
    }

    // Annuler la requête précédente si elle existe
    if (fetchRef.current) {
      fetchRef.current.abort();
    }

    // Créer un nouveau contrôleur d'abort
    fetchRef.current = new AbortController();

    try {
      setLoading(true);
      setError(null);

      const result = await fetchFn();
      
      // Mettre en cache le résultat
      globalCache.set(key, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Requête annulée, ne pas traiter l'erreur
        return;
      }
      setError(err instanceof Error ? err : new Error('Erreur inconnue'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      // Nettoyer à la destruction du composant
      if (fetchRef.current) {
        fetchRef.current.abort();
      }
    };
  }, [key]);

  const refetch = () => fetchData(true);
  const invalidateCache = () => globalCache.delete(key);

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache
  };
}