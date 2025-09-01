import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Search, Filter, Eye, Edit, Trash2, Loader2, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Competence, CategorieCompetence, StatutCompetence } from "@/types/competence";
import { useCompetences } from "@/hooks/useCompetences";
import { exportCompetencesToCSV } from "@/utils/csvExport";
import CompetenceForm from "./CompetenceForm";
import CompetenceDetail from "./CompetenceDetail";
import CompetencesDashboard from "./CompetencesDashboard";

const CompetenceManager = () => {
  const { competences, loading, createCompetence, updateCompetence, deleteCompetence } = useCompetences();
  const [currentView, setCurrentView] = useState<'dashboard' | 'list' | 'form' | 'detail'>('dashboard');
  const [selectedCompetence, setSelectedCompetence] = useState<Competence | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategorie, setFilterCategorie] = useState<CategorieCompetence | "all">("all");
  const [filterStatut, setFilterStatut] = useState<StatutCompetence | "all">("all");

  const handleCreateCompetence = async (competenceData: Omit<Competence, "id" | "dateCreation" | "dateModification">) => {
    const success = await createCompetence(competenceData);
    if (success) {
      setCurrentView('dashboard');
    }
  };

  const handleUpdateCompetence = async (competenceData: Omit<Competence, "id" | "dateCreation" | "dateModification">) => {
    if (selectedCompetence) {
      const success = await updateCompetence(selectedCompetence.id, competenceData);
      if (success) {
        setCurrentView('dashboard');
        setSelectedCompetence(null);
      }
    }
  };

  const handleDeleteCompetence = async (id: string) => {
    const success = await deleteCompetence(id);
    if (success && currentView === 'detail') {
      setCurrentView('dashboard');
      setSelectedCompetence(null);
    }
  };

  const handleExportCSV = () => {
    exportCompetencesToCSV(competences);
  };

  const getCategorieColor = (categorie: CategorieCompetence) => {
    const colors = {
      'technique': 'bg-blue-100 text-blue-800',
      'pedagogique': 'bg-green-100 text-green-800',
      'relationnelle': 'bg-purple-100 text-purple-800',
      'organisationnelle': 'bg-orange-100 text-orange-800'
    };
    return colors[categorie];
  };

  const getStatutColor = (statut: StatutCompetence) => {
    const colors = {
      'planifie': 'bg-gray-100 text-gray-800',
      'en-cours': 'bg-yellow-100 text-yellow-800',
      'realise': 'bg-green-100 text-green-800',
      'reporte': 'bg-red-100 text-red-800'
    };
    return colors[statut];
  };

  const filteredCompetences = competences.filter(competence => {
    const matchesSearch = competence.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         competence.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategorie = filterCategorie === "all" || competence.categorie === filterCategorie;
    const matchesStatut = filterStatut === "all" || competence.statut === filterStatut;
    
    return matchesSearch && matchesCategorie && matchesStatut;
  });

  if (currentView === 'form') {
    return (
      <CompetenceForm
        competence={selectedCompetence}
        onSubmit={selectedCompetence ? handleUpdateCompetence : handleCreateCompetence}
        onCancel={() => {
          setCurrentView('dashboard');
          setSelectedCompetence(null);
        }}
      />
    );
  }

  if (currentView === 'detail' && selectedCompetence) {
    return (
      <CompetenceDetail
        competence={selectedCompetence}
        onEdit={() => setCurrentView('form')}
        onDelete={() => handleDeleteCompetence(selectedCompetence.id)}
        onBack={() => {
          setCurrentView('dashboard');
          setSelectedCompetence(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Auto-évaluation Formateur</h2>
          <p className="text-gray-600">Développement professionnel et suivi des compétences (Qualiopi 5.21)</p>
        </div>
        <Button onClick={() => setCurrentView('form')}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Compétence
        </Button>
      </div>

      <Tabs value={currentView} onValueChange={(value) => setCurrentView(value as 'dashboard' | 'list')}>
        <TabsList>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Liste Détaillée
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <CompetencesDashboard 
            competences={competences} 
            onExportCSV={handleExportCSV}
          />
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Recherche</label>
                  <Input
                    placeholder="Rechercher une compétence..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Catégorie</label>
                  <Select value={filterCategorie} onValueChange={(value) => setFilterCategorie(value as CategorieCompetence | "all")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les catégories</SelectItem>
                      <SelectItem value="technique">Technique</SelectItem>
                      <SelectItem value="pedagogique">Pédagogique</SelectItem>
                      <SelectItem value="relationnelle">Relationnelle</SelectItem>
                      <SelectItem value="organisationnelle">Organisationnelle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Statut</label>
                  <Select value={filterStatut} onValueChange={(value) => setFilterStatut(value as StatutCompetence | "all")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les statuts</SelectItem>
                      <SelectItem value="planifie">Planifié</SelectItem>
                      <SelectItem value="en-cours">En cours</SelectItem>
                      <SelectItem value="realise">Réalisé</SelectItem>
                      <SelectItem value="reporte">Reporté</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <Card>
              <CardContent className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Chargement des compétences...</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredCompetences.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-500">Aucune compétence trouvée</p>
                    <Button 
                      className="mt-4" 
                      onClick={() => setCurrentView('form')}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Créer votre première compétence
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                filteredCompetences.map((competence) => (
                  <Card key={competence.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{competence.nom}</h3>
                            <Badge className={getCategorieColor(competence.categorie)}>
                              {competence.categorie.charAt(0).toUpperCase() + competence.categorie.slice(1)}
                            </Badge>
                            <Badge className={getStatutColor(competence.statut)}>
                              {competence.statut.charAt(0).toUpperCase() + competence.statut.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{competence.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Domaine: {competence.domaineDeveloppement}</span>
                            <span>Niveau: {competence.niveauActuel}/{competence.objectifNiveau}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCompetence(competence);
                              setCurrentView('detail');
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedCompetence(competence);
                              setCurrentView('form');
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCompetence(competence.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompetenceManager;
