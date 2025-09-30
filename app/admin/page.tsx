import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Administration - Dashboard',
  description: 'Interface d\'administration de GestionMax',
};

export default async function AdminDashboardPage() {
  const { userId } = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!userId) {
    redirect('/auth?redirect_url=/admin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Administration</h1>
        <p className="text-gray-600 mt-2">Interface de gestion de GestionMax</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link
          href="/admin/users"
          className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Utilisateurs</h3>
          <p className="text-gray-600">Gérer les utilisateurs de la plateforme</p>
        </Link>

        <div className="bg-gray-100 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Paramètres système</h3>
          <p className="text-gray-500">Configuration avancée (à venir)</p>
        </div>

        <div className="bg-gray-100 p-6 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-500 mb-2">Sauvegardes</h3>
          <p className="text-gray-500">Gestion des sauvegardes (à venir)</p>
        </div>
      </div>
    </div>
  );
}