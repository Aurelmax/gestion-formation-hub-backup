
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Eye, FileText, Cog, Lightbulb, Loader2, AlertCircle } from "lucide-react";
import { Veille, TypeVeille, StatutVeille } from "@/types/veille";
import { useVeille } from "@/hooks/useVeille";
import { Alert, AlertDescription } from "@/components/ui/alert";
import VeilleDetail from "./VeilleDetail";
import VeilleForm from "./VeilleForm";

const VeilleManager = () => {
  const { 
    veilles, 
    loading, 
    error, 
    createVeille, 
    updateStatut, 
    updateAvancement, 
    addCommentaire 
  } = useVeille();

  const [selectedVeille, setSelectedVeille] = useState<Veille | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedType, setSelectedType] = useState<TypeVeille | "all">("all");

  const getStatutBadgeVariant = (statut: StatutVeille) => {
    switch (statut) {
      case "nouvelle": return "secondary";
      case "en-cours": return "default";
      case "terminee": return "outline";
      default: return "secondary";
    }
  };

  const getTypeIcon = (type: TypeVeille) => {
    switch (type) {
      case "reglementaire": return <FileText className="h-4 w-4" />;
      case "metier": return <Cog className="h-4 w-4" />;
      case "innovation": return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: TypeVeille) => {
    switch (type) {
      case "reglementaire": return "Réglementaire";
      case "metier": return "Métier";
      case "innovation": return "Innovation";
    }
  };

  const filteredVeilles = selectedType === "all" 
    ? veilles 
    : veilles.filter(v => v.type === selectedType);

  const handleUpdateStatut = async (id: string, statut: StatutVeille) => {
    try {
      await updateStatut(id, statut);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleUpdateAvancement = async (id: string, avancement: number) => {
    try {
      await updateAvancement(id, avancement);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'avancement:', error);
    }
  };

  const handleAddCommentaire = async (id: string, commentaire: string) => {
    try {
      await addCommentaire(id, commentaire);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du commentaire:', error);
    }
  };

  const handleCreateVeille = async (nouvelleVeille: Omit<Veille, "id" | "dateCreation" | "commentaires" | "documents" | "historique">) => {
    try {
      await createVeille(nouvelleVeille);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la création de la veille:', error);
    }
  };

  if (selectedVeille) {
    return (
      <VeilleDetail
        veille={selectedVeille}
        onBack={() => setSelectedVeille(null)}
        onUpdateStatut={handleUpdateStatut}
        onUpdateAvancement={handleUpdateAvancement}
        onAddCommentaire={handleAddCommentaire}
      />
    );
  }

  if (showForm) {
    return (
      <VeilleForm
        onSubmit={handleCreateVeille}
        onCancel={() => setShowForm(false)}
      />
    );
  }

  // Affichage du chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        <span>Chargement des veilles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Affichage des erreurs */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion de la Veille</h2>
          <p className="text-gray-600">Suivi des évolutions réglementaires, métier et innovations</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Veille
        </Button>
      </div>

      <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as TypeVeille | "all")}>
        <TabsList>
          <TabsTrigger value="all">Toutes</TabsTrigger>
          <TabsTrigger value="reglementaire">Réglementaire</TabsTrigger>
          <TabsTrigger value="metier">Métier</TabsTrigger>
          <TabsTrigger value="innovation">Innovation</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredVeilles.map((veille) => (
              <Card key={veille.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(veille.type)}
                      <Badge variant="outline">{getTypeLabel(veille.type)}</Badge>
                    </div>
                    <Badge variant={getStatutBadgeVariant(veille.statut)}>
                      {veille.statut}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{veille.titre}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {veille.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Avancement</span>
                      <span>{veille.avancement}%</span>
                    </div>
                    <Progress value={veille.avancement} className="h-2" />
                  </div>

                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Créé le {veille.dateCreation.toLocaleDateString()}</span>
                    {veille.dateEcheance && (
                      <span>Échéance: {veille.dateEcheance.toLocaleDateString()}</span>
                    )}
                  </div>

                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setSelectedVeille(veille)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Voir détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VeilleManager;
