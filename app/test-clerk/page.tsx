"use client";

import { useAuth } from '@/hooks/useAuth';
import { SignInButton, SignOutButton, UserButton } from '@clerk/nextjs';

export default function TestClerkPage() {
  const { user, isSignedIn, loading, error } = useAuth();

  if (loading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Test d'Intégration Clerk</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* État de l'authentification */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">État de l'Authentification</h2>
          <div className="space-y-2">
            <p><strong>Connecté:</strong> {isSignedIn ? '✅ Oui' : '❌ Non'}</p>
            <p><strong>Chargement:</strong> {loading ? '⏳ Oui' : '✅ Terminé'}</p>
            {error && <p><strong>Erreur:</strong> <span className="text-red-500">{error}</span></p>}
          </div>
        </div>

        {/* Informations utilisateur */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informations Utilisateur</h2>
          {user ? (
            <div className="space-y-2">
              <p><strong>ID:</strong> {user.id}</p>
              <p><strong>Email:</strong> {user.email || 'Non défini'}</p>
              <p><strong>Nom:</strong> {user.name || 'Non défini'}</p>
              <p><strong>Rôle:</strong> {user.role || 'Non défini'}</p>
              {user.image && (
                <div>
                  <strong>Image:</strong>
                  <img src={user.image} alt="Avatar" className="w-16 h-16 rounded-full mt-2" />
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500">Aucun utilisateur connecté</p>
          )}
        </div>

        {/* Actions */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Actions</h2>
          <div className="space-y-4">
            {!isSignedIn ? (
              <div>
                <SignInButton mode="modal">
                  <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Se connecter
                  </button>
                </SignInButton>
              </div>
            ) : (
              <div className="space-y-2">
                <UserButton />
                <div>
                  <SignOutButton>
                    <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                      Se déconnecter
                    </button>
                  </SignOutButton>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Informations de débogage */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Informations de Débogage</h2>
          <div className="space-y-2 text-sm">
            <p><strong>User Object:</strong></p>
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(user, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
