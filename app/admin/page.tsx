import { Metadata } from 'next';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'Tableau de bord - Administration',
  description: 'Tableau de bord administrateur',
};

// Disable static generation for admin page (requires auth)
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  // Auth will be handled client-side through middleware or auth provider

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Tableau de bord</h1>
      <AdminNav />
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-6">Bienvenue dans l'administration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="font-medium mb-2">Catégories</h3>
            <p className="text-sm text-gray-600 mb-4">Gérez les catégories de formations</p>
            <a 
              href="/admin/categories" 
              className="text-blue-600 hover:underline text-sm"
            >
              Gérer les catégories →
            </a>
          </div>
          <div className="border rounded-lg p-6">
            <h3 className="font-medium mb-2">Programmes</h3>
            <p className="text-sm text-gray-600 mb-4">Gérez les programmes de formation</p>
            <a 
              href="/admin/programmes" 
              className="text-blue-600 hover:underline text-sm"
            >
              Gérer les programmes →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
