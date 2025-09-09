
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useActionsCorrectives } from "@/hooks/useActionsCorrectives";
import { Plus, Search, Eye, Edit, Trash2, AlertTriangle, Clock, CheckCircle, XCircle } from "lucide-react";
import ActionsCorrectivesDashboard from "./ActionsCorrectivesDashboard";
import ActionCorrectiveForm from "./ActionCorrectiveForm";

const ActionsCorrectivesList = () => {
  const { actionsCorrectives, loading, deleteActionCorrective } = useActionsCorrectives();
  const [searchTerm, setSearchTerm] = useState("");
  const [statutFilter, setStatutFilter] = useState<string>("tous");
  const [prioriteFilter, setPrioriteFilter] = useState<string>("tous");
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case 'planifiee':
        return <Clock className="h-4 w-4 text-gray-500" />;
      case 'en_cours':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      case 'terminee':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'annulee':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatutBadge = (statut: string) => {
    switch (statut) {
      case 'planifiee':
        return <Badge variant="secondary">Planifiée</Badge>;
      case 'en_cours':
        return <Badge variant="default">En cours</Badge>;
      case 'terminee':
        return <Badge variant="default" className="bg-green-100 text-green-800">Terminée</Badge>;
      case 'annulee':
        return <Badge variant="destructive">Annulée</Badge>;
      default:
        return <Badge variant="secondary">{statut}</Badge>;
    }
  };

  const getPrioriteBadge = (priorite: string) => {
    switch (priorite) {
      case 'faible':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Faible</Badge>;
      case 'moyenne':
        return <Badge variant="secondary">Moyenne</Badge>;
      case 'haute':
        return <Badge variant="default" className="bg-orange-100 text-orange-800">Haute</Badge>;
      case 'critique':
        return <Badge variant="destructive">Critique</Badge>;
      default:
        return <Badge variant="secondary">{priorite}</Badge>;
    }
  };

  const filteredActions = actionsCorrectives.filter(action => {
    const matchesSearch = action.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         action.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (action.responsableNom?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatut = statutFilter === "tous" || action.statut === statutFilter;
    const matchesPriorite = prioriteFilter === "tous" || action.priorite === prioriteFilter;
    
    return matchesSearch && matchesStatut && matchesPriorite;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette action corrective ?")) {
      await deleteActionCorrective(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Chargement des actions correctives...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Actions Correctives</h2>
            <p className="text-gray-600">Gestion des actions d'amélioration et de correction</p>
          </div>
          <div className="flex items-center gap-2">
            <TabsList>
              <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
              <TabsTrigger value="liste">Liste détaillée</TabsTrigger>
            </TabsList>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Action
            </Button>
          </div>
        </div>

        <TabsContent value="dashboard">
          <ActionsCorrectivesDashboard />
        </TabsContent>

        <TabsContent value="liste" className="space-y-6">
          {/* Filtres */}
          <Card>
            <CardHeader>
              <CardTitle>Filtres</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statutFilter} onValueChange={setStatutFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous les statuts</SelectItem>
                    <SelectItem value="planifiee">Planifiée</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="terminee">Terminée</SelectItem>
                    <SelectItem value="annulee">Annulée</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={prioriteFilter} onValueChange={setPrioriteFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes les priorités</SelectItem>
                    <SelectItem value="faible">Faible</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
                <div className="text-sm text-gray-600 flex items-center">
                  {filteredActions.length} action(s) trouvée(s)
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Liste des actions */}
          <div className="grid gap-4">
            {filteredActions.map((action) => (
              <Card key={action.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatutIcon(action.statut)}
                        <h3 className="font-semibold text-lg">{action.titre}</h3>
                        <div className="flex gap-2">
                          {getStatutBadge(action.statut)}
                          {getPrioriteBadge(action.priorite)}
                        </div>
                      </div>
                      
                      <p className="text-gray-600 line-clamp-2">{action.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <span>Origine: {action.origineType}</span>
                        {action.responsableNom && <span>Responsable: {action.responsableNom}</span>}
                        {action.dateEcheance && (
                          <span>Échéance: {new Date(action.dateEcheance).toLocaleDateString('fr-FR')}</span>
                        )}
                        <span>Créé le: {new Date(action.createdAt).toLocaleDateString('fr-FR')}</span>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Avancement</span>
                          <span>{action.avancement}%</span>
                        </div>
                        <Progress value={action.avancement} className="h-2" />
                      </div>
                    </div>
                    
                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedAction(action.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Voir
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAction(action.id);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(action.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Supprimer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredActions.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">Aucune action corrective trouvée.</p>
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer la première action
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Formulaire de création/modification */}
      {showForm && (
        <ActionCorrectiveForm
          actionId={selectedAction}
          onClose={() => {
            setShowForm(false);
            setSelectedAction(null);
          }}
        />
      )}
    </div>
  );
};

export default ActionsCorrectivesList;
