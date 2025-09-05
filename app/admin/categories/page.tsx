import { Metadata } from 'next';
import CategoriesManager from '@/components/admin/CategoriesManager';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Gestion des catégories - Administration',
  description: 'Gérez les catégories de formations',
};

// Disable static generation for admin page (requires auth)
export const dynamic = 'force-dynamic';

export default async function AdminCategoriesPage() {
  // Auth will be handled client-side through middleware or auth provider

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
