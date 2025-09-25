'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import ProcessusPedagogique from './ProcessusPedagogique';

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
  categorie?: { id: string; titre: string };
}

export default function Catalogue() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; titre: string }[]>([]);
  const [selectedFormation, setSelectedFormation] = useState<ProgrammeFormation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, currentPage: 1, limit: 6 });

  const [searchState, setSearchState] = useState({
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '6'),
    categorieId: searchParams.get('categorieId') || '',
    search: searchParams.get('search') || '',
  });

  // --- Fetch catégories ---
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Erreur lors du chargement des catégories');
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // --- Fetch programmes ---
  const fetchProgrammes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: searchState.page.toString(),
        limit: searchState.limit.toString(),
        ...(searchState.categorieId && { categorieId: searchState.categorieId }),
        ...(searchState.search && { search: searchState.search }),
      });

      const res = await fetch(`/api/programmes-formation/par-categorie?${params}`);
      if (!res.ok) throw new Error('Erreur lors du chargement des programmes');

      const data = await res.json();
      setProgrammes(data.data);
      setPagination(prev => ({
        ...prev,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
        currentPage: searchState.page,
      }));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setProgrammes([]);
    } finally {
      setLoading(false);
    }
  }, [searchState]);

  useEffect(() => {
    const url = new URLSearchParams();
    Object.entries(searchState).forEach(([key, value]) => {
      if (value) url.set(key, value.toString());
    });
    router.replace(`${pathname}?${url.toString()}`);
    fetchProgrammes();
  }, [searchState, pathname, router, fetchProgrammes]);

  // --- Handlers ---
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchState(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleCategoryChange = (value: string) => {
    setSearchState(prev => ({ ...prev, categorieId: value, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setSearchState(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDetailModal = (formation: ProgrammeFormation) => {
    setSelectedFormation(formation);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setTimeout(() => setSelectedFormation(null), 200);
  };

  const onPositionnement = (titre: string) => {
    router.push(`/rendezvous-positionnement?formation=${encodeURIComponent(titre)}`);
  };

  // --- Render ---
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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-2">Réessayer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Filtres */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Trouvez votre formation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input type="text" placeholder="Rechercher une formation..." value={searchState.search} onChange={handleSearchChange} className="md:col-span-2" />
            <Select value={searchState.categorieId || undefined} onValueChange={handleCategoryChange}>
              <SelectTrigger><SelectValue placeholder="Toutes les catégories" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">Toutes les catégories</SelectItem>
                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.titre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Résultats */}
        <div className="mb-4 text-gray-600">{pagination.total} formation(s) trouvée(s)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {programmes.map(p => (
            <Card key={p.id} className="flex flex-col h-full">
              <CardHeader>
                {p.categorie && <span className="text-sm text-blue-600">{p.categorie.titre}</span>}
                <CardTitle>{p.titre}</CardTitle>
                <CardDescription>Durée : {p.duree} • Niveau : {p.niveau}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-gray-700 line-clamp-3">{p.description}</p>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2">
                <Button variant="outline" onClick={() => openDetailModal(p)}>Détails du parcours</Button>
                <Button onClick={() => onPositionnement(p.titre)}>Réserver un RDV</Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Modale */}
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedFormation && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedFormation.titre}</DialogTitle>
                  <DialogDescription>
                    Durée : {selectedFormation.duree} • Niveau : {selectedFormation.niveau}
                    {selectedFormation.categorie && <> • {selectedFormation.categorie.titre}</>}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div><h3 className="font-semibold text-lg">Description</h3><p>{selectedFormation.description}</p></div>
                  {selectedFormation.objectifs && <div><h3 className="font-semibold text-lg">Objectifs</h3><ul className="list-disc pl-4">{selectedFormation.objectifs.map(obj => <li key={obj}>{obj}</li>)}</ul></div>}
                  <div><h3 className="font-semibold text-lg">Prérequis</h3><p>{selectedFormation.prerequis || 'Aucun prérequis'}</p></div>
                  <div><h3 className="font-semibold text-lg">Public concerné</h3><p>{selectedFormation.publicConcerne || 'Tout public'}</p></div>
                  {selectedFormation.programme && <div><h3 className="font-semibold text-lg">Programme</h3><ul className="list-disc pl-4">{selectedFormation.programme.map(item => <li key={item}>{item}</li>)}</ul></div>}
                  <div><h3 className="font-semibold text-lg">Modalités pédagogiques</h3><p>{selectedFormation.modalitesPedagogiques || 'Non spécifiées'}</p></div>
                  <div><h3 className="font-semibold text-lg">Modalités d'évaluation</h3><p>{selectedFormation.modalitesEvaluation || 'Non spécifiées'}</p></div>
                  <div><h3 className="font-semibold text-lg">Validation</h3><p>{selectedFormation.validation || 'Non spécifiée'}</p></div>
                  <div><h3 className="font-semibold text-lg">Accessibilité handicap</h3><p>{selectedFormation.accessibiliteHandicap ? 'Oui' : 'Non'}</p></div>
                  <div className="flex justify-end gap-2 pt-4">
                    <Button variant="outline" onClick={closeDetailModal}>Fermer</Button>
                    <Link href={`/formations/${selectedFormation.id}`}><Button>Voir la fiche complète</Button></Link>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <Button onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={pagination.currentPage <= 1} variant="outline">Précédent</Button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (pagination.totalPages > 5) {
                if (pagination.currentPage <= 3) pageNum = i + 1;
                else if (pagination.currentPage >= pagination.totalPages - 2) pageNum = pagination.totalPages - 4 + i;
                else pageNum = pagination.currentPage - 2 + i;
              }
              return <Button key={pageNum} onClick={() => handlePageChange(pageNum)} variant={pagination.currentPage === pageNum ? 'default' : 'outline'} className="w-10 h-10 p-0 flex items-center justify-center">{pageNum}</Button>;
            })}
            <Button onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={pagination.currentPage >= pagination.totalPages} variant="outline">Suivant</Button>
          </div>
        )}

        {/* Processus pédagogique */}
        <div className="mt-16"><ProcessusPedagogique /></div>
      </div>
    </div>
  );
}
