import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import VeilleManager from '@/components/veille/VeilleManager';

export const metadata: Metadata = {
  title: 'Veille & Actualités - GestionMax',
  description: 'Gestion de la veille réglementaire, métier et innovation pour votre centre de formation',
};

export default async function VeillePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth?redirect_url=/dashboard/veille');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Veille & Actualités</h1>
        <p className="text-gray-600 mt-2">
          Suivez les évolutions réglementaires, métier et innovations dans votre domaine
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <VeilleManager />
      </div>
    </div>
  );
}