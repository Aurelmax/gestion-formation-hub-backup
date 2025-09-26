'use client';

import { useState, useEffect } from 'react';

/**
 * Hook pour éviter les erreurs d'hydratation React
 * Convention Hybride Stricte - Hydratation Safe
 */

// ✅ Hook principal pour contenu client-only
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

// ✅ Hook pour timestamp côté client uniquement
export const useClientTimestamp = (): Date | null => {
  const [timestamp, setTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    setTimestamp(new Date());
  }, []);

  return timestamp;
};

// ✅ Hook pour localStorage safe
export const useLocalStorage = <T>(
  key: string,
  defaultValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState<T>(defaultValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setValue(JSON.parse(stored));
      }
    } catch {
      // En cas d'erreur, garder la valeur par défaut
      setValue(defaultValue);
    }
  }, [key, defaultValue]);

  const updateValue = (newValue: T): void => {
    if (isClient) {
      setValue(newValue);
      try {
        localStorage.setItem(key, JSON.stringify(newValue));
      } catch {
        // Échec silencieux si localStorage n'est pas disponible
      }
    }
  };

  return [value, updateValue];
};

// ✅ Hook pour window.confirm safe
export const useClientConfirm = (): ((message: string) => Promise<boolean>) => {
  const isClient = useIsClient();

  return (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (isClient && typeof window !== 'undefined') {
        resolve(window.confirm(message));
      } else {
        resolve(false);
      }
    });
  };
};

// ✅ Hook pour window.open safe
export const useClientNavigation = (): {
  openInNewTab: (url: string) => void;
  redirectTo: (url: string) => void;
} => {
  const isClient = useIsClient();

  return {
    openInNewTab: (url: string): void => {
      if (isClient && typeof window !== 'undefined') {
        window.open(url, '_blank');
      }
    },
    redirectTo: (url: string): void => {
      if (isClient && typeof window !== 'undefined') {
        window.location.href = url;
      }
    }
  };
};

// ✅ Hook pour génération d'ID unique côté client
export const useClientId = (): string | null => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    // Génération côté client uniquement
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2);
    setId(`${timestamp}-${random}`);
  }, []);

  return id;
};

// ✅ Hook pour current year safe
export const useCurrentYear = (): number => {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return year;
};