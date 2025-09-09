"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface OptimisticButtonProps {
  onClick: () => Promise<void>;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  disabled?: boolean;
  loadingText?: string;
}

/**
 * Bouton avec feedback immédiat pour améliorer l'UX
 */
export function OptimisticButton({
  onClick,
  children,
  variant = "default",
  size = "default",
  className,
  disabled,
  loadingText = "Chargement..."
}: OptimisticButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading || disabled) return;

    try {
      setIsLoading(true);
      await onClick();
    } catch (error) {
      console.error('Erreur lors de l\'action:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      disabled={disabled || isLoading}
      onClick={handleClick}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}