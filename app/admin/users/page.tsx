import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UsersManagerSimple from './UsersManagerSimple';

export const metadata: Metadata = {
  title: 'Administration - Utilisateurs',
  description: 'Gestion des utilisateurs de la plateforme',
};

export default async function AdminUsersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect('/auth?redirect_url=/admin/users');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <UsersManagerSimple />
      </div>
    </div>
  );
}