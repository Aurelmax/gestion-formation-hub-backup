'use client';

// 1. React et dépendances
import { useEffect, useState } from 'react';

// 2. Next.js
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

// 3. Composants UI
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

// 4. Autres composants
import ProcessusPedagogique from './ProcessusPedagogique';
import HeroSection from './HeroSection';

// 5. Types et interfaces
interface ProgrammeFormation {
  id: string;
  titre: string;
  description: string;
  duree: string;
  niveau: string;
  objectifs?: string[];
  prerequis?: string;
  publicConcerne?: string;
  programme?: string[];
  modalitesPedagogiques?: string;
  modalitesEvaluation?: string;
  validation?: string;
  accessibiliteHandicap?: boolean;
  categorie?: {
    id: string;
    titre: string;
    code: string;
  };
}

export default function Catalogue() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // États
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<Array<{id: string, titre: string}>>([]);
  const [selectedFormation, setSelectedFormation] = useState<ProgrammeFormation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  
  // Paramètres de recherche
  const [searchParamsState, setSearchParamsState] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '6'),
    categorieId: searchParams.get('categorieId') || '',
    search: searchParams.get('search') || '',
  });

  // Pagination
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  // Récupérer les catégories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          // S'assurer que data est bien un tableau
          setCategories(Array.isArray(data) ? data : []);
        } else {
          console.error('Erreur lors du chargement des catégories:', await res.text());
          setCategories([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des catégories:', err);
        setCategories([]);
      }
    };
    
    fetchCategories();
  }, []);

  // Récupérer les programmes
  useEffect(() => {
    const fetchProgrammes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const params = new URLSearchParams({
          page: searchParamsState.page.toString(),
          limit: searchParamsState.limit.toString(),
          ...(searchParamsState.categorieId && { categorieId: searchParamsState.categorieId }),
          ...(searchParamsState.search && { search: searchParamsState.search }),
        });

        const res = await fetch(`/api/programmes-formation/par-categorie?${params}`);
        
        if (!res.ok) {
          throw new Error('Erreur lors du chargement des programmes');
        }

        const data = await res.json();
        setProgrammes(data.data);
        setPagination({
          total: data.pagination.total,
          totalPages: data.pagination.totalPages,
        });
      } catch (err) {
        console.error('Erreur:', err);
        setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    // Mettre à jour l'URL
    const url = new URLSearchParams();
    Object.entries(searchParamsState).forEach(([key, value]) => {
      if (value) url.set(key, value.toString());
    });
    router.push(`${pathname}?${url.toString()}`);

    fetchProgrammes();
  }, [searchParamsState, pathname, router]);

  // Gestion des changements de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchParamsState(prev => ({
      ...prev,
      search: e.target.value,
      page: 1, // Réinitialiser à la première page
    }));
  };

  // Gestion du changement de catégorie
  const handleCategoryChange = (value: string) => {
    setSearchParamsState(prev => ({
      ...prev,
      categorieId: value,
      page: 1, // Réinitialiser à la première page
    }));
  };

  // Gestion du changement de page
  const handlePageChange = (newPage: number) => {
    setSearchParamsState(prev => ({
      ...prev,
      page: newPage,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Fonction pour ouvrir la modale de détail
  const openDetailModal = (formation: ProgrammeFormation) => {
    setSelectedFormation(formation);
    setShowDetailModal(true);
  };

  // Fonction pour fermer la modale de détail
  const closeDetailModal = () => {
    setShowDetailModal(false);
    // Petit délai pour permettre à l'animation de se terminer avant de réinitialiser
    setTimeout(() => setSelectedFormation(null), 200);
  };

  // Affichage du chargement
  if (loading && programmes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-full flex flex-col">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="flex-grow">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-5/6" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-32" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Affichage des erreurs
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Section Hero */}
      <HeroSection />
      
      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Trouvez votre formation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Barre de recherche */}
            <div className="md:col-span-2">
              <Input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchParamsState.search}
                onChange={handleSearchChange}
                className="w-full p-2 border rounded"
              />
            </div>
            
            {/* Filtre par catégorie */}
            <Select 
              value={searchParamsState.categorieId || undefined} 
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Toutes les catégories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="toutes">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.titre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Nombre de résultats */}
        <div className="mb-4 text-gray-600">
          {pagination.total} formation(s) trouvée(s)
        </div>

        {/* Liste des formations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {programmes.map((programme) => (
            <Card key={programme.id} className="flex flex-col h-full">
              <CardHeader>
                {programme.categorie && (
                  <span className="text-sm text-blue-600 font-medium mb-1">
                    {programme.categorie.titre}
                  </span>
                )}
                <CardTitle className="text-xl">{programme.titre}</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  Durée : {programme.duree} • Niveau : {programme.niveau}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700 line-clamp-3 mb-4">
                  {programme.description}
                </p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  onClick={() => openDetailModal(programme)}
                >
                  Détails du parcours
                </Button>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={() => onPositionnement(programme.titre)}
                >
                  Réserver un RDV de positionnement
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Modale de détail de la formation */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedFormation && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{selectedFormation.titre}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Durée : {selectedFormation.duree}</span>
                    <span>•</span>
                    <span>Niveau : {selectedFormation.niveau}</span>
                    {selectedFormation.categorie && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600">{selectedFormation.categorie.titre}</span>
                      </>
                    )}
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6 py-4">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Description</h3>
                    <p className="text-gray-700">{selectedFormation.description}</p>
                  </div>

                  {/* Ajoutez ici d'autres sections de détail comme Objectifs, Programme, etc. */}
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Objectifs de la formation</h3>
                    <ul className="list-disc pl-4">
                      {selectedFormation.objectifs?.map(objectif => (
                        <li key={objectif}>{objectif}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Prérequis</h3>
                    <p className="text-gray-700">{selectedFormation.prerequis || 'Aucun prérequis'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Public concerné</h3>
                    <p className="text-gray-700">{selectedFormation.publicConcerne || 'Tout public'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Programme</h3>
                    <ul className="list-disc pl-4">
                      {selectedFormation.programme?.map(item => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Modalités pédagogiques</h3>
                    <p className="text-gray-700">{selectedFormation.modalitesPedagogiques || 'Non spécifiées'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Modalités d'évaluation</h3>
                    <p className="text-gray-700">{selectedFormation.modalitesEvaluation || 'Non spécifiées'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Validation</h3>
                    <p className="text-gray-700">{selectedFormation.validation || 'Non spécifiée'}</p>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-2">Accessibilité pour les personnes en situation de handicap</h3>
                    <p className="text-gray-700">{selectedFormation.accessibiliteHandicap ? 'Oui' : 'Non'}</p>
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={closeDetailModal}>
                      Fermer
                    </Button>
                    <Link href={`/formations/${selectedFormation.id}`}>
                      <Button>Voir la fiche complète</Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button
              onClick={() => handlePageChange(searchParamsState.page - 1)}
              disabled={searchParamsState.page <= 1}
              variant="outline"
            >
              Précédent
            </Button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (searchParamsState.page <= 3) {
                pageNum = i + 1;
              } else if (searchParamsState.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = searchParamsState.page - 2 + i;
              }
              
              return (
                <Button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  variant={searchParamsState.page === pageNum ? "default" : "outline"}
                  className="w-10 h-10 p-0 flex items-center justify-center"
                >
                  {pageNum}
                </Button>
              );
            })}
            
            <Button
              onClick={() => handlePageChange(searchParamsState.page + 1)}
              disabled={searchParamsState.page >= pagination.totalPages}
              variant="outline"
            >
              Suivant
            </Button>
          </div>
        )}
        
        {/* Section du processus pédagogique */}
        <div className="mt-16">
          <ProcessusPedagogique />
        </div>
      </div>
    </div>
  );
};
