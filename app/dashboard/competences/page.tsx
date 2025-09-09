"use client";

import CompetenceManager from "@/components/competences/CompetenceManager";

export default function CompetencesPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Compétences</h1>
        <p className="text-gray-600 mt-2">
          Suivez et développez vos compétences professionnelles
        </p>
      </div>
      
      <CompetenceManager />
    </div>
  );
}