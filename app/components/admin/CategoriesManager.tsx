'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { useProgrammesFormation } from '@/hooks/useProgrammesFormation';

export default function CategoriesManager() {
  const { categories, fetchCategories, loading, error } = useProgrammesFormation();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    titre: '',
    description: '',
    ordre: 0
  });
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ordre' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PATCH' : 'POST';
      const url = editingId 
        ? `/categories/${editingId}`
        : '/categories';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la sauvegarde');
      }

      await fetchCategories();
      setEditingId(null);
      setFormData({ code: '', titre: '', description: '', ordre: 0 });
      
      toast({
        title: 'Succès',
        description: `Catégorie ${editingId ? 'mise à jour' : 'créée'} avec succès`
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Une erreur est survenue',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (category: any) => {
    setEditingId(category.id);
    setFormData({
      code: category.code,
      titre: category.titre,
      description: category.description || '',
      ordre: category.ordre || 0
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) return;
    
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erreur lors de la suppression');
      }

      await fetchCategories();
      toast({
        title: 'Succès',
        description: 'Catégorie supprimée avec succès'
      });
    } catch (error) {
      toast({
        title: 'Erreur',
        description: error instanceof Error ? error.message : 'Erreur lors de la suppression',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gestion des catégories</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
        <h3 className="text-lg font-medium">
          {editingId ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="code">Code *</Label>
            <Input
              id="code"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="titre">Titre *</Label>
            <Input
              id="titre"
              name="titre"
              value={formData.titre}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="w-32">
          <Label htmlFor="ordre">Ordre d'affichage</Label>
          <Input
            id="ordre"
            name="ordre"
            type="number"
            min="0"
            value={formData.ordre}
            onChange={handleInputChange}
          />
        </div>
        
        <div className="flex gap-2">
          <Button type="submit">
            {editingId ? 'Mettre à jour' : 'Créer'}
          </Button>
          {editingId && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setEditingId(null);
                setFormData({ code: '', titre: '', description: '', ordre: 0 });
              }}
            >
              Annuler
            </Button>
          )}
        </div>
      </form>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Titre</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Ordre</TableHead>
              <TableHead className="w-32">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Chargement...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-red-500 py-4">
                  {error}
                </TableCell>
              </TableRow>
            ) : categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-gray-500 py-4">
                  Aucune catégorie trouvée
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.code}</TableCell>
                  <TableCell className="font-medium">{category.titre}</TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {category.description || '-'}
                  </TableCell>
                  <TableCell className="text-right">{category.ordre}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      Modifier
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(category.id)}
                    >
                      Supprimer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
