'use client';

import { ReactNode } from 'react';
import { useClientConfirm, useClientNavigation } from '@/hooks/useHydrationSafe';

/**
 * Composants d'actions client-safe pour éviter les erreurs d'hydratation
 * Convention Hybride Stricte
 */

interface ConfirmButtonProps {
  children: ReactNode;
  message: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
  disabled?: boolean;
}

// ✅ Bouton avec confirmation client-safe
export const ConfirmButton: React.FC<ConfirmButtonProps> = ({
  children,
  message,
  onConfirm,
  className = "",
  disabled = false
}) => {
  const clientConfirm = useClientConfirm();

  const handleClick = async (): Promise<void> => {
    const confirmed = await clientConfirm(message);
    if (confirmed) {
      await onConfirm();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

interface ExternalLinkButtonProps {
  children: ReactNode;
  url: string;
  className?: string;
  disabled?: boolean;
}

// ✅ Bouton d'ouverture d'URL client-safe
export const ExternalLinkButton: React.FC<ExternalLinkButtonProps> = ({
  children,
  url,
  className = "",
  disabled = false
}) => {
  const { openInNewTab } = useClientNavigation();

  const handleClick = (): void => {
    openInNewTab(url);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

interface FileUploadTriggerProps {
  children: ReactNode;
  fileInputId: string;
  className?: string;
  disabled?: boolean;
}

// ✅ Déclencheur de sélection de fichier client-safe
export const FileUploadTrigger: React.FC<FileUploadTriggerProps> = ({
  children,
  fileInputId,
  className = "",
  disabled = false
}) => {
  const handleClick = (): void => {
    if (typeof document !== 'undefined') {
      const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

interface RedirectButtonProps {
  children: ReactNode;
  url: string;
  className?: string;
  disabled?: boolean;
}

// ✅ Bouton de redirection client-safe
export const RedirectButton: React.FC<RedirectButtonProps> = ({
  children,
  url,
  className = "",
  disabled = false
}) => {
  const { redirectTo } = useClientNavigation();

  const handleClick = (): void => {
    redirectTo(url);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};