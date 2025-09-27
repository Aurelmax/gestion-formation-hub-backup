import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CategoriesManager from '@/components/admin/CategoriesManager';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Gestion des catégories - Administration',
  description: 'Gérez les catégories de formations',
};

export default async function AdminCategoriesPage() {
  const { userId } = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/admin/categories');
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Administration</h1>
      <AdminNav />
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Gestion des catégories</h2>
        <CategoriesManager />
      </div>
    </div>
  );
}