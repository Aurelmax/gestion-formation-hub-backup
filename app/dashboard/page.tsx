"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from 'next/dynamic';
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Calendar, FileCheck, Accessibility, Search, MessageSquareWarning, ClipboardCheck, Database, Folder, Award } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Composant de chargement réutilisable
const LazyLoadingSpinner = () => (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    <span className="ml-2 text-gray-600">Chargement...</span>
  </div>
);

// Lazy loading pour les gros composants uniquement
const RendezVousListUnified = dynamic(() => import("@/components/rendez-vous/RendezVousListUnified"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const CompetenceManager = dynamic(() => import("@/components/competences/CompetenceManager"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

// Lazy loading pour tous les gros composants d'onglets
const FormationsList = dynamic(() => import("@/components/formations/FormationsList"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const ApprenantsList = dynamic(() => import("@/components/apprenants/ApprenantsList"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const ConformiteQualiopi = dynamic(() => import("@/components/conformite/ConformiteQualiopi"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const AccessibiliteManager = dynamic(() => import("@/components/accessibilite/AccessibiliteManager"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const VeilleManager = dynamic(() => import("@/components/veille/VeilleManager"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const ReclamationsList = dynamic(() => import("@/components/reclamations/ReclamationsList"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const ActionsCorrectivesList = dynamic(() => import("@/components/actions-correctives/ActionsCorrectivesList"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

const CategoriesManager = dynamic(() => import("@/components/admin/CategoriesManager"), {
  loading: () => <LazyLoadingSpinner />,
  ssr: false
});

// Imports normaux pour les composants légers
import Header from "@/components/Header";

function DashboardContent() {
  const [activeTab, setActiveTab] = useState("formations");
  const [activeSubTab, setActiveSubTab] = useState("bibliotheque");
  const searchParams = useSearchParams();
  const { user, signOut } = useAuth();

  // Gérer les paramètres d'URL pour la navigation directe vers un programme
  useEffect(() => {
    const tab = searchParams.get('tab');
    const subtab = searchParams.get('subtab');
    const programme = searchParams.get('programme');

    if (tab) setActiveTab(tab);
    if (subtab) setActiveSubTab(subtab);

    // Si un programme spécifique est demandé, s'assurer qu'on est dans le bon onglet
    if (programme && tab === 'formations' && subtab === 'bibliotheque') {
      setActiveTab('formations');
      setActiveSubTab('bibliotheque');
    }

    // Redirection des anciennes URLs
    if (subtab === 'admin' || subtab === 'publiees' || subtab === 'catalogue') {
      setActiveSubTab('bibliotheque');
    }
  }, [searchParams]);

  // Preloading intelligent des données critiques
  useEffect(() => {
    const preloadCriticalData = async () => {
      try {
        // Précharger les catégories (utilisées par plusieurs onglets)
        const preloadPromises = [
          fetch('/api/categories').then(r => r.json()).catch(() => null)
        ];

        // Précharger conditionnellement selon l'onglet actif
        if (activeTab === 'formations') {
          preloadPromises.push(
            fetch('/api/programmes-formation?limit=10').then(r => r.json()).catch(() => null)
          );
        } else if (activeTab === 'apprenants') {
          preloadPromises.push(
            fetch('/api/apprenants?limit=5').then(r => r.json()).catch(() => null)
          );
        } else if (activeTab === 'rendez-vous') {
          preloadPromises.push(
            fetch('/api/rendezvous?limit=5').then(r => r.json()).catch(() => null)
          );
        }

        await Promise.allSettled(preloadPromises);
        console.log('✅ Critical data preloaded for tab:', activeTab);
      } catch (error) {
        console.warn('⚠️ Preloading failed:', error);
      }
    };

    preloadCriticalData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex justify-between items-center">
        <div>
          {user && (
            <p className="text-sm text-gray-500">
              Connecté en tant que: {user.email}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={signOut}>
          Se déconnecter
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 p-1 w-full">
            <TabsTrigger value="formations" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Programmes
            </TabsTrigger>
            <TabsTrigger value="apprenants" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Apprenants
            </TabsTrigger>
            <TabsTrigger value="rendez-vous" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Rendez-vous
            </TabsTrigger>
            <TabsTrigger value="competences" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              Compétences
            </TabsTrigger>
            <TabsTrigger value="reclamations" className="flex items-center gap-2">
              <MessageSquareWarning className="h-4 w-4" />
              Réclamations
            </TabsTrigger>
            <TabsTrigger value="actions-correctives" className="flex items-center gap-2">
              <ClipboardCheck className="h-4 w-4" />
              Actions Correctives
            </TabsTrigger>
            <TabsTrigger value="veille" className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Veille
            </TabsTrigger>
            <TabsTrigger value="accessibilite" className="flex items-center gap-2">
              <Accessibility className="h-4 w-4" />
              Accessibilité
            </TabsTrigger>
            <TabsTrigger value="conformite" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Conformité
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formations">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Gestion des programmes</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="bibliotheque" className="flex items-center justify-center gap-1">
                      <Database className="h-4 w-4" />
                      Bibliothèque
                    </TabsTrigger>
                    <TabsTrigger value="categories" className="flex items-center justify-center gap-1">
                      <Folder className="h-4 w-4" />
                      Catégories
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="bibliotheque" className="mt-4">
                    <FormationsList />
                  </TabsContent>
                  <TabsContent value="categories" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Gestion des catégories</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CategoriesManager />
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="apprenants">
            <ApprenantsList />
          </TabsContent>

          <TabsContent value="rendez-vous">
            <RendezVousListUnified />
          </TabsContent>

          <TabsContent value="competences">
            <CompetenceManager />
          </TabsContent>

          <TabsContent value="reclamations">
            <ReclamationsList />
          </TabsContent>

          <TabsContent value="actions-correctives">
            <ActionsCorrectivesList />
          </TabsContent>

          <TabsContent value="veille">
            <VeilleManager />
          </TabsContent>

          <TabsContent value="accessibilite">
            <AccessibiliteManager />
          </TabsContent>

          <TabsContent value="conformite">
            <ConformiteQualiopi />
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<LazyLoadingSpinner />}>
      <DashboardContent />
    </Suspense>
  );
}
