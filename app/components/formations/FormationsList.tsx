import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit, Trash2, Eye, Clock, Users, BookOpen, Info, GitBranch, Calendar, Download, Archive, FileText, Upload } from "lucide-react";
import { useProgrammesFormation, ProgrammeFormation } from "@/hooks/useProgrammesFormation";
import api from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import ProgrammeForm from "./ProgrammeForm";
import FormationDetail from "./FormationDetail";
import MentionsLegales from "./MentionsLegales";
import FormationImport from "./FormationImport";
import { generateFormationPDF } from "@/utils/pdfGenerator";
import { programmeFormationToPdfFormation } from "@/utils/typeAdapters";

// Types
type ViewMode = "list" | "form" | "detail" | "import";
type FilteredProgrammes = {
  catalogue: ProgrammeFormation[];
  personnalise: ProgrammeFormation[];
};

// Composants internes
const FormationCard = ({ 
  programme, 
  onViewDetail, 
  onEdit, 
  onDelete, 
  onGeneratePDF,
  onToggleActive,
  onDuplicate
}: {
  programme: ProgrammeFormation;
  onViewDetail: (programme: ProgrammeFormation) => void;
  onEdit: (programme: ProgrammeFormation) => void;
  onDelete: (id: string) => void;
  onGeneratePDF?: (programme: ProgrammeFormation) => void;
  onToggleActive?: (id: string, newState: boolean) => void;
  onDuplicate?: (id: string) => void;
}) => (
  <Card key={programme.id} className="hover:shadow-md transition-shadow">
    <CardHeader>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{programme.pictogramme}</span>
            <CardTitle className="text-lg">{programme.titre || programme.code || "Sans titre"}</CardTitle>
          </div>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {programme.duree}
            </Badge>
            <Badge variant={programme.type === "catalogue" ? "default" : "outline"} className="flex items-center gap-1">
              {programme.type === "catalogue" ? (
                <FileText className="h-3 w-3" />
              ) : (
                <Archive className="h-3 w-3" />
              )}
              {programme.type === "catalogue" ? "Catalogue" : "Personnalisé"}
            </Badge>
            {programme.type === "personnalise" && programme.beneficiaireId && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {programme.beneficiaireId}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {programme.description || "Description non disponible"}
      </p>
      
      <div className="space-y-2 mb-4 text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          <span>Public: {programme.publicConcerne || "Non défini"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Info className="h-3 w-3" />
          <span>Prérequis: {programme.prerequis || "Aucun"}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          <span>Code: {programme.code}</span>
        </div>
        {programme.categorieId && (
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>Catégorie: {programme.categorie?.titre || programme.categorieId}</span>
          </div>
        )}
        {programme.type === "personnalise" && programme.objectifsSpecifiques && (
          <div className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span>Objectifs spécifiques: {programme.objectifsSpecifiques}</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-between mt-4 gap-2">
        <Button variant="ghost" size="sm" onClick={() => onViewDetail(programme)}>
          <Eye className="h-4 w-4 mr-1" /> Voir
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onEdit(programme)}>
          <Edit className="h-4 w-4 mr-1" /> Éditer
        </Button>
        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => {
          if (window.confirm(`Êtes-vous sûr de vouloir supprimer le programme "${programme.titre || programme.code}" ?`)) {
            onDelete(programme.id);
          }
        }}>
          <Trash2 className="h-4 w-4 mr-1" /> Supprimer
        </Button>
        {onGeneratePDF && (
          <Button variant="ghost" size="sm" onClick={() => onGeneratePDF(programme)}>
            <Download className="h-4 w-4 mr-1" /> PDF
          </Button>
        )}
        {onDuplicate && (
          <Button variant="ghost" size="sm" onClick={() => onDuplicate(programme.id)}>
            <GitBranch className="h-4 w-4 mr-1" /> Dupliquer
          </Button>
        )}
        {onToggleActive && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => onToggleActive(programme.id, !programme.estActif)}
            className={programme.estActif ? "text-green-600" : "text-amber-600"}
          >
            {programme.estActif ? (
              <>
                <Archive className="h-4 w-4 mr-1" /> Désactiver
              </>
            ) : (
              <>
                <Info className="h-4 w-4 mr-1" /> Activer
              </>
            )}
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
);

const EmptyState = ({ type, onCreate }: { type?: string; onCreate: () => void }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-center py-10">
        <Archive className="mx-auto h-10 w-10 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold">
          {type ? `Aucun programme ${type}` : "Aucun programme"}
        </h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer un nouveau programme.</p>
        <div className="mt-6">
          <Button onClick={onCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau programme
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);

const FormationsList = () => {
  // Hooks et état
  const { 
    programmes, 
    loading: isLoading, 
    refreshProgrammes,
    createProgramme,
    updateProgramme,
    duplicateProgramme
  } = useProgrammesFormation();
  
  console.log('🏷️ FormationsList render - État actuel:', {
    programmes: programmes?.length || 0,
    isLoading
  });
  const { toast } = useToast();
  const [categories, setCategories] = useState<any[]>([]);
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

  // Charger les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Rafraîchissement périodique pour éviter les décalages
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    // Rafraîchir les données toutes les 30 secondes si la page est visible
    const startPeriodicRefresh = () => {
      intervalId = setInterval(() => {
        if (document.visibilityState === 'visible' && view === 'list') {
          console.log('🔄 Rafraîchissement périodique des programmes');
          refreshProgrammes();
        }
      }, 30000);
    };

    startPeriodicRefresh();

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [view, refreshProgrammes]);

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
      await api.delete(`/api/programmes-formation/${id}`);
      
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

  const handleSubmit = useCallback(async (formData: Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (editingFormation) {
        const updateData: Partial<ProgrammeFormation> = {};
        Object.keys(formData).forEach(key => {
          if (formData[key as keyof typeof formData] !== undefined) {
            (updateData as any)[key] = formData[key as keyof typeof formData];
          }
        });
        await updateProgramme(editingFormation.id, updateData);
        toast({
          title: "Programme modifié",
          description: "Le programme a été modifié avec succès.",
        });
      } else {
        await createProgramme(formData as any);
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
                  onViewDetail={handleViewDetail}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onGeneratePDF={handleExportPDF}
                  onToggleActive={handleToggleActive}
                  onDuplicate={handleDuplicate}
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
                  onViewDetail={handleViewDetail}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onGeneratePDF={handleExportPDF}
                  onToggleActive={handleToggleActive}
                  onDuplicate={handleDuplicate}
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
                  onViewDetail={handleViewDetail}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onGeneratePDF={handleExportPDF}
                  onToggleActive={handleToggleActive}
                  onDuplicate={handleDuplicate}
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