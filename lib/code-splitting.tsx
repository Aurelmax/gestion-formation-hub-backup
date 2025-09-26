/**
 * Code splitting utilities for optimized bundle management
 * Provides strategic component and route-based splitting
 */

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Loading component for dynamic imports
 */
const DefaultLoadingComponent = () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-2 text-gray-600">Chargement...</span>
  </div>
);

/**
 * Create loading component with custom message
 */
const createLoadingComponent = (message: string = "Chargement...") => () => (
  <div className="flex items-center justify-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    <span className="ml-2 text-gray-600">{message}</span>
  </div>
);

/**
 * Optimized dynamic import with preloading strategy
 */
export function createOptimizedDynamic<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options?: {
    loading?: ComponentType;
    loadingMessage?: string;
    ssr?: boolean;
    preload?: boolean;
  }
) {
  const loadingComponent = options?.loading ||
    (options?.loadingMessage ? createLoadingComponent(options.loadingMessage) : DefaultLoadingComponent);

  const component = dynamic(importFn, {
    loading: loadingComponent,
    ssr: options?.ssr ?? true,
  });

  // Preload the component when specified
  if (options?.preload) {
    // Preload after a short delay to avoid blocking initial render
    setTimeout(() => {
      importFn().catch(console.warn);
    }, 100);
  }

  return component;
}

/**
 * Pre-configured dynamic components for common use cases
 */

// Admin/Dashboard components (heavy forms and tables)
export const AdminComponents = {
  FormationsList: createOptimizedDynamic(
    () => import('@/components/formations/FormationsList'),
    { loadingMessage: "Chargement des formations...", ssr: false }
  ),

  RendezVousListUnified: createOptimizedDynamic(
    () => import('@/components/rendez-vous/RendezVousListUnified'),
    { loadingMessage: "Chargement des rendez-vous...", ssr: false }
  ),

  ProgrammeFormEnhanced: createOptimizedDynamic(
    () => import('@/components/formations/ProgrammeFormEnhanced'),
    { loadingMessage: "Chargement du formulaire...", ssr: false }
  ),

  CompteRenduAvanceForm: createOptimizedDynamic(
    () => import('@/components/rendez-vous/CompteRenduAvanceForm'),
    { loadingMessage: "Chargement du formulaire de compte-rendu...", ssr: false }
  ),
};

// Public components (can be server-rendered)
export const PublicComponents = {
  CatalogueClient: createOptimizedDynamic(
    () => import('@/components/client/CatalogueClient'),
    { loadingMessage: "Chargement du catalogue...", ssr: true, preload: true }
  ),

  ArticlesCarousel: createOptimizedDynamic(
    () => import('@/components/blog/ArticlesCarousel'),
    { loadingMessage: "Chargement des articles...", ssr: true }
  ),

  ContactFormSecure: createOptimizedDynamic(
    () => import('@/components/ContactFormSecure'),
    { loadingMessage: "Chargement du formulaire...", ssr: true }
  ),
};

// Animation-heavy components (should not be server-rendered)
export const AnimationComponents = {
  GSAPCatalogueSection: createOptimizedDynamic(
    () => import('@/components/animations/GSAPCatalogueSection'),
    { loadingMessage: "Chargement des animations...", ssr: false }
  ),

  IllustrationSection: createOptimizedDynamic(
    () => import('@/components/IllustrationSection'),
    { loadingMessage: "Chargement des illustrations...", ssr: false }
  ),
};

// Map components (Leaflet-based, client-only)
export const MapComponents = {
  MapLocation: createOptimizedDynamic(
    () => import('@/components/MapLocation'),
    { loadingMessage: "Chargement de la carte...", ssr: false }
  ),
};

/**
 * Route-based code splitting configuration
 */
export const RouteChunks = {
  // Admin routes - heavy components, split aggressively
  dashboard: {
    chunk: 'dashboard',
    priority: 'low',
    preload: false,
  },

  // Public routes - lighter components, can preload
  homepage: {
    chunk: 'public',
    priority: 'high',
    preload: true,
  },

  // Form routes - medium priority
  contact: {
    chunk: 'forms',
    priority: 'medium',
    preload: false,
  },
};

/**
 * Preload strategy for route transitions
 */
export class PreloadManager {
  private preloadedChunks = new Set<string>();
  private preloadPromises = new Map<string, Promise<any>>();

  /**
   * Preload components for a specific route
   */
  async preloadRoute(routeName: keyof typeof RouteChunks): Promise<void> {
    const config = RouteChunks[routeName];

    if (this.preloadedChunks.has(config.chunk)) {
      return;
    }

    if (this.preloadPromises.has(config.chunk)) {
      return this.preloadPromises.get(config.chunk);
    }

    const preloadPromise = this.executePreload(routeName, config);
    this.preloadPromises.set(config.chunk, preloadPromise);

    return preloadPromise;
  }

  /**
   * Execute the actual preloading
   */
  private async executePreload(routeName: string, config: any): Promise<void> {
    try {
      switch (routeName) {
        case 'homepage':
          // Preload critical homepage components
          await Promise.all([
            import('@/components/client/CatalogueClient'),
            import('@/components/blog/ArticlesCarousel'),
          ]);
          break;

        case 'dashboard':
          // Preload only when user navigates to dashboard
          await Promise.all([
            import('@/components/formations/FormationsList'),
            import('@/components/rendez-vous/RendezVousListUnified'),
          ]);
          break;

        case 'contact':
          // Preload form components
          await Promise.all([
            import('@/components/ContactFormSecure'),
            import('@/components/MapLocation'),
          ]);
          break;
      }

      this.preloadedChunks.add(config.chunk);
      console.log(`✅ Preloaded chunk: ${config.chunk} for route: ${routeName}`);
    } catch (error) {
      console.warn(`⚠️ Failed to preload chunk: ${config.chunk}`, error);
    }
  }

  /**
   * Preload components on hover (for navigation links)
   */
  onLinkHover(routeName: keyof typeof RouteChunks): void {
    const config = RouteChunks[routeName];

    if (config.priority === 'high' && !this.preloadedChunks.has(config.chunk)) {
      setTimeout(() => {
        this.preloadRoute(routeName);
      }, 300); // Delay to avoid preloading on accidental hovers
    }
  }

  /**
   * Get preload stats
   */
  getStats() {
    return {
      preloadedChunks: Array.from(this.preloadedChunks),
      pendingPreloads: Array.from(this.preloadPromises.keys()),
      totalPreloaded: this.preloadedChunks.size,
    };
  }
}

// Singleton preload manager
export const preloadManager = new PreloadManager();

/**
 * Hook for component preloading in React components
 */
export function usePreload() {
  return {
    preloadRoute: (routeName: keyof typeof RouteChunks) => preloadManager.preloadRoute(routeName),
    onLinkHover: (routeName: keyof typeof RouteChunks) => preloadManager.onLinkHover(routeName),
    getStats: () => preloadManager.getStats(),
  };
}

/**
 * Create navigation link with smart preloading
 */
export function createSmartLink(
  Component: any,
  routeName: keyof typeof RouteChunks
) {
  return function SmartLink(props: any) {
    const handleMouseEnter = () => {
      preloadManager.onLinkHover(routeName);
      props.onMouseEnter?.();
    };

    return (
      <Component
        {...props}
        onMouseEnter={handleMouseEnter}
      />
    );
  };
}

export default {
  createOptimizedDynamic,
  AdminComponents,
  PublicComponents,
  AnimationComponents,
  MapComponents,
  preloadManager,
  usePreload,
  createSmartLink,
};