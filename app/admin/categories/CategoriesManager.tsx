'use client';

// app/admin/categories/CategoriesManager.tsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  ArrowUp,
  ArrowDown,
  Save,
  X,
  ArrowLeft
} from 'lucide-react';
import { Categorie, CreateCategorieData, UpdateCategorieData } from './types';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export default function CategoriesManager() {
  const router = useRouter();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Categorie | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Categorie | null>(null);
  const [formData, setFormData] = useState<CreateCategorieData>({
    code: '',
    titre: '',
    description: '',
    ordre: 0
  });
  const { toast } = useToast();

  // Charger les catégories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get<Categorie[]>('/api/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les catégories.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Réinitialiser le formulaire
  const resetForm = () => {
    setFormData({
      code: '',
      titre: '',
      description: '',
      ordre: categories.length
    });
    setEditingCategory(null);
  };

  // Ouvrir le modal pour créer
  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Ouvrir le modal pour modifier
  const handleEdit = (category: Categorie) => {
    setEditingCategory(category);
    setFormData({
      code: category.code,
      titre: category.titre,
      description: category.description || '',
      ordre: category.ordre
    });
    setIsModalOpen(true);
  };

  // Sauvegarder (créer ou modifier)
  const handleSave = async () => {
    if (!formData.titre.trim() || !formData.code.trim()) {
      toast({
        title: 'Erreur',
        description: 'Le titre et le code sont obligatoires.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSaving(true);

      if (editingCategory) {
        // Modification
        await api.patch(`/api/categories/${editingCategory.id}`, formData);
        toast({
          title: 'Succès',
          description: 'Catégorie modifiée avec succès.',
        });
      } else {
        // Création
        await api.post('/api/categories', formData);
        toast({
          title: 'Succès',
          description: 'Catégorie créée avec succès.',
        });
      }

      setIsModalOpen(false);
      resetForm();
      fetchCategories();
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      toast({
        title: 'Erreur',
        description: error?.response?.data?.error || 'Erreur lors de la sauvegarde.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Supprimer une catégorie
  const handleDelete = async () => {
    if (!deleteCategory) return;

    try {
      setSaving(true);
      await api.delete(`/api/categories/${deleteCategory.id}`);
      toast({
        title: 'Succès',
        description: 'Catégorie supprimée avec succès.',
      });
      setIsDeleteDialogOpen(false);
      setDeleteCategory(null);
      fetchCategories();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: 'Erreur',
        description: error?.response?.data?.error || 'Erreur lors de la suppression.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Déplacer une catégorie
  const moveCategory = async (category: Categorie, direction: 'up' | 'down') => {
    const currentIndex = categories.findIndex(c => c.id === category.id);
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= categories.length) return;

    const targetCategory = categories[newIndex];

    try {
      // Échanger les ordres
      await api.patch(`/api/categories/${category.id}`, { ordre: targetCategory.ordre });
      await api.patch(`/api/categories/${targetCategory.id}`, { ordre: category.ordre });

      fetchCategories();
    } catch (error) {
      console.error('Erreur lors du déplacement:', error);
      toast({
        title: 'Erreur',
        description: 'Erreur lors du déplacement de la catégorie.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des catégories...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
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
            <h2 className="text-2xl font-bold tracking-tight">Gestion des Catégories</h2>
            <p className="text-gray-600">
              Gérez les catégories de formations ({categories.length} catégories)
            </p>
          </div>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle catégorie
        </Button>
      </div>

      {/* Table des catégories */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ordre</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Programmes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  Aucune catégorie trouvée. Créez votre première catégorie !
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{category.ordre}</span>
                      <div className="flex flex-col">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveCategory(category, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveCategory(category, 'down')}
                          disabled={index === categories.length - 1}
                        >
                          <ArrowDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{category.code}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{category.titre}</TableCell>
                  <TableCell className="max-w-xs truncate" title={category.description}>
                    {category.description || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {category._count?.programmes || 0} programmes
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(category)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setDeleteCategory(category);
                          setIsDeleteDialogOpen(true);
                        }}
                        disabled={(category._count?.programmes || 0) > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de création/modification */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory
                ? 'Modifiez les informations de la catégorie.'
                : 'Créez une nouvelle catégorie de formation.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="ex: WEB-DEV"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="titre">Titre *</Label>
              <Input
                id="titre"
                value={formData.titre}
                onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                placeholder="ex: Développement Web"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description de la catégorie..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="ordre">Ordre d'affichage</Label>
              <Input
                id="ordre"
                type="number"
                value={formData.ordre}
                onChange={(e) => setFormData({ ...formData, ordre: parseInt(e.target.value) || 0 })}
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {editingCategory ? 'Modifier' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de suppression */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer la catégorie</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer la catégorie "{deleteCategory?.titre}" ?
              Cette action est irréversible.
              {deleteCategory && (deleteCategory._count?.programmes || 0) > 0 && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                  <strong>Attention:</strong> Cette catégorie contient {deleteCategory._count?.programmes} programmes
                  et ne peut pas être supprimée.
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving || (deleteCategory && (deleteCategory._count?.programmes || 0) > 0)}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}