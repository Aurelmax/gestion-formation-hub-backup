
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Target, CheckCircle, Clock } from "lucide-react";
import { Competence, CategorieCompetence, StatutCompetence } from "@/types/competence";

interface CompetencesDashboardProps {
  competences: Competence[];
  onExportCSV: () => void;
}

const CompetencesDashboard = ({ competences, onExportCSV }: CompetencesDashboardProps) => {
  const calculateStats = () => {
    const total = competences.length;
    const enDeveloppement = competences.filter(c => c.statut === 'en-cours').length;
    const objectifsAtteints = competences.filter(c => c.niveauActuel >= c.objectifNiveau).length;
    const moyenneProgression = total > 0 
      ? competences.reduce((acc, c) => acc + (c.niveauActuel / c.objectifNiveau) * 100, 0) / total
      : 0;

    return { total, enDeveloppement, objectifsAtteints, moyenneProgression };
  };

  const getCompetencesByCategory = () => {
    const categories: Record<CategorieCompetence, Competence[]> = {
      'technique': [],
      'pedagogique': [],
      'relationnelle': [],
      'organisationnelle': []
    };

    competences.forEach(competence => {
      categories[competence.categorie].push(competence);
    });

    return categories;
  };

  const getCompetencesByStatus = () => {
    const statuts: Record<StatutCompetence, number> = {
      'planifie': 0,
      'en-cours': 0,
      'realise': 0,
      'reporte': 0
    };

    competences.forEach(competence => {
      statuts[competence.statut]++;
    });

    return statuts;
  };

  const stats = calculateStats();
  const competencesByCategory = getCompetencesByCategory();
  const competencesByStatus = getCompetencesByStatus();

  const getCategoryColor = (categorie: CategorieCompetence) => {
    const colors = {
      'technique': 'bg-blue-500',
      'pedagogique': 'bg-green-500',
      'relationnelle': 'bg-purple-500',
      'organisationnelle': 'bg-orange-500'
    };
    return colors[categorie];
  };

  const getStatusIcon = (statut: StatutCompetence) => {
    switch (statut) {
      case 'planifie': return <Clock className="h-4 w-4" />;
      case 'en-cours': return <TrendingUp className="h-4 w-4" />;
      case 'realise': return <CheckCircle className="h-4 w-4" />;
      case 'reporte': return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Tableau de Bord - Auto-évaluation</h3>
          <p className="text-sm text-gray-600">Vue d'ensemble de votre développement professionnel</p>
        </div>
        <Button onClick={onExportCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Compétences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">En Développement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.enDeveloppement}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Objectifs Atteints</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.objectifsAtteints}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Progression Moyenne</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{Math.round(stats.moyenneProgression)}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par catégorie */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Catégorie</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(competencesByCategory).map(([categorie, competences]) => {
              const avgProgression = competences.length > 0
                ? competences.reduce((acc, c) => acc + (c.niveauActuel / c.objectifNiveau) * 100, 0) / competences.length
                : 0;

              return (
                <div key={categorie} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Badge className={getCategoryColor(categorie as CategorieCompetence)}>
                      {categorie.charAt(0).toUpperCase() + categorie.slice(1)}
                    </Badge>
                    <span className="text-sm font-medium">{competences.length} compétences</span>
                  </div>
                  <Progress value={avgProgression} className="h-2" />
                  <p className="text-xs text-gray-500">Progression moyenne: {Math.round(avgProgression)}%</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Répartition par statut */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Statut</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(competencesByStatus).map(([statut, count]) => (
              <div key={statut} className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {getStatusIcon(statut as StatutCompetence)}
                  </div>
                  <div className="text-lg font-bold">{count}</div>
                  <div className="text-xs text-gray-600">
                    {statut.charAt(0).toUpperCase() + statut.slice(1)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompetencesDashboard;
