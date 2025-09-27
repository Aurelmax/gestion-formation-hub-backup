import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Administration - Catégories',
  description: 'Gestion des catégories de formations',
};

export default async function AdminCategoriesPage() {
  const { userId } = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!userId) {
    redirect('/auth?redirect_url=/admin/categories');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Catégories</h1>
        <p className="text-gray-600 mt-2">Gérez les catégories de formations disponibles</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <p>Interface de gestion des catégories en cours de développement...</p>
        {/* TODO: Intégrer CategoriesManager component */}
      </div>
    </div>
  );
}
