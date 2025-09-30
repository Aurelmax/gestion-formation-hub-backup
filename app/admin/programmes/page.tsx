import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ProgrammesManager from './ProgrammesManager';

export const metadata: Metadata = {
  title: 'Administration - Programmes de Formation',
  description: 'Gestion administrative des programmes de formation catalogue et sur-mesure',
};

export default async function AdminProgrammesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth?redirect_url=/admin/programmes');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <ProgrammesManager />
      </div>
    </div>
  );
}