import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BookOpen, Archive, FileText, Upload, Info } from "lucide-react";
import { useProgrammesFormation } from "@/hooks/useProgrammesFormation";
import { ProgrammeFormation } from "@/types";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import ProgrammeForm from "./ProgrammeForm";
import FormationDetail from "./FormationDetail";
import MentionsLegales from "./MentionsLegales";
import FormationImport from "./FormationImport";
import { FormationCard } from "./FormationCard";
import { EmptyState } from "./EmptyState";
import { FormationsProvider } from "./FormationsContext";
import { ViewMode, FilteredProgrammes } from "./types";
import { generateFormationPDF } from "@/utils/pdfGenerator";
import { programmeFormationToPdfFormation } from "@/utils/typeAdapters";


const FormationsList = () => {
  // Hooks et état
  const {
    programmes,
    loading: isLoading,
    refreshProgrammes,
    createProgramme,
    updateProgramme,
    duplicateProgramme,
    categories
  } = useProgrammesFormation();
  
  console.log('🏷️ FormationsList render - État actuel:', {
    programmes: programmes?.length || 0,
    isLoading
  });
  const { toast } = useToast();
  const [view, setView] = useState<ViewMode>("list");
  const [selectedFormation, setSelectedFormation] = useState<ProgrammeFormation | null>(null);
  const [editingFormation, setEditingFormation] = useState<ProgrammeFormation | null>(null);
  const [programmesFiltered, setProgrammesFiltered] = useState<FilteredProgrammes>({
    catalogue: [],
    personnalise: []
  });

  // Effets
  useEffect(() => {
    console.log('🔄 FormationsList - useEffect programmes changé:', programmes?.length || 0, 'programmes');
    if (programmes) {
      const filteredData = {
        catalogue: programmes.filter(p => p.type === "catalogue"),
        personnalise: programmes.filter(p => p.type === "personnalise")
      };
      console.log('📊 Filtrage programmes:', {
        total: programmes.length,
        catalogue: filteredData.catalogue.length,
        personnalise: filteredData.personnalise.length
      });
      setProgrammesFiltered(filteredData);
    }
  }, [programmes]);



  // Handlers
  const handleCreate = useCallback(() => {
    setEditingFormation(null);
    setView("form");
    toast({
      title: "Mode création",
      description: "Vous pouvez maintenant créer un nouveau programme."
    });
  }, [toast]);

  const handleEdit = useCallback((formation: ProgrammeFormation) => {
    setEditingFormation(formation);
    setView("form");
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    try {
      await api.delete(`/programmes-formation/${id}`);
      
      toast({
        title: "Succès",
        description: "Programme supprimé avec succès.",
      });
      // Refresh the list
      await refreshProgrammes();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      
      let errorMessage = "Erreur lors de la suppression du programme.";
      
      if (error?.response?.status === 404) {
        errorMessage = "Ce programme n'existe plus ou a déjà été supprimé. La liste va être actualisée.";
        // Refresh the list to sync with database
        await refreshProgrammes();
      } else if (error?.response?.status === 409) {
        errorMessage = error?.response?.data?.error || "Impossible de supprimer ce programme car il est utilisé ailleurs.";
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erreur",
        description: errorMessage,
      });
    }
  }, [toast, refreshProgrammes]);

  const handleSubmit = useCallback(async (formData: Partial<ProgrammeFormation>) => {
    try {
      if (editingFormation) {
        await updateProgramme(editingFormation.id, formData);
        toast({
          title: "Programme modifié",
          description: "Le programme a été modifié avec succès.",
        });
      } else {
        await createProgramme(formData);
        toast({
          title: "Programme créé",
          description: "Le nouveau programme a été créé avec succès.",
        });
      }
      setView("list");
      setEditingFormation(null);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder le programme.",
      });
    }
  }, [editingFormation, createProgramme, updateProgramme, toast]);

  const handleGeneratePDF = useCallback((formation: ProgrammeFormation) => {
    const pdfFormation = programmeFormationToPdfFormation(formation);
    generateFormationPDF(pdfFormation);
  }, []);

  const handleViewDetail = useCallback((formation: ProgrammeFormation) => {
    setSelectedFormation(formation);
    setView("detail");
  }, []);

  const handleBackToList = useCallback(() => {
    setView("list");
    setSelectedFormation(null);
    setEditingFormation(null);
  }, []);

  const handleExportPDF = useCallback(async (formation: ProgrammeFormation) => {
    try {
      const pdfFormation = programmeFormationToPdfFormation(formation);
      await generateFormationPDF(pdfFormation);
      toast({
        title: "Export réussi",
        description: "Le PDF a été généré et téléchargé.",
      });
    } catch (error) {
      console.error("Erreur lors de l'export PDF:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF.",
      });
    }
  }, [toast]);

  const handleImport = useCallback(() => {
    setView("import");
  }, []);

  const handleImportSuccess = useCallback((importedCount: number) => {
    setView("list");
    toast({
      title: "Import réussi",
      description: `${importedCount} formation(s) importée(s) avec succès.`,
    });
    refreshProgrammes();
  }, [refreshProgrammes, toast]);

  const handleToggleActive = useCallback(async (id: string, newState: boolean) => {
    try {
      await updateProgramme(id, { estActif: newState });
      toast({
        title: newState ? "Programme activé" : "Programme désactivé",
        description: "Le statut a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut du programme.",
      });
    }
  }, [updateProgramme, toast]);

  const handleToggleVisible = useCallback(async (id: string, newState: boolean) => {
    try {
      await updateProgramme(id, { estVisible: newState });
      toast({
        title: newState ? "Programme rendu visible" : "Programme masqué",
        description: `Le programme est maintenant ${newState ? 'visible sur le site public' : 'masqué du site public'}.`,
      });
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier la visibilité du programme.",
      });
    }
  }, [updateProgramme, toast]);

  const handleDuplicate = useCallback(async (id: string) => {
    try {
      // Récupérer le programme à dupliquer
      const programme = programmes.find(p => p.id === id);
      if (!programme) {
        throw new Error('Programme introuvable');
      }

      // Dupliquer le programme
      await duplicateProgramme(id);

      toast({
        title: "Programme dupliqué",
        description: "Le programme a été dupliqué avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la duplication:", error);
      toast({
        title: "Erreur",
        description: "Impossible de dupliquer le programme.",
      });
    }
  }, [programmes, duplicateProgramme, toast]);

  // Rendu des différentes vues
  const renderListView = () => (
    <FormationsProvider
      programmes={programmes}
      isLoading={isLoading}
      actions={{
        onViewDetail: handleViewDetail,
        onEdit: handleEdit,
        onDelete: handleDelete,
        onGeneratePDF: handleExportPDF,
        onToggleVisible: handleToggleVisible,
        onDuplicate: handleDuplicate
      }}
      categories={categories}
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Gestion des programmes de formation</h2>
            <p className="text-gray-600">Gérez votre bibliothèque unifiée de programmes de formation</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleImport}>
              <Upload className="mr-2 h-4 w-4" /> Importer
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleCreate}
            >
              <Plus className="mr-2 h-4 w-4" /> Nouveau programme
            </Button>
          </div>
        </div>

        <Tabs defaultValue="tous" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tous" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Tous les programmes
            </TabsTrigger>
            <TabsTrigger value="catalogue" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Catalogue
            </TabsTrigger>
            <TabsTrigger value="personnalise" className="flex items-center gap-2">
              <Archive className="h-4 w-4" />
              Personnalisés
            </TabsTrigger>
            <TabsTrigger value="mentions" className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              Mentions légales
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tous">
            {isLoading ? (
              <div className="flex justify-center p-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : programmes.length === 0 ? (
              <EmptyState onCreate={handleCreate} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programmes.map((programme) => (
                  <FormationCard
                    key={programme.id}
                    programme={programme}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="catalogue">
            {isLoading ? (
              <div className="flex justify-center p-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : programmesFiltered.catalogue.length === 0 ? (
              <EmptyState type="catalogue" onCreate={handleCreate} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programmesFiltered.catalogue.map((programme) => (
                  <FormationCard
                    key={programme.id}
                    programme={programme}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="personnalise">
            {isLoading ? (
              <div className="flex justify-center p-10">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            ) : programmesFiltered.personnalise.length === 0 ? (
              <EmptyState type="personnalisé" onCreate={handleCreate} />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {programmesFiltered.personnalise.map((programme) => (
                  <FormationCard
                    key={programme.id}
                    programme={programme}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="mentions">
            <MentionsLegales />
          </TabsContent>
        </Tabs>
      </div>
    </FormationsProvider>
  );

  // Rendu principal avec approche directe sans switch
  if (view === "form") {
    console.log('RENDU: Affichage du formulaire avec:', editingFormation ? 'édition' : 'création');
    return (
      <ProgrammeForm
        onSubmit={handleSubmit}
        onCancel={handleBackToList}
        programme={editingFormation}
        categories={categories}
      />
    );
  } else if (view === "detail" && selectedFormation) {
    console.log('RENDU: Affichage du détail avec:', selectedFormation);
    return (
      <FormationDetail
        formation={selectedFormation}
        onBack={handleBackToList}
        onGeneratePDF={() => handleExportPDF(selectedFormation)}
      />
    );
  } else if (view === "import") {
    console.log('RENDU: Affichage de l\'import');
    return <FormationImport onSuccess={handleImportSuccess} onBack={handleBackToList} />;
  } else {
    console.log('RENDU: Affichage de la liste');
    return renderListView();
  }
};

export default FormationsList;