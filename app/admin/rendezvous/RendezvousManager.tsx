'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/services/api';

interface Rendezvous {
  id: string;
  type: string;
  status: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  dateRdv?: string;
  formationTitre?: string;
  formationSelectionnee?: string;
  notes?: string;
  commentaires?: string;
  dureeRdv?: number;
  formatRdv?: string;
  lieuRdv?: string;
  lienVisio?: string;
  createdAt?: string;
}

const statusConfig = {
  'nouveau': { label: 'Nouveau', color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
  'planifie': { label: 'Planifié', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  'confirme': { label: 'Confirmé', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  'en_cours': { label: 'En cours', color: 'bg-purple-100 text-purple-800', icon: Clock },
  'termine': { label: 'Terminé', color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  'annule': { label: 'Annulé', color: 'bg-red-100 text-red-800', icon: XCircle },
  'reporte': { label: 'Reporté', color: 'bg-orange-100 text-orange-800', icon: AlertCircle },
};

const typeConfig = {
  'positionnement': { label: 'Positionnement', color: 'bg-blue-50 text-blue-700' },
  'suivi': { label: 'Suivi', color: 'bg-green-50 text-green-700' },
  'information': { label: 'Information', color: 'bg-purple-50 text-purple-700' },
  'evaluation': { label: 'Évaluation', color: 'bg-orange-50 text-orange-700' },
};

export default function RendezvousManager() {
  console.log('=== RendezvousManager START ===');

  const [rendezvous, setRendezvous] = useState<Rendezvous[]>([]);
  const [filteredRendezvous, setFilteredRendezvous] = useState<Rendezvous[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('tous');
  const [typeFilter, setTypeFilter] = useState('tous');
  const [selectedRendezvous, setSelectedRendezvous] = useState<Rendezvous | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  let toast: any;
  try {
    const result = useToast();
    toast = result.toast;
    console.log('useToast hook OK');
  } catch (error) {
    console.error('Error with useToast:', error);
    toast = () => {};
  }

  const stats = {
    total: rendezvous.length,
    nouveaux: rendezvous.filter(rdv => rdv.status === 'nouveau').length,
    planifies: rendezvous.filter(rdv => rdv.status === 'planifie').length,
    confirmes: rendezvous.filter(rdv => rdv.status === 'confirme').length,
    termines: rendezvous.filter(rdv => rdv.status === 'termine').length,
  };

  useEffect(() => {
    fetchRendezvous();
  }, []);

  useEffect(() => {
    filterRendezvous();
  }, [rendezvous, searchTerm, statusFilter, typeFilter]);

  const fetchRendezvous = async () => {
    try {
      console.log('Fetching rendez-vous...');

      // Test direct avec fetch au lieu d'axios
      const response = await fetch('/api/rendezvous');
      console.log('Fetch response status:', response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      console.log('JSON data:', jsonData);

      const rdvData = jsonData?.data || [];
      console.log('Rendez-vous data:', rdvData);
      console.log('Nombre de rendez-vous:', rdvData.length);

      setRendezvous(rdvData);
    } catch (error) {
      console.error('Erreur lors de la récupération des rendez-vous:', error);
      console.error('Error details:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
      });
      setRendezvous([]); // Force un tableau vide en cas d'erreur
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const filterRendezvous = () => {
    let filtered = rendezvous;

    // Filtre par terme de recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(rdv =>
        rdv.nom.toLowerCase().includes(term) ||
        rdv.prenom.toLowerCase().includes(term) ||
        rdv.email.toLowerCase().includes(term) ||
        rdv.formationTitre?.toLowerCase().includes(term) ||
        rdv.formationSelectionnee?.toLowerCase().includes(term)
      );
    }

    // Filtre par statut
    if (statusFilter !== 'tous') {
      filtered = filtered.filter(rdv => rdv.status === statusFilter);
    }

    // Filtre par type
    if (typeFilter !== 'tous') {
      filtered = filtered.filter(rdv => rdv.type === typeFilter);
    }

    setFilteredRendezvous(filtered);
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.put(`/api/rendezvous/${id}`, { status: newStatus });

      setRendezvous(prev => prev.map(rdv =>
        rdv.id === id ? { ...rdv, status: newStatus } : rdv
      ));

      toast({
        title: "Statut mis à jour",
        description: `Le rendez-vous a été marqué comme ${statusConfig[newStatus as keyof typeof statusConfig]?.label}`,
      });
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive"
      });
    }
  };

  const deleteRendezvous = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rendez-vous ?')) {
      return;
    }

    try {
      await api.delete(`/api/rendezvous/${id}`);

      setRendezvous(prev => prev.filter(rdv => rdv.id !== id));

      toast({
        title: "Rendez-vous supprimé",
        description: "Le rendez-vous a été supprimé avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression du rendez-vous:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous",
        variant: "destructive"
      });
    }
  };

  const exportToCSV = () => {
    const csvData = filteredRendezvous.map(rdv => ({
      'Date de création': rdv.createdAt ? format(new Date(rdv.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr }) : '',
      'Nom': rdv.nom,
      'Prénom': rdv.prenom,
      'Email': rdv.email,
      'Téléphone': rdv.telephone || '',
      'Type': typeConfig[rdv.type as keyof typeof typeConfig]?.label || rdv.type,
      'Statut': statusConfig[rdv.status as keyof typeof statusConfig]?.label || rdv.status,
      'Formation': rdv.formationTitre || rdv.formationSelectionnee || '',
      'Date RDV': rdv.dateRdv ? format(new Date(rdv.dateRdv), 'dd/MM/yyyy HH:mm', { locale: fr }) : '',
      'Lieu': rdv.lieuRdv || '',
      'Format': rdv.formatRdv || '',
      'Durée (min)': rdv.dureeRdv || '',
      'Notes': rdv.notes || '',
      'Commentaires': rdv.commentaires || '',
    }));

    const csvContent = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(value => `"${value}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rendezvous_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export réussi",
      description: `${filteredRendezvous.length} rendez-vous exportés`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des rendez-vous...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
          <p className="text-gray-600 mt-1">Gérez tous vos rendez-vous de positionnement et autres</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={exportToCSV} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter CSV
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau RDV
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Nouveaux</p>
                <p className="text-2xl font-bold text-blue-600">{stats.nouveaux}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Planifiés</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.planifies}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmés</p>
                <p className="text-2xl font-bold text-green-600">{stats.confirmes}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Terminés</p>
                <p className="text-2xl font-bold text-gray-600">{stats.termines}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, email, formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                {Object.entries(statusConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les types</SelectItem>
                {Object.entries(typeConfig).map(([key, config]) => (
                  <SelectItem key={key} value={key}>{config.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {filteredRendezvous.length} résultat{filteredRendezvous.length > 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des rendez-vous */}
      <div className="space-y-4">
        {filteredRendezvous.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous trouvé</h3>
              <p className="text-gray-600">
                {rendezvous.length === 0
                  ? "Aucun rendez-vous n'a été créé pour le moment."
                  : "Aucun rendez-vous ne correspond à vos critères de recherche."}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredRendezvous.map((rdv) => {
            const StatusIcon = statusConfig[rdv.status as keyof typeof statusConfig]?.icon || AlertCircle;
            const statusConfig_item = statusConfig[rdv.status as keyof typeof statusConfig];
            const typeConfig_item = typeConfig[rdv.type as keyof typeof typeConfig];

            return (
              <Card key={rdv.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <User className="h-5 w-5 text-gray-600" />
                          <span className="font-semibold text-lg text-gray-900">
                            {rdv.prenom} {rdv.nom}
                          </span>
                        </div>

                        {statusConfig_item && (
                          <Badge className={statusConfig_item.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig_item.label}
                          </Badge>
                        )}

                        {typeConfig_item && (
                          <Badge variant="outline" className={typeConfig_item.color}>
                            {typeConfig_item.label}
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="h-4 w-4" />
                          <span>{rdv.email}</span>
                        </div>

                        {rdv.telephone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4" />
                            <span>{rdv.telephone}</span>
                          </div>
                        )}

                        {rdv.dateRdv && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{format(new Date(rdv.dateRdv), 'dd/MM/yyyy à HH:mm', { locale: fr })}</span>
                          </div>
                        )}

                        {(rdv.formationTitre || rdv.formationSelectionnee) && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <FileText className="h-4 w-4" />
                            <span>{rdv.formationTitre || rdv.formationSelectionnee}</span>
                          </div>
                        )}

                        {rdv.lieuRdv && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="h-4 w-4" />
                            <span>{rdv.lieuRdv}</span>
                          </div>
                        )}

                        {rdv.dureeRdv && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>{rdv.dureeRdv} minutes</span>
                          </div>
                        )}
                      </div>

                      {(rdv.notes || rdv.commentaires) && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-700">
                            {rdv.notes || rdv.commentaires}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {rdv.status === 'nouveau' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(rdv.id, 'planifie')}
                        >
                          Planifier
                        </Button>
                      )}

                      {rdv.status === 'planifie' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(rdv.id, 'confirme')}
                        >
                          Confirmer
                        </Button>
                      )}

                      {rdv.status === 'confirme' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateStatus(rdv.id, 'termine')}
                        >
                          Terminer
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRendezvous(rdv);
                          setViewModalOpen(true);
                        }}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedRendezvous(rdv);
                          setEditModalOpen(true);
                        }}
                        title="Modifier"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteRendezvous(rdv.id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}