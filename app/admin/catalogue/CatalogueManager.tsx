'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Search,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowLeft,
  Globe,
  BookOpen,
  Settings,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  History,
  Download,
  RefreshCw
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';
import { Programme, VariantCard } from '@/components/programmes/types';

interface CatalogueStats {
  totalProgrammes: number;
  programmesVisibles: number;
  programmesActifs: number;
  categoriesRepresentees: number;
  derniereMiseAJour: string;
}

interface ModificationLog {
  id: string;
  programmeId: string;
  programmeTitre: string;
  action: 'VISIBLE' | 'CACHE' | 'ACTIVE' | 'INACTIVE';
  utilisateur: string;
  dateModification: string;
  ancienneValeur: boolean;
  nouvelleValeur: boolean;
}

interface CategorieProgramme {
  id: string;
  titre: string;
  couleur: string;
  description?: string;
}

export default function CatalogueManager() {
  const router = useRouter();
  const { toast } = useToast();

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [categories, setCategories] = useState<CategorieProgramme[]>([]);
  const [stats, setStats] = useState<CatalogueStats | null>(null);
  const [modificationLogs, setModificationLogs] = useState<ModificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categorieFilter, setCategorieFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showHistory, setShowHistory] = useState(false);

  const fetchCatalogueData = async () => {
    try {
      setLoading(true);

      // Récupérer tous les programmes catalogue (actifs et inactifs)
      const params = new URLSearchParams({
        type: 'catalogue',
        includeInactive: 'true',
        ...(categorieFilter !== 'all' && { categorieId: categorieFilter }),
      });

      const [programmesResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/programmes-formation?${params}`),
        fetch('/api/categories-programme')
      ]);

      const programmesData = await programmesResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (programmesData.data) {
        const programmesFormatted = programmesData.data.map((prog: any) => ({
          id: prog.id,
          code: prog.code,
          titre: prog.titre,
          description: prog.description,
          type: prog.type || 'catalogue',
          dateCreation: prog.dateCreation,
          dateModification: prog.dateModification,
          duree: prog.duree,
          niveau: prog.niveau,
          participantsMax: parseInt(prog.participants) || 0,
          prix: parseFloat(prog.prix) || 0,
          categorieProgramme: prog.categorie ? {
            id: prog.categorie.id,
            titre: prog.categorie.titre,
            couleur: prog.categorie.couleur || '#3B82F6',
            description: prog.categorie.description
          } : undefined,
          estActif: prog.estActif,
          estVisible: prog.estVisible,
          statut: prog.estActif ? 'ACTIF' : 'ARCHIVE',
          objectifs: prog.objectifs || [],
          prerequis: prog.prerequis || [],
          publicConcerne: prog.publicConcerne,
          pictogramme: prog.pictogramme,
          programmeUrl: prog.programmeUrl
        }));

        setProgrammes(programmesFormatted);
        calculateStats(programmesFormatted);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data);
      }

    } catch (error) {
      console.error('Erreur lors du chargement du catalogue:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les données du catalogue.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (programmes: Programme[]) => {
    const totalProgrammes = programmes.length;
    const programmesVisibles = programmes.filter(p => p.estVisible).length;
    const programmesActifs = programmes.filter(p => p.estActif).length;
    const categoriesRepresentees = new Set(
      programmes
        .filter(p => p.categorieProgramme)
        .map(p => p.categorieProgramme?.id)
    ).size;

    setStats({
      totalProgrammes,
      programmesVisibles,
      programmesActifs,
      categoriesRepresentees,
      derniereMiseAJour: new Date().toISOString()
    });
  };

  const logModification = async (
    programmeId: string,
    programmeTitre: string,
    action: ModificationLog['action'],
    ancienneValeur: boolean,
    nouvelleValeur: boolean
  ) => {
    const newLog: ModificationLog = {
      id: Date.now().toString(),
      programmeId,
      programmeTitre,
      action,
      utilisateur: 'Administrateur', // À remplacer par l'utilisateur connecté
      dateModification: new Date().toISOString(),
      ancienneValeur,
      nouvelleValeur
    };

    setModificationLogs(prev => [newLog, ...prev.slice(0, 49)]); // Garder 50 logs max

    // Ici vous pourriez aussi envoyer vers une API de logs pour persister
    // await fetch('/api/audit-logs', { method: 'POST', body: JSON.stringify(newLog) });
  };

  useEffect(() => {
    fetchCatalogueData();
  }, [categorieFilter]);

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'visible' && programme.estVisible) ||
                         (statusFilter === 'cache' && !programme.estVisible) ||
                         (statusFilter === 'actif' && programme.estActif) ||
                         (statusFilter === 'inactif' && !programme.estActif);

    return matchesSearch && matchesStatus;
  });

  const handleToggleVisibility = async (programmeId: string, currentVisibility: boolean, programmeTitre: string) => {
    try {
      const response = await fetch(`/api/programmes-formation/${programmeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estVisible: !currentVisibility })
      });

      const data = await response.json();
      if (data.success) {
        await logModification(
          programmeId,
          programmeTitre,
          !currentVisibility ? 'VISIBLE' : 'CACHE',
          currentVisibility,
          !currentVisibility
        );

        await fetchCatalogueData();
        toast({
          title: 'Modification enregistrée',
          description: `"${programmeTitre}" ${!currentVisibility ? 'est maintenant visible' : 'a été masqué'} du catalogue public.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier la visibilité.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleStatus = async (programmeId: string, currentStatus: boolean, programmeTitre: string) => {
    try {
      const response = await fetch(`/api/programmes-formation/${programmeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estActif: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        await logModification(
          programmeId,
          programmeTitre,
          !currentStatus ? 'ACTIVE' : 'INACTIVE',
          currentStatus,
          !currentStatus
        );

        await fetchCatalogueData();
        toast({
          title: 'Statut modifié',
          description: `"${programmeTitre}" ${!currentStatus ? 'a été activé' : 'a été désactivé'}.`,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut.',
        variant: 'destructive',
      });
    }
  };

  const exportAuditLog = () => {
    const csvContent = [
      ['Date', 'Programme', 'Action', 'Utilisateur', 'Ancienne valeur', 'Nouvelle valeur'].join(','),
      ...modificationLogs.map(log => [
        new Date(log.dateModification).toLocaleString('fr-FR'),
        `"${log.programmeTitre}"`,
        log.action,
        log.utilisateur,
        log.ancienneValeur.toString(),
        log.nouvelleValeur.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-catalogue-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement du catalogue...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Tableau de bord
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              Gestion du Catalogue Public
            </h2>
            <p className="text-gray-600">
              Interface spécialisée pour la gestion du catalogue visible par vos clients
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2"
          >
            <History className="h-4 w-4" />
            Historique
          </Button>
          <Button
            variant="outline"
            onClick={() => window.open('/catalogue', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Prévisualiser
          </Button>
          <Button
            onClick={fetchCatalogueData}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Statistiques du catalogue */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Programmes catalogue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.totalProgrammes}</div>
              <p className="text-sm text-blue-700">Total disponibles</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Visibles au public
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.programmesVisibles}</div>
              <p className="text-sm text-green-700">
                {((stats.programmesVisibles / stats.totalProgrammes) * 100).toFixed(0)}% du catalogue
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-purple-800 flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Programmes actifs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{stats.programmesActifs}</div>
              <p className="text-sm text-purple-700">Prêts à être dispensés</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-orange-800 flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Catégories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.categoriesRepresentees}</div>
              <p className="text-sm text-orange-700">Domaines couverts</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Historique des modifications */}
      {showHistory && (
        <Card className="border-amber-200 bg-amber-50">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <History className="h-5 w-5" />
                Historique des modifications (Audit)
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={exportAuditLog}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Exporter CSV
              </Button>
            </div>
            <CardDescription className="text-amber-700">
              Traçabilité complète des modifications pour audit et conformité
            </CardDescription>
          </CardHeader>
          <CardContent>
            {modificationLogs.length === 0 ? (
              <p className="text-amber-600 text-center py-4">Aucune modification enregistrée</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {modificationLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      {log.action === 'VISIBLE' ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : log.action === 'CACHE' ? (
                        <EyeOff className="h-4 w-4 text-red-600" />
                      ) : log.action === 'ACTIVE' ? (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-gray-600" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{log.programmeTitre}</p>
                        <p className="text-xs text-gray-600">
                          {log.action === 'VISIBLE' ? 'Rendu visible au public' :
                           log.action === 'CACHE' ? 'Masqué du public' :
                           log.action === 'ACTIVE' ? 'Programme activé' :
                           'Programme désactivé'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{log.utilisateur}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.dateModification).toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filtres et recherche */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            placeholder="Rechercher un programme..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-none bg-white"
          />
        </div>

        <Select value={categorieFilter} onValueChange={setCategorieFilter}>
          <SelectTrigger className="w-[200px] bg-white">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.titre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="visible">Visibles</SelectItem>
            <SelectItem value="cache">Cachés</SelectItem>
            <SelectItem value="actif">Actifs</SelectItem>
            <SelectItem value="inactif">Inactifs</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des programmes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {filteredProgrammes.length} programme{filteredProgrammes.length > 1 ? 's' : ''} trouvé{filteredProgrammes.length > 1 ? 's' : ''}
          </h3>
          <div className="text-sm text-gray-500">
            Dernière mise à jour: {stats && new Date(stats.derniereMiseAJour).toLocaleString('fr-FR')}
          </div>
        </div>

        {filteredProgrammes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucun programme trouvé</p>
            <p className="text-gray-400">Ajustez vos filtres ou créez un nouveau programme</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProgrammes.map((programme) => (
              <div key={programme.id} className="relative">
                {/* Badges de statut spécialisés pour le catalogue */}
                <div className="absolute top-2 right-2 z-10 flex gap-1 flex-col">
                  {!programme.estActif && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                      Inactif
                    </Badge>
                  )}
                  {!programme.estVisible && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Masqué du public
                    </Badge>
                  )}
                  {programme.estVisible && programme.estActif && (
                    <Badge variant="default" className="bg-green-100 text-green-800 border-green-300">
                      ✓ Visible
                    </Badge>
                  )}
                </div>

                <ProgrammeCard
                  programme={programme}
                  variant={VariantCard.CATALOGUE}
                  showActions={true}
                  actions={{
                    onView: () => router.push(`/admin/programmes/${programme.id}`),
                    onSchedule: () => {
                      window.location.href = `/rendezvous-positionnement?programme=${programme.id}`;
                    }
                  }}
                />

                {/* Actions spécialisées pour le catalogue */}
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant={programme.estVisible ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleVisibility(programme.id, programme.estVisible || false, programme.titre)}
                      className="flex-1"
                    >
                      {programme.estVisible ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-1" />
                          Masquer du catalogue
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-1" />
                          Rendre visible
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    variant={programme.estActif ? "outline" : "secondary"}
                    size="sm"
                    onClick={() => handleToggleStatus(programme.id, programme.estActif || false, programme.titre)}
                    className="w-full"
                  >
                    {programme.estActif ? (
                      <>
                        <XCircle className="h-4 w-4 mr-1" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Activer
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}