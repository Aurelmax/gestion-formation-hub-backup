"use client";

import { useState } from 'react';
import { useClerkAuth } from '@/hooks/useClerkAuth';

export default function TestApiPage() {
  const { isSignedIn } = useClerkAuth();
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testProtectedRoute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/protected/example');
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur inconnue');
      }
      
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testPostRoute = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/protected/example', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erreur inconnue');
      }
      
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Test des Routes API Protégées</h1>
      
      <div className="space-y-6">
        {/* État de l'authentification */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">État de l'Authentification</h2>
          <p className={isSignedIn ? 'text-green-600' : 'text-red-600'}>
            {isSignedIn ? '✅ Connecté' : '❌ Non connecté'}
          </p>
        </div>

        {/* Tests des routes */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Tests des Routes</h2>
          <div className="space-y-4">
            <button
              onClick={testProtectedRoute}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Test en cours...' : 'Tester GET /api/protected/example'}
            </button>
            
            <button
              onClick={testPostRoute}
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 ml-4"
            >
              {loading ? 'Test en cours...' : 'Tester POST /api/protected/example'}
            </button>
          </div>
        </div>

        {/* Réponse */}
        {response && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Réponse de l'API</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}

        {/* Erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-red-800">Erreur</h2>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-800">Instructions</h2>
          <ul className="list-disc list-inside space-y-2 text-blue-700">
            <li>Connectez-vous d'abord via /auth/sign-in</li>
            <li>Testez ensuite les routes API protégées</li>
            <li>Les routes devraient retourner vos informations utilisateur</li>
            <li>Si vous n'êtes pas connecté, vous devriez recevoir une erreur 401</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
