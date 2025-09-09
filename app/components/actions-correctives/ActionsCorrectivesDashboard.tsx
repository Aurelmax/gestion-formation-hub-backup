
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActionsCorrectives, type ActionCorrective } from "@/hooks/useActionsCorrectives";
import { AlertTriangle, Clock, CheckCircle, XCircle, TrendingUp, Users, Calendar, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { exportActionsCorrectivesToCSV } from "@/utils/csvExport";

const ActionsCorrectivesDashboard = () => {
  const { actionsCorrectives, loading } = useActionsCorrectives();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">Chargement des statistiques...</div>
      </div>
    );
  }

  // Calculs des statistiques
  const stats = {
    total: actionsCorrectives.length,
    planifiees: actionsCorrectives.filter(a => a.statut === 'planifiee').length,
    enCours: actionsCorrectives.filter(a => a.statut === 'en_cours').length,
    terminees: actionsCorrectives.filter(a => a.statut === 'terminee').length,
    annulees: actionsCorrectives.filter(a => a.statut === 'annulee').length,
  };

  // Statistiques par priorité
  const prioriteStats = [
    { name: 'Faible', value: actionsCorrectives.filter(a => a.priorite === 'faible').length, color: '#10b981' },
    { name: 'Moyenne', value: actionsCorrectives.filter(a => a.priorite === 'moyenne').length, color: '#3b82f6' },
    { name: 'Haute', value: actionsCorrectives.filter(a => a.priorite === 'haute').length, color: '#f59e0b' },
    { name: 'Critique', value: actionsCorrectives.filter(a => a.priorite === 'critique').length, color: '#ef4444' },
  ];

  // Statistiques par statut pour le graphique
  const statutStats = [
    { name: 'Planifiées', value: stats.planifiees, color: '#4b5563' },
    { name: 'En cours', value: stats.enCours, color: '#f59e0b' },
    { name: 'Terminées', value: stats.terminees, color: '#10b981' },
    { name: 'Annulées', value: stats.annulees, color: '#ef4444' },
  ];

  // Avancement moyen
  const avancementMoyen = actionsCorrectives.length > 0 
    ? Math.round(actionsCorrectives.reduce((acc, a) => acc + a.avancement, 0) / actionsCorrectives.length)
    : 0;

  // Actions par origine
  const origineStats = [
    { name: 'Réclamations', value: actionsCorrectives.filter(a => a.origineType === 'reclamation').length },
    { name: 'Incidents', value: actionsCorrectives.filter(a => a.origineType === 'incident').length },
    { name: 'Audits', value: actionsCorrectives.filter(a => a.origineType === 'audit').length },
    { name: 'Veille', value: actionsCorrectives.filter(a => a.origineType === 'veille').length },
  ];

  const handleExport = () => {
    exportActionsCorrectivesToCSV(actionsCorrectives);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tableau de Bord - Actions Correctives</h2>
          <p className="text-gray-600">Suivi et analyse des actions d'amélioration</p>
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
            <CardTitle className="text-sm font-medium">Total Actions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Toutes actions confondues
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Cours</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.planifiees + stats.enCours}</div>
            <p className="text-xs text-muted-foreground">
              Planifiées + En cours
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terminées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.terminees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.total > 0 ? Math.round((stats.terminees / stats.total) * 100) : 0}% du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avancement Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{avancementMoyen}%</div>
            <p className="text-xs text-muted-foreground">
              Progression générale
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Origine</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={origineStats}>
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

      {/* Actions critiques nécessitant une attention */}
      {actionsCorrectives.filter(a => a.priorite === 'critique' && (a.statut === 'planifiee' || a.statut === 'en_cours')).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Actions Critiques Nécessitant une Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {actionsCorrectives
                .filter(a => a.priorite === 'critique' && (a.statut === 'planifiee' || a.statut === 'en_cours'))
                .slice(0, 5)
                .map((action) => (
                  <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{action.titre}</div>
                      <div className="text-sm text-gray-600">{action.responsableNom || 'Non assigné'}</div>
                      <div className="text-xs text-gray-500">
                        Origine: {action.origineType} • {new Date(action.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">
                        {action.priorite}
                      </Badge>
                      <Badge variant={action.statut === 'planifiee' ? 'secondary' : 'default'}>
                        {action.statut}
                      </Badge>
                      <div className="text-sm font-medium">
                        {action.avancement}%
                      </div>
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

export default ActionsCorrectivesDashboard;
