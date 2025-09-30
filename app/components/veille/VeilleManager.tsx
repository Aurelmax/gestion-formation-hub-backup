'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Eye,
  FileText,
  Cog,
  Lightbulb,
  Edit,
  Trash2,
  RefreshCw,
  ArrowLeft
} from "lucide-react";
import { TypeVeille, StatutVeille } from "@/types/veille";
import VeilleDetail from "./VeilleDetail";
import VeilleForm from "./VeilleForm";

interface VeilleDB {
  id: string;
  titre: string;
  description: string;
  type: TypeVeille;
  statut: StatutVeille;
  avancement: number;
  dateCreation: string;
  dateEcheance?: string | null;
}

const VeilleManager = () => {
  const { toast } = useToast();
  const [veilles, setVeilles] = useState<VeilleDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVeille, setSelectedVeille] = useState<VeilleDB | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVeille, setEditingVeille] = useState<VeilleDB | null>(null);
  const [selectedType, setSelectedType] = useState<TypeVeille | "all">("all");

  const fetchVeilles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/veille');
      const data = await response.json();

      if (data.success) {
        setVeilles(data.data);
      } else {
        toast({
          title: "Erreur",
          description: "Impossible de charger les veilles",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des veilles:', error);
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVeilles();
  }, []);

  const handleCreateVeille = async (veilleData: {
    titre: string;
    description: string;
    type: TypeVeille;
    dateEcheance?: string;
  }) => {
    try {
      const response = await fetch('/api/veille', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(veilleData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchVeilles();
        setShowForm(false);
        toast({
          title: "Succès",
          description: "Veille créée avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la création",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    }
  };

  const handleUpdateVeille = async (id: string, updates: Partial<VeilleDB>) => {
    try {
      const response = await fetch(`/api/veille/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (data.success) {
        await fetchVeilles();
        toast({
          title: "Succès",
          description: "Veille mise à jour avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la mise à jour",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    }
  };

  const handleDeleteVeille = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette veille ?')) return;

    try {
      const response = await fetch(`/api/veille/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchVeilles();
        toast({
          title: "Succès",
          description: "Veille supprimée avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: data.error || "Erreur lors de la suppression",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur de connexion",
        variant: "destructive",
      });
    }
  };

  const getStatutBadgeVariant = (statut: StatutVeille) => {
    switch (statut) {
      case "nouvelle": return "secondary";
      case "en-cours": return "default";
      case "terminee": return "outline";
      default: return "secondary";
    }
  };

  const getStatutColor = (statut: StatutVeille) => {
    switch (statut) {
      case "nouvelle": return "text-blue-600 bg-blue-50";
      case "en-cours": return "text-orange-600 bg-orange-50";
      case "terminee": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
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

  const getTypeColor = (type: TypeVeille) => {
    switch (type) {
      case "reglementaire": return "text-red-600 bg-red-50 border-red-200";
      case "metier": return "text-blue-600 bg-blue-50 border-blue-200";
      case "innovation": return "text-purple-600 bg-purple-50 border-purple-200";
    }
  };

  const filteredVeilles = selectedType === "all"
    ? veilles
    : veilles.filter(v => v.type === selectedType);

  const stats = {
    total: veilles.length,
    nouvelles: veilles.filter(v => v.statut === 'nouvelle').length,
    enCours: veilles.filter(v => v.statut === 'en-cours').length,
    terminees: veilles.filter(v => v.statut === 'terminee').length,
  };

  if (showForm) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setShowForm(false)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
        </div>
        <VeilleForm
          onSubmit={handleCreateVeille}
          onCancel={() => setShowForm(false)}
        />
      </div>
    );
  }

  if (selectedVeille) {
    return (
      <div>
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedVeille(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Button>
        </div>
        <VeilleDetail
          veille={selectedVeille}
          onUpdate={(updates) => handleUpdateVeille(selectedVeille.id, updates)}
          onClose={() => setSelectedVeille(null)}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des veilles...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Veille & Actualités</h2>
            <Button
              onClick={fetchVeilles}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{stats.total}</div>
              <div className="text-sm text-blue-700">Total</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-900">{stats.nouvelles}</div>
              <div className="text-sm text-blue-700">Nouvelles</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-900">{stats.enCours}</div>
              <div className="text-sm text-orange-700">En cours</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-900">{stats.terminees}</div>
              <div className="text-sm text-green-700">Terminées</div>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle veille
        </Button>
      </div>

      {/* Filtres par type */}
      <Tabs value={selectedType} onValueChange={(value) => setSelectedType(value as TypeVeille | "all")}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Toutes ({stats.total})</TabsTrigger>
          <TabsTrigger value="reglementaire">
            <FileText className="h-4 w-4 mr-2" />
            Réglementaire
          </TabsTrigger>
          <TabsTrigger value="metier">
            <Cog className="h-4 w-4 mr-2" />
            Métier
          </TabsTrigger>
          <TabsTrigger value="innovation">
            <Lightbulb className="h-4 w-4 mr-2" />
            Innovation
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedType} className="mt-6">
          {filteredVeilles.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-2">Aucune veille trouvée</p>
              <p className="text-gray-400 mb-4">Commencez par créer une nouvelle veille</p>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouvelle veille
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredVeilles.map((veille) => (
                <Card key={veille.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`p-2 rounded-lg border ${getTypeColor(veille.type)}`}>
                          {getTypeIcon(veille.type)}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-lg">{veille.titre}</CardTitle>
                          <p className="text-sm text-gray-600 mt-1">{veille.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={getStatutBadgeVariant(veille.statut)}
                          className={getStatutColor(veille.statut)}
                        >
                          {veille.statut}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(veille.type)}>
                          {getTypeLabel(veille.type)}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Avancement</span>
                        <span>{veille.avancement}%</span>
                      </div>
                      <Progress value={veille.avancement} className="h-2" />
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>
                        Créé le {new Date(veille.dateCreation).toLocaleDateString('fr-FR')}
                      </span>
                      {veille.dateEcheance && (
                        <span>
                          Échéance: {new Date(veille.dateEcheance).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVeille(veille)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Voir détails
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingVeille(veille)}
                        className="flex items-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Modifier
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteVeille(veille.id)}
                        className="flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Supprimer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VeilleManager;