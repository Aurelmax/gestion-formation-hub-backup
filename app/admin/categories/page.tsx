import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CategoriesManager from '@/components/admin/CategoriesManager';
import AdminNav from '@/components/admin/AdminNav';
import { auth } from '../../../app/auth';

export const metadata: Metadata = {
  title: 'Gestion des catégories - Administration',
  description: 'Gérez les catégories de formations',
};

export default async function AdminCategoriesPage() {
  const session = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!session) {
    redirect('/auth?callbackUrl=/admin/categories');
  }

  // Vérifier les permissions si nécessaire
  // if (session.user.role !== 'admin') {
  //   redirect('/unauthorized');
  // }

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
