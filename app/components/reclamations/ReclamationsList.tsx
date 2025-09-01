import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useReclamations, type Reclamation } from "@/hooks/useReclamations";
import { Eye, Search, Filter, AlertCircle, Clock, CheckCircle, XCircle, BarChart3, List } from "lucide-react";
import ReclamationsDashboard from "./ReclamationsDashboard";

const ReclamationsList = () => {
  const { reclamations, loading, updateReclamation } = useReclamations();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedReclamation, setSelectedReclamation] = useState<Reclamation | null>(null);

  const getStatusBadge = (statut: string) => {
    const variants = {
      'nouvelle': { variant: 'destructive' as const, icon: AlertCircle, label: 'Nouvelle' },
      'en_cours': { variant: 'default' as const, icon: Clock, label: 'En cours' },
      'resolue': { variant: 'secondary' as const, icon: CheckCircle, label: 'Résolue' },
      'fermee': { variant: 'outline' as const, icon: XCircle, label: 'Fermée' }
    };
    
    const config = variants[statut as keyof typeof variants] || variants.nouvelle;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getPriorityColor = (priorite: string) => {
    const colors = {
      'basse': 'text-green-800 bg-green-200',
      'normale': 'text-blue-800 bg-blue-200',
      'haute': 'text-orange-800 bg-orange-200',
      'urgente': 'text-red-800 bg-red-200'
    };
    return colors[priorite as keyof typeof colors] || colors.normale;
  };

  const filteredReclamations = reclamations.filter(reclamation => {
    const matchesSearch = reclamation.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reclamation.sujet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || reclamation.statut === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (id: string, newStatus: string) => {
    const updates: any = { statut: newStatus };
    if (newStatus === 'resolue' && !selectedReclamation?.date_resolution) {
      updates.date_resolution = new Date().toISOString();
    }
    await updateReclamation(id, updates);
    if (selectedReclamation?.id === id) {
      setSelectedReclamation({ ...selectedReclamation, ...updates });
    }
  };

  const handleNotesChange = async (id: string, notes: string) => {
    await updateReclamation(id, { notes_internes: notes });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-700">Chargement des réclamations...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Tableau de Bord
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Liste Détaillée
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <ReclamationsDashboard />
        </TabsContent>

        <TabsContent value="list">
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Gestion des Réclamations</h2>
                <p className="text-gray-600">Suivi et traitement des réclamations clients</p>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="nouvelle">Nouvelles</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolue">Résolues</option>
                  <option value="fermee">Fermées</option>
                </select>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredReclamations.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-gray-700">Aucune réclamation trouvée</p>
                  </CardContent>
                </Card>
              ) : (
                filteredReclamations.map((reclamation) => (
                  <Card key={reclamation.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{reclamation.sujet}</h3>
                            {getStatusBadge(reclamation.statut)}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reclamation.priorite)}`}>
                              {reclamation.priorite.charAt(0).toUpperCase() + reclamation.priorite.slice(1)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 mb-2">
                            <span className="font-medium">{reclamation.nom}</span> • {reclamation.email}
                            {reclamation.telephone && <span> • {reclamation.telephone}</span>}
                          </div>
                          <p className="text-gray-700 line-clamp-2 mb-3">{reclamation.message}</p>
                          <div className="text-xs text-gray-700">
                            Créée le {new Date(reclamation.created_at).toLocaleDateString('fr-FR')} à {new Date(reclamation.created_at).toLocaleTimeString('fr-FR')}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <select
                            value={reclamation.statut}
                            onChange={(e) => handleStatusChange(reclamation.id, e.target.value)}
                            className="px-3 py-1 text-sm border border-gray-300 rounded-md bg-white"
                          >
                            <option value="nouvelle">Nouvelle</option>
                            <option value="en_cours">En cours</option>
                            <option value="resolue">Résolue</option>
                            <option value="fermee">Fermée</option>
                          </select>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedReclamation(reclamation)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Détail de la réclamation</DialogTitle>
                                <DialogDescription>
                                  Réclamation #{reclamation.id.substring(0, 8)}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Nom</label>
                                    <p className="text-sm">{reclamation.nom}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <p className="text-sm">{reclamation.email}</p>
                                  </div>
                                  {reclamation.telephone && (
                                    <div>
                                      <label className="text-sm font-medium text-gray-700">Téléphone</label>
                                      <p className="text-sm">{reclamation.telephone}</p>
                                    </div>
                                  )}
                                  <div>
                                    <label className="text-sm font-medium text-gray-700">Priorité</label>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(reclamation.priorite)}`}>
                                      {reclamation.priorite.charAt(0).toUpperCase() + reclamation.priorite.slice(1)}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Sujet</label>
                                  <p className="text-sm">{reclamation.sujet}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Message</label>
                                  <p className="text-sm bg-gray-100 p-3 rounded-md">{reclamation.message}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium text-gray-700">Notes internes</label>
                                  <Textarea
                                    placeholder="Ajoutez des notes internes..."
                                    value={reclamation.notes_internes || ""}
                                    onChange={(e) => handleNotesChange(reclamation.id, e.target.value)}
                                    className="mt-1"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-700">
                                  <div>
                                    <span className="font-medium">Créée le :</span><br />
                                    {new Date(reclamation.created_at).toLocaleString('fr-FR')}
                                  </div>
                                  <div>
                                    <span className="font-medium">Dernière MAJ :</span><br />
                                    {new Date(reclamation.updated_at).toLocaleString('fr-FR')}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReclamationsList;
