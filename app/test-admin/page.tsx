"use client";
import { useState, useEffect } from "react";
import api from "@/services/api";

export default function TestAdminPage() {
  const [data, setData] = useState({ programmes: [], categories: [], loading: true, error: null });

  useEffect(() => {
    console.log('🚀 Test Direct - useEffect appelé');

    const testDirectFetch = async () => {
      try {
        console.log('📡 Test Direct - Appel fetch natif...');

        // Test avec fetch natif
        const programmesResponse = await fetch('/api/programmes-formation');
        const programmesData = await programmesResponse.json();
        console.log('📡 Test Direct - Programmes fetch:', programmesData.data?.length || 0, 'items');

        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        console.log('📡 Test Direct - Catégories fetch:', categoriesData?.length || 0, 'items');

        setData({
          programmes: programmesData.data || [],
          categories: categoriesData || [],
          loading: false,
          error: null
        });
        console.log('✅ Test Direct - Données fetch mises à jour avec succès');
      } catch (error) {
        console.error('❌ Test Direct - Erreur fetch:', error?.message || error);
        setData(prev => ({ ...prev, loading: false, error: error?.message || 'Erreur fetch' }));
      }
    };

    // Appel avec fetch natif
    testDirectFetch().catch(console.error);
  }, []);

  console.log('🔍 Test Direct - État actuel:', {
    programmes: data.programmes?.length || 0,
    categories: data.categories?.length || 0,
    loading: data.loading,
    error: data.error
  });

  if (data.loading) {
    return <div>Chargement...</div>;
  }

  if (data.error) {
    return <div>Erreur: {data.error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Direct API - Debug</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Programmes ({data.programmes?.length || 0})</h2>
        <div className="border p-4 bg-gray-50">
          {data.programmes?.length > 0 ? (
            <ul>
              {data.programmes.map((p) => (
                <li key={p.id} className="mb-2">
                  <strong>{p.titre || p.code}</strong> - {p.type} - Actif: {p.estActif ? 'Oui' : 'Non'}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucun programme trouvé</p>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Catégories ({data.categories?.length || 0})</h2>
        <div className="border p-4 bg-gray-50">
          {data.categories?.length > 0 ? (
            <ul>
              {data.categories.map((c) => (
                <li key={c.id} className="mb-2">
                  <strong>{c.titre}</strong> - {c.code}
                </li>
              ))}
            </ul>
          ) : (
            <p>Aucune catégorie trouvée</p>
          )}
        </div>
      </div>
    </div>
  );
}