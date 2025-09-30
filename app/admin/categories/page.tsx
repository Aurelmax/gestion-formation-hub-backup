import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CategoriesManager from './CategoriesManager';

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
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <CategoriesManager />
      </div>
    </div>
  );
}
