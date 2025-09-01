
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useReclamations, type Reclamation } from "@/hooks/useReclamations";
import { AlertCircle, Clock, CheckCircle, XCircle, TrendingUp, Users, Calendar, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { exportReclamationsToCSV } from "@/utils/csvExport";

const ReclamationsDashboard = () => {
  const { reclamations, loading } = useReclamations();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Chargement des statistiques...</div>
      </div>
    );
  }

  // Calculs des statistiques
  const stats = {
    total: reclamations.length,
    nouvelles: reclamations.filter(r => r.statut === 'nouvelle').length,
    enCours: reclamations.filter(r => r.statut === 'en_cours').length,
    resolues: reclamations.filter(r => r.statut === 'resolue').length,
    fermees: reclamations.filter(r => r.statut === 'fermee').length,
  };

  // Statistiques par priorité
  const prioriteStats = [
    { name: 'Basse', value: reclamations.filter(r => r.priorite === 'basse').length, color: '#10b981' },
    { name: 'Normale', value: reclamations.filter(r => r.priorite === 'normale').length, color: '#3b82f6' },
    { name: 'Haute', value: reclamations.filter(r => r.priorite === 'haute').length, color: '#f59e0b' },
    { name: 'Urgente', value: reclamations.filter(r => r.priorite === 'urgente').length, color: '#ef4444' },
  ];

  // Statistiques par statut pour le graphique
  const statutStats = [
    { name: 'Nouvelles', value: stats.nouvelles, color: '#ef4444' },
    { name: 'En cours', value: stats.enCours, color: '#f59e0b' },
    { name: 'Résolues', value: stats.resolues, color: '#10b981' },
    { name: 'Fermées', value: stats.fermees, color: '#4b5563' },
  ];

  // Temps moyen de résolution (en jours)
  const reclamationsResolues = reclamations.filter(r => r.statut === 'resolue' && r.date_resolution);
  const tempsResolutionMoyen = reclamationsResolues.length > 0 
    ? Math.round(
        reclamationsResolues.reduce((acc, r) => {
          const created = new Date(r.created_at);
          const resolved = new Date(r.date_resolution!);
          return acc + (resolved.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
        }, 0) / reclamationsResolues.length
      )
    : 0;

  // Réclamations par mois (derniers 6 mois)
  const derniersMois = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    return date;
  }).reverse();

  const reclamationsParMois = derniersMois.map(date => {
    const mois = date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    const count = reclamations.filter(r => {
      const reclamationDate = new Date(r.created_at);
      return reclamationDate.getMonth() === date.getMonth() && 
             reclamationDate.getFullYear() === date.getFullYear();
    }).length;
    return { name: mois, value: count };
  });

  const handleExport = () => {
    exportReclamationsToCSV(reclamations);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord - Réclamations</h2>
          <p className="text-gray-600">Statistiques et analyse des réclamations clients</p>
        </div>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exporter CSV
        </Button>
      </div>

      {/* Cartes de statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Réclamations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Toutes réclamations confondues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.nouvelles + stats.enCours}</div>
            <p className="text-xs text-muted-foreground">
              Nouvelles + En cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Résolues</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.resolues}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.resolues / stats.total) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tempsResolutionMoyen}</div>
            <p className="text-xs text-muted-foreground">
              jours de résolution
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Évolution par Mois</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reclamationsParMois}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par Statut</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statutStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statutStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Répartition par priorité */}
      <Card>
        <CardHeader>
          <CardTitle>Répartition par Priorité</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prioriteStats.map((priorite) => (
              <div key={priorite.name} className="text-center">
                <div 
                  className="text-2xl font-bold mb-1"
                  style={{ color: priorite.color }}
                >
                  {priorite.value}
                </div>
                <div className="text-sm text-gray-600">{priorite.name}</div>
                <div className="text-xs text-gray-500">
                  {stats.total > 0 ? Math.round((priorite.value / stats.total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Réclamations récentes nécessitant une attention */}
      {(stats.nouvelles > 0 || stats.enCours > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              Réclamations Nécessitant une Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reclamations
                .filter(r => r.statut === 'nouvelle' || r.statut === 'en_cours')
                .slice(0, 5)
                .map((reclamation) => (
                  <div key={reclamation.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{reclamation.sujet}</div>
                      <div className="text-sm text-gray-600">{reclamation.nom} • {reclamation.email}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(reclamation.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={reclamation.priorite === 'urgente' ? 'destructive' : 'secondary'}>
                        {reclamation.priorite}
                      </Badge>
                      <Badge variant={reclamation.statut === 'nouvelle' ? 'destructive' : 'default'}>
                        {reclamation.statut === 'nouvelle' ? 'Nouvelle' : 'En cours'}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ReclamationsDashboard;
