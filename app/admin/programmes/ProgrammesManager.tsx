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
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  ArrowLeft,
  RotateCcw,
  BookOpen,
  Settings,
  ExternalLink
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';
import { Programme, TypeProgramme, VariantCard } from '@/components/programmes/types';

interface CategorieProgramme {
  id: string;
  titre: string;
  couleur: string;
  description?: string;
}

export default function ProgrammesManager() {
  const router = useRouter();
  const { toast } = useToast();

  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [categories, setCategories] = useState<CategorieProgramme[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categorieFilter, setCategorieFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Statistiques
  const [stats, setStats] = useState({
    total: 0,
    catalogue: 0,
    surMesure: 0,
    actifs: 0,
    visibles: 0
  });

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        type: typeFilter !== 'all' ? typeFilter : '',
        categorieId: categorieFilter !== 'all' ? categorieFilter : '',
        includeInactive: 'true'
      });

      const response = await fetch(`/api/programmes-formation?${params}`);
      const data = await response.json();

      if (data.success) {
        const programmesFormatted = data.data.map((prog: any) => ({
          id: prog.id,
          titre: prog.titre,
          description: prog.description,
          type: prog.type || prog.typeProgramme || 'catalogue',
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
          statut: prog.estActif ? 'ACTIF' : 'ARCHIVE'
        }));

        setProgrammes(programmesFormatted);
        calculateStats(programmesFormatted);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les programmes.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories-programme');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    }
  };

  const calculateStats = (programmes: Programme[]) => {
    const total = programmes.length;
    const catalogue = programmes.filter(p => p.type === 'catalogue' || p.type === TypeProgramme.CATALOGUE).length;
    const surMesure = programmes.filter(p => p.type === 'sur-mesure' || p.type === TypeProgramme.SUR_MESURE).length;
    const actifs = programmes.filter(p => p.estActif).length;
    const visibles = programmes.filter(p => p.estVisible).length;

    setStats({ total, catalogue, surMesure, actifs, visibles });
  };

  useEffect(() => {
    fetchProgrammes();
    fetchCategories();
  }, [typeFilter, categorieFilter]);

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'actif' && programme.estActif) ||
                         (statusFilter === 'visible' && programme.estVisible) ||
                         (statusFilter === 'cache' && !programme.estVisible);

    return matchesSearch && matchesStatus;
  });

  const handleToggleVisibility = async (programmeId: string, currentVisibility: boolean) => {
    try {
      const response = await fetch(`/api/programmes-formation/${programmeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estVisible: !currentVisibility })
      });

      const data = await response.json();
      if (data.success) {
        await fetchProgrammes();
        toast({
          title: 'Succès',
          description: `Programme ${!currentVisibility ? 'affiché' : 'masqué'} du catalogue public.`,
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

  const handleToggleStatus = async (programmeId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/programmes-formation/${programmeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estActif: !currentStatus })
      });

      const data = await response.json();
      if (data.success) {
        await fetchProgrammes();
        toast({
          title: 'Succès',
          description: `Programme ${!currentStatus ? 'activé' : 'désactivé'}.`,
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

  const handleDelete = async (programmeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) return;

    try {
      const response = await fetch(`/api/programmes-formation/${programmeId}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (data.success) {
        await fetchProgrammes();
        toast({
          title: 'Succès',
          description: 'Programme supprimé avec succès.',
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le programme.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des programmes...</span>
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
            <h2 className="text-2xl font-bold tracking-tight">Gestion des Programmes</h2>
            <p className="text-gray-600">
              Administration complète de votre catalogue de formations
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.open('/catalogue', '_blank')}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Voir le catalogue public
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nouveau programme
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Total</p>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm text-green-600">Catalogue</p>
              <p className="text-2xl font-bold text-green-900">{stats.catalogue}</p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-600" />
            <div>
              <p className="text-sm text-orange-600">Sur-mesure</p>
              <p className="text-2xl font-bold text-orange-900">{stats.surMesure}</p>
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="text-sm text-emerald-600">Visibles</p>
              <p className="text-2xl font-bold text-emerald-900">{stats.visibles}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-purple-600" />
            <div>
              <p className="text-sm text-purple-600">Actifs</p>
              <p className="text-2xl font-bold text-purple-900">{stats.actifs}</p>
            </div>
          </div>
        </div>
      </div>

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

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les types</SelectItem>
            <SelectItem value="catalogue">Catalogue</SelectItem>
            <SelectItem value="sur-mesure">Sur-mesure</SelectItem>
          </SelectContent>
        </Select>

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
          <SelectTrigger className="w-[160px] bg-white">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            <SelectItem value="actif">Actifs</SelectItem>
            <SelectItem value="visible">Visibles</SelectItem>
            <SelectItem value="cache">Cachés</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Liste des programmes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">
            {filteredProgrammes.length} programme{filteredProgrammes.length > 1 ? 's' : ''} trouvé{filteredProgrammes.length > 1 ? 's' : ''}
          </h3>
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
                {/* Badges de statut */}
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  {!programme.estActif && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800">
                      Inactif
                    </Badge>
                  )}
                  {!programme.estVisible && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                      Masqué
                    </Badge>
                  )}
                </div>

                <ProgrammeCard
                  programme={programme}
                  variant={VariantCard.UNIVERSAL}
                  showActions={true}
                  actions={{
                    onView: () => router.push(`/admin/programmes/${programme.id}`),
                    onEdit: () => router.push(`/admin/programmes/${programme.id}/edit`),
                    onDelete: () => handleDelete(programme.id),
                    onSchedule: () => router.push(`/admin/programmes/${programme.id}/planning`),
                  }}
                />

                {/* Actions administratives */}
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleVisibility(programme.id, programme.estVisible || false)}
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
                        Afficher au catalogue
                      </>
                    )}
                  </Button>
                  <Button
                    variant={programme.estActif ? "destructive" : "default"}
                    size="sm"
                    onClick={() => handleToggleStatus(programme.id, programme.estActif || false)}
                  >
                    {programme.estActif ? (
                      <>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Désactiver
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4 mr-1" />
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