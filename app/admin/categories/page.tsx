'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminCategoriesPage() {
  const router = useRouter();

  useEffect(() => {
    // Rediriger vers le dashboard avec l'onglet formations/categories
    router.replace('/dashboard?tab=formations&subtab=categories');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg">Redirection vers le dashboard...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mt-4"></div>
      </div>
    </div>
  );
}
