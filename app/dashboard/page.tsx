"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, BookOpen, Calendar, FileCheck, Accessibility, Search, MessageSquareWarning, ClipboardCheck, Database, LogOut } from "lucide-react";
import FormationsList from "@/components/formations/FormationsList";
import ProgrammesManager from "@/components/formations/ProgrammesManager";
import ApprenantsList from "@/components/apprenants/ApprenantsList";
import RendezVousListUnified from "@/components/rendez-vous/RendezVousListUnified";
import ConformiteQualiopi from "@/components/conformite/ConformiteQualiopi";
import AccessibiliteManager from "@/components/accessibilite/AccessibiliteManager";
import VeilleManager from "@/components/veille/VeilleManager";
import CompetenceManager from "@/components/competences/CompetenceManager";
import ReclamationsList from "@/components/reclamations/ReclamationsList";
import ActionsCorrectivesList from "@/components/actions-correctives/ActionsCorrectivesList";
import Header from "@/components/Header";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("formations");
  const { data: session, status } = useSession();
  const router = useRouter();

  // Vérification de l'authentification
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  // Affichage de chargement pendant la vérification
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-medium">Chargement...</div>
          <div className="text-sm text-gray-500 mt-2">Vérification de l'authentification</div>
        </div>
      </div>
    );
  }

  // Si pas authentifié, ne pas afficher le dashboard (redirection en cours)
  if (status === "unauthenticated") {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center border-b bg-white">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
          {session?.user && (
            <p className="text-sm text-gray-500">
              Connecté en tant que: {session.user.email}
            </p>
          )}
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 p-1 w-full">
            <TabsTrigger value="formations" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              Formations
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
              <BookOpen className="h-4 w-4" />
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
                <CardTitle className="text-xl">Gestion des formations</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="publiees" className="w-full">
                  <TabsList className="w-full grid grid-cols-2">
                    <TabsTrigger value="publiees" className="flex items-center justify-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      Formations Publiées
                    </TabsTrigger>
                    <TabsTrigger value="admin" className="flex items-center justify-center gap-1">
                      <Database className="h-4 w-4" />
                      Administration
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="publiees" className="mt-4">
                    <FormationsList />
                  </TabsContent>
                  <TabsContent value="admin" className="mt-4">
                    <ProgrammesManager />
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
