'use client';

import dynamic from 'next/dynamic';

// Importer le composant Catalogue avec chargement dynamique
const Catalogue = dynamic(() => import('@/components/Catalogue'), {
  loading: () => (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false, // Désactiver le rendu côté serveur pour ce composant
});

export default function CatalogueClient() {
  return <Catalogue />;
}
