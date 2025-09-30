import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProgrammesPersonnalisesManager from './ProgrammesPersonnalisesManager';

export const metadata: Metadata = {
  title: 'Administration Programmes Personnalisés - GestionMax',
  description: 'Gestion et administration des programmes de formation personnalisés créés suite aux entretiens de positionnement',
};

export default async function ProgrammesPersonnalisesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth?redirect_url=/admin/programmes-personnalises');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Administration des Programmes Personnalisés</h1>
        <p className="text-gray-600 mt-2">
          Gérez et modifiez les programmes de formation personnalisés créés suite aux entretiens de positionnement
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ProgrammesPersonnalisesManager />
      </div>
    </div>
  );
}