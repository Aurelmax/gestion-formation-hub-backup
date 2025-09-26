'use client';

import { ReactNode, useState, useEffect } from 'react';

/**
 * Composant wrapper pour contenu client-only
 * Convention Hybride Stricte - Prévention Erreurs Hydratation
 */

interface ClientSafeWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
  suppressWarning?: boolean;
}

// ✅ Wrapper pour contenu client uniquement
export const ClientSafeWrapper: React.FC<ClientSafeWrapperProps> = ({
  children,
  fallback = <div style={{ minHeight: '1rem' }} />, // Placeholder neutre
  suppressWarning = false
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Structure HTML identique server/client
  if (!mounted) {
    return (
      <div suppressHydrationWarning={suppressWarning}>
        {fallback}
      </div>
    );
  }

  return <div>{children}</div>;
};

// ✅ HOC pour composants nécessitant client-only
export function withClientOnly<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  const ClientOnlyComponent: React.FC<P> = (props) => {
    return (
      <ClientSafeWrapper fallback={fallback}>
        <WrappedComponent {...props} />
      </ClientSafeWrapper>
    );
  };

  ClientOnlyComponent.displayName = `withClientOnly(${
    WrappedComponent.displayName || WrappedComponent.name
  })`;

  return ClientOnlyComponent;
}

// ✅ Composant pour contenu dynamique sécurisé
interface DynamicContentProps {
  render: () => ReactNode;
  fallback?: ReactNode;
  deps?: React.DependencyList;
}

export const DynamicContent: React.FC<DynamicContentProps> = ({
  render,
  fallback = null,
  deps = []
}) => {
  const [content, setContent] = useState<ReactNode>(fallback);

  useEffect(() => {
    setContent(render());
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps

  return <>{content}</>;
};