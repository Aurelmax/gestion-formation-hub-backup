'use client';

import React, { useState, useEffect } from 'react';
import { Search, Filter, Loader2, BookOpen, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';
import { Programme, VariantCard } from '@/components/programmes/types';

interface CatalogueCategory {
  id: string;
  titre: string;
  description?: string;
  code: string;
  count: number;
}

interface CatalogueData {
  success: boolean;
  data: Programme[];
  categories: CatalogueCategory[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  meta: {
    filters: any;
    totalVisible: number;
  };
}

export default function CatalogueUnifie() {
  const [catalogueData, setCatalogueData] = useState<CatalogueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedNiveau, setSelectedNiveau] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchCatalogue = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory !== 'all' && { categorieId: selectedCategory }),
        ...(selectedNiveau !== 'all' && { niveau: selectedNiveau }),
      });

      const response = await fetch(`/api/catalogue/programmes?${params}`);
      const data = await response.json();

      if (data.success) {
        setCatalogueData(data);
      } else {
        throw new Error(data.error || 'Erreur lors du chargement');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du catalogue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalogue();
  }, [currentPage, selectedCategory, selectedNiveau]);

  // Déclencher la recherche avec un délai
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        fetchCatalogue();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleProgrammeClick = (programme: Programme) => {
    // Action lors du clic sur un programme (par exemple, ouvrir une modale de détails)
    console.log('Programme cliqué:', programme);
    // Vous pouvez implémenter ici l'ouverture d'une page de détails ou d'une modale
  };

  const niveauxDisponibles = ['Débutant', 'Intermédiaire', 'Avancé', 'Expert'];

  if (loading && !catalogueData) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Chargement du catalogue...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques */}
      {catalogueData && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Notre catalogue de formations
              </h2>
              <p className="text-gray-600">
                {catalogueData.meta.totalVisible} formation{catalogueData.meta.totalVisible > 1 ? 's' : ''}
                {' '}disponible{catalogueData.meta.totalVisible > 1 ? 's' : ''} dans
                {' '}{catalogueData.categories.length} catégorie{catalogueData.categories.length > 1 ? 's' : ''}
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{catalogueData.categories.length}</div>
                <div className="text-sm text-gray-600">Catégories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">{catalogueData.meta.totalVisible}</div>
                <div className="text-sm text-gray-600">Formations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filtres et recherche */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Recherche */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Filtre par catégorie */}
          <div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Toutes catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {catalogueData?.categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.titre} ({category.count})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Filtre par niveau */}
          <div>
            <Select value={selectedNiveau} onValueChange={setSelectedNiveau}>
              <SelectTrigger>
                <SelectValue placeholder="Tous niveaux" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous niveaux</SelectItem>
                {niveauxDisponibles.map((niveau) => (
                  <SelectItem key={niveau} value={niveau}>
                    {niveau}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Badges de filtres actifs */}
        {(searchTerm || selectedCategory !== 'all' || selectedNiveau !== 'all') && (
          <div className="flex gap-2 mt-4 flex-wrap">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                <Search className="h-3 w-3" />
                {searchTerm}
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                {catalogueData?.categories.find(c => c.id === selectedCategory)?.titre}
                <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
            {selectedNiveau !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                <Filter className="h-3 w-3" />
                {selectedNiveau}
                <button onClick={() => setSelectedNiveau('all')} className="ml-1 hover:text-red-600">×</button>
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Résultats */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          <span className="ml-2">Recherche en cours...</span>
        </div>
      ) : catalogueData?.data.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">Aucune formation trouvée</p>
          <p className="text-gray-400">Essayez de modifier vos critères de recherche</p>
        </div>
      ) : (
        <>
          {/* Grille des programmes */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {catalogueData?.data.map((programme) => (
              <ProgrammeCard
                key={programme.id}
                programme={programme}
                variant={VariantCard.CATALOGUE}
                size="default"
                showActions={true}
                actions={{
                  onView: () => handleProgrammeClick(programme),
                  onSchedule: () => {
                    // Rediriger vers le formulaire de demande de rendez-vous
                    window.location.href = `/rendezvous-positionnement?programme=${programme.id}`;
                  }
                }}
                className="hover:shadow-lg transition-shadow duration-200"
              />
            ))}
          </div>

          {/* Pagination */}
          {catalogueData && catalogueData.pagination.totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={!catalogueData.pagination.hasPreviousPage}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Précédent
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: catalogueData.pagination.totalPages }, (_, i) => i + 1)
                  .filter(page =>
                    page === 1 ||
                    page === catalogueData.pagination.totalPages ||
                    Math.abs(page - currentPage) <= 2
                  )
                  .map((page, index, array) => (
                    <React.Fragment key={page}>
                      {index > 0 && array[index - 1] !== page - 1 && (
                        <span className="px-2 text-gray-400">...</span>
                      )}
                      <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </React.Fragment>
                  ))}
              </div>

              <Button
                variant="outline"
                disabled={!catalogueData.pagination.hasNextPage}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Suivant
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}