'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Save,
  X,
  ArrowLeft,
  Shield,
  User,
  Mail,
  MailCheck
} from 'lucide-react';
import { User as UserType } from './types';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

export default function UsersManagerSimple() {
  const router = useRouter();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [editRole, setEditRole] = useState<'admin' | 'user'>('user');
  const [editActive, setEditActive] = useState(true);
  const [updating, setUpdating] = useState(false);
  const { toast } = useToast();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get<UserType[]>('/api/users');
      setUsers(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les utilisateurs.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      setUpdating(true);
      const response = await api.patch(`/api/users/${editingUser.clerkId}`, {
        role: editRole,
        isActive: editActive,
      });

      if (response.data.success) {
        toast({
          title: 'Succès',
          description: 'Utilisateur mis à jour avec succès.',
        });
        setEditingUser(null);
        fetchUsers();
      } else {
        throw new Error(response.data.error || 'Erreur lors de la mise à jour');
      }
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      toast({
        title: 'Erreur',
        description: error.response?.data?.error || 'Impossible de mettre à jour l\'utilisateur.',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Chargement des utilisateurs...</span>
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
            <h2 className="text-2xl font-bold tracking-tight">Gestion des Utilisateurs</h2>
            <p className="text-gray-600">
              Gérez les utilisateurs de la plateforme ({users.length} utilisateurs)
            </p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          💡 Les utilisateurs sont créés automatiquement via Clerk lors de l'inscription
        </div>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Email vérifié</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date de création</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Aucun utilisateur trouvé.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.name || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="h-3 w-3 mr-1" />Admin
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3 mr-1" />Utilisateur
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {user.emailVerified ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <MailCheck className="h-3 w-3 mr-1" />
                        Vérifié
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-orange-600">
                        <Mail className="h-3 w-3 mr-1" />
                        Non vérifié
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingUser(user);
                          setEditRole(user.role);
                          setEditActive(user.isActive);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Modifier l'utilisateur</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingUser(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={editingUser.email} disabled />
              </div>

              <div>
                <Label>Nom</Label>
                <Input value={editingUser.name || ''} disabled />
              </div>

              <div>
                <Label htmlFor="role">Rôle</Label>
                <select
                  id="role"
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'admin' | 'user')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">Utilisateur</option>
                  <option value="admin">Administrateur</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editActive}
                  onChange={(e) => setEditActive(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <Label htmlFor="isActive">Compte actif</Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setEditingUser(null)}
                disabled={updating}
              >
                Annuler
              </Button>
              <Button
                onClick={handleUpdateUser}
                disabled={updating}
              >
                {updating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}