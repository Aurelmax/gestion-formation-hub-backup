"use client";
import React from "react";
import FormationsList from "@/components/formations/FormationsList";

export default function ProgrammesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gestion des programmes</h1>
      <FormationsList />
    </div>
  );
}