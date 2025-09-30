'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Calendar, User, Mail, Phone, Trash2, Edit, Eye, X, TrendingUp, FileText } from 'lucide-react';

interface Rendezvous {
  id: string;
  type: string;
  status: string;
  prenom: string;
  nom: string;
  email: string;
  telephone?: string;
  // Informations formation
  formationTitre?: string;
  formationSelectionnee?: string;
  // Dates
  dateRdv?: string;
  dateContact?: string;
  dateDebutSouhaitee?: string;
  dateFinSouhaitee?: string;
  // Détails RDV
  dureeRdv?: number;
  formatRdv?: string;
  lieuRdv?: string;
  lienVisio?: string;
  // Objectifs et compétences
  objectifs?: string;
  competencesActuelles?: string;
  competencesRecherchees?: string;
  niveau?: string;
  formatSouhaite?: string;
  disponibilites?: string;
  // Situation et attentes
  situationActuelle?: string;
  attentes?: string;
  pratiqueActuelle?: string;
  // Notes et commentaires
  commentaires?: string;
  notes?: string;
  synthese?: string;
  // Financement
  isFinancement?: boolean;
  typeFinancement?: string;
  organismeFinanceur?: string;
  // Handicap
  hasHandicap?: boolean;
  detailsHandicap?: string;
  besoinHandicap?: string;
  // Entreprise
  entreprise?: string;
  siret?: string;
  adresseEntreprise?: string;
  // Interlocuteur
  interlocuteurNom?: string;
  interlocuteurFonction?: string;
  interlocuteurEmail?: string;
  interlocuteurTelephone?: string;
  // Impact (pour type impact)
  dateImpact?: string;
  satisfactionImpact?: number;
  competencesAppliquees?: string;
  ameliorationsSuggeres?: string;
  commentairesImpact?: string;
  rendezvousParentId?: string;
  // Métadonnées
  createdAt?: string;
  updatedAt?: string;
}

export default function RendezvousManagerSimple() {
  const [rendezvous, setRendezvous] = useState<Rendezvous[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRdv, setSelectedRdv] = useState<Rendezvous | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [impactModalOpen, setImpactModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Rendezvous>>({});
  const [impactForm, setImpactForm] = useState({
    satisfactionImpact: 3,
    competencesAppliquees: '',
    ameliorationsSuggeres: '',
    commentairesImpact: '',
  });

  useEffect(() => {
    loadRendezvous();
  }, []);

  const loadRendezvous = async () => {
    try {
      const response = await fetch('/api/rendezvous');
      const data = await response.json();

      if (data.success && data.data) {
        setRendezvous(data.data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer ce rendez-vous ?')) return;

    try {
      const response = await fetch(`/api/rendezvous/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRendezvous(prev => prev.filter(rdv => rdv.id !== id));
        alert('Rendez-vous supprimé');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/rendezvous/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setRendezvous(prev => prev.map(rdv =>
          rdv.id === id ? { ...rdv, status: newStatus } : rdv
        ));
        alert('Statut mis à jour');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    }
  };

  const openViewModal = (rdv: Rendezvous) => {
    setSelectedRdv(rdv);
    setViewModalOpen(true);
  };

  const openEditModal = (rdv: Rendezvous) => {
    setSelectedRdv(rdv);
    setEditForm(rdv);
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedRdv) return;

    try {
      const response = await fetch(`/api/rendezvous/${selectedRdv.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        setRendezvous(prev => prev.map(rdv =>
          rdv.id === selectedRdv.id ? { ...rdv, ...editForm } : rdv
        ));
        setEditModalOpen(false);
        alert('Rendez-vous modifié');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification');
    }
  };

  const openImpactModal = (rdv: Rendezvous) => {
    setSelectedRdv(rdv);
    setImpactForm({
      satisfactionImpact: 3,
      competencesAppliquees: '',
      ameliorationsSuggeres: '',
      commentairesImpact: '',
    });
    setImpactModalOpen(true);
  };

  const handleCreateImpact = async () => {
    if (!selectedRdv) return;

    try {
      const response = await fetch('/api/rendezvous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'impact',
          status: 'nouveau',
          prenom: selectedRdv.prenom,
          nom: selectedRdv.nom,
          email: selectedRdv.email,
          telephone: selectedRdv.telephone,
          formationTitre: selectedRdv.formationTitre,
          formationSelectionnee: selectedRdv.formationSelectionnee,
          dateImpact: new Date().toISOString(),
          satisfactionImpact: impactForm.satisfactionImpact,
          competencesAppliquees: impactForm.competencesAppliquees,
          ameliorationsSuggeres: impactForm.ameliorationsSuggeres,
          commentairesImpact: impactForm.commentairesImpact,
          rendezvousParentId: selectedRdv.id,
        }),
      });

      if (response.ok) {
        await loadRendezvous();
        setImpactModalOpen(false);
        alert('Rendez-vous d\'impact créé avec succès');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du rendez-vous d\'impact');
    }
  };

  const handleGeneratePDF = async (rdvId: string, rdvNom: string, rdvPrenom: string) => {
    try {
      const response = await fetch(`/api/rendezvous/${rdvId}/generer-pdf`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Compte-Rendu-${rdvPrenom}-${rdvNom}-${new Date().toISOString().split('T')[0]}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        alert('PDF généré avec succès');
      } else {
        alert('Erreur lors de la génération du PDF');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la génération du PDF');
    }
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Rendez-vous</h1>
        <p className="text-gray-600 mt-1">Total : {rendezvous.length} rendez-vous</p>
      </div>

      <div className="space-y-4">
        {rendezvous.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
            </CardContent>
          </Card>
        ) : (
          rendezvous.map((rdv) => (
            <Card key={rdv.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <User className="h-5 w-5 text-gray-600" />
                      <span className="font-semibold text-lg text-gray-900">
                        {rdv.prenom} {rdv.nom}
                      </span>
                      <Badge className={
                        rdv.status === 'nouveau' ? 'bg-blue-100 text-blue-800' :
                        rdv.status === 'planifie' ? 'bg-yellow-100 text-yellow-800' :
                        rdv.status === 'confirme' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {rdv.status}
                      </Badge>
                      <Badge variant="outline" className={
                        rdv.type === 'positionnement' ? 'bg-blue-50 text-blue-700' :
                        'bg-purple-50 text-purple-700'
                      }>
                        {rdv.type}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          <span>{new Date(rdv.dateRdv).toLocaleDateString('fr-FR')}</span>
                        </div>
                      )}
                    </div>

                    {rdv.commentaires && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700 line-clamp-2">{rdv.commentaires}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {rdv.status === 'nouveau' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(rdv.id, 'planifie')}
                      >
                        Planifier
                      </Button>
                    )}

                    {rdv.status === 'planifie' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(rdv.id, 'confirme')}
                      >
                        Confirmer
                      </Button>
                    )}

                    {rdv.status === 'confirme' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(rdv.id, 'termine')}
                      >
                        Terminer
                      </Button>
                    )}

                    {rdv.type === 'positionnement' && rdv.status === 'termine' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openImpactModal(rdv)}
                        className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                      >
                        <TrendingUp className="h-4 w-4 mr-1" />
                        Impact
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openViewModal(rdv)}
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(rdv)}
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleGeneratePDF(rdv.id, rdv.nom, rdv.prenom)}
                      title="Générer le compte-rendu PDF"
                    >
                      <FileText className="h-4 w-4 text-blue-600" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(rdv.id)}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal de visualisation */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Détails du rendez-vous</DialogTitle>
          </DialogHeader>
          {selectedRdv && (
            <div className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Prénom</Label>
                      <p className="text-gray-900">{selectedRdv.prenom}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Nom</Label>
                      <p className="text-gray-900">{selectedRdv.nom}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Email</Label>
                      <p className="text-gray-900">{selectedRdv.email}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Téléphone</Label>
                      <p className="text-gray-900">{selectedRdv.telephone || '-'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Type</Label>
                      <p className="text-gray-900">{selectedRdv.type}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-600">Statut</Label>
                      <p className="text-gray-900">{selectedRdv.status}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formation */}
              {(selectedRdv.formationTitre || selectedRdv.formationSelectionnee) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Formation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-900">{selectedRdv.formationTitre || selectedRdv.formationSelectionnee}</p>
                  </CardContent>
                </Card>
              )}

              {/* Dates */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Dates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedRdv.dateRdv && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Date RDV</Label>
                        <p className="text-gray-900">{new Date(selectedRdv.dateRdv).toLocaleString('fr-FR')}</p>
                      </div>
                    )}
                    {selectedRdv.dateContact && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Date Contact</Label>
                        <p className="text-gray-900">{new Date(selectedRdv.dateContact).toLocaleString('fr-FR')}</p>
                      </div>
                    )}
                    {selectedRdv.dateDebutSouhaitee && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Début souhaité</Label>
                        <p className="text-gray-900">{new Date(selectedRdv.dateDebutSouhaitee).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}
                    {selectedRdv.dateFinSouhaitee && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Fin souhaitée</Label>
                        <p className="text-gray-900">{new Date(selectedRdv.dateFinSouhaitee).toLocaleDateString('fr-FR')}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Objectifs et compétences */}
              {(selectedRdv.objectifs || selectedRdv.competencesActuelles || selectedRdv.competencesRecherchees || selectedRdv.niveau) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Objectifs et Compétences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedRdv.objectifs && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Objectifs</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.objectifs}</p>
                      </div>
                    )}
                    {selectedRdv.competencesActuelles && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Compétences actuelles</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.competencesActuelles}</p>
                      </div>
                    )}
                    {selectedRdv.competencesRecherchees && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Compétences recherchées</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.competencesRecherchees}</p>
                      </div>
                    )}
                    {selectedRdv.niveau && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Niveau</Label>
                        <p className="text-gray-900">{selectedRdv.niveau}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Situation et Attentes */}
              {(selectedRdv.situationActuelle || selectedRdv.attentes || selectedRdv.pratiqueActuelle) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Situation et Attentes</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedRdv.situationActuelle && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Situation actuelle</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.situationActuelle}</p>
                      </div>
                    )}
                    {selectedRdv.attentes && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Attentes</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.attentes}</p>
                      </div>
                    )}
                    {selectedRdv.pratiqueActuelle && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Pratique actuelle</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.pratiqueActuelle}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Entreprise */}
              {(selectedRdv.entreprise || selectedRdv.siret || selectedRdv.adresseEntreprise) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Entreprise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRdv.entreprise && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Nom</Label>
                          <p className="text-gray-900">{selectedRdv.entreprise}</p>
                        </div>
                      )}
                      {selectedRdv.siret && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">SIRET</Label>
                          <p className="text-gray-900">{selectedRdv.siret}</p>
                        </div>
                      )}
                      {selectedRdv.adresseEntreprise && (
                        <div className="col-span-2">
                          <Label className="text-sm font-semibold text-gray-600">Adresse</Label>
                          <p className="text-gray-900">{selectedRdv.adresseEntreprise}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Financement */}
              {selectedRdv.isFinancement && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Financement</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedRdv.typeFinancement && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Type</Label>
                          <p className="text-gray-900">{selectedRdv.typeFinancement}</p>
                        </div>
                      )}
                      {selectedRdv.organismeFinanceur && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-600">Organisme</Label>
                          <p className="text-gray-900">{selectedRdv.organismeFinanceur}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Handicap */}
              {selectedRdv.hasHandicap && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Handicap</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedRdv.detailsHandicap && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Détails</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.detailsHandicap}</p>
                      </div>
                    )}
                    {selectedRdv.besoinHandicap && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Besoins spécifiques</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.besoinHandicap}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Notes et commentaires */}
              {(selectedRdv.commentaires || selectedRdv.notes || selectedRdv.synthese) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Notes et Commentaires</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedRdv.commentaires && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Commentaires</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.commentaires}</p>
                      </div>
                    )}
                    {selectedRdv.notes && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Notes</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.notes}</p>
                      </div>
                    )}
                    {selectedRdv.synthese && (
                      <div>
                        <Label className="text-sm font-semibold text-gray-600">Synthèse</Label>
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedRdv.synthese}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier le rendez-vous</DialogTitle>
          </DialogHeader>
          {selectedRdv && (
            <div className="space-y-6">
              {/* Informations générales */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informations générales</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        value={editForm.prenom || ''}
                        onChange={(e) => setEditForm({...editForm, prenom: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="nom">Nom *</Label>
                      <Input
                        id="nom"
                        value={editForm.nom || ''}
                        onChange={(e) => setEditForm({...editForm, nom: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email || ''}
                        onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="telephone">Téléphone</Label>
                      <Input
                        id="telephone"
                        value={editForm.telephone || ''}
                        onChange={(e) => setEditForm({...editForm, telephone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        className="w-full border rounded-md p-2"
                        value={editForm.type || ''}
                        onChange={(e) => setEditForm({...editForm, type: e.target.value})}
                      >
                        <option value="positionnement">Positionnement</option>
                        <option value="impact">Impact</option>
                        <option value="suivi">Suivi</option>
                        <option value="information">Information</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="status">Statut</Label>
                      <select
                        id="status"
                        className="w-full border rounded-md p-2"
                        value={editForm.status || ''}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                      >
                        <option value="nouveau">Nouveau</option>
                        <option value="planifie">Planifié</option>
                        <option value="confirme">Confirmé</option>
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                        <option value="annule">Annulé</option>
                        <option value="reporte">Reporté</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formation */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Formation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="formationTitre">Titre de la formation</Label>
                    <Input
                      id="formationTitre"
                      value={editForm.formationTitre || ''}
                      onChange={(e) => setEditForm({...editForm, formationTitre: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Objectifs et Compétences */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Objectifs et Compétences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="objectifs">Objectifs</Label>
                    <Textarea
                      id="objectifs"
                      rows={3}
                      value={editForm.objectifs || ''}
                      onChange={(e) => setEditForm({...editForm, objectifs: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="competencesActuelles">Compétences actuelles</Label>
                    <Textarea
                      id="competencesActuelles"
                      rows={3}
                      value={editForm.competencesActuelles || ''}
                      onChange={(e) => setEditForm({...editForm, competencesActuelles: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="competencesRecherchees">Compétences recherchées</Label>
                    <Textarea
                      id="competencesRecherchees"
                      rows={3}
                      value={editForm.competencesRecherchees || ''}
                      onChange={(e) => setEditForm({...editForm, competencesRecherchees: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="niveau">Niveau</Label>
                      <select
                        id="niveau"
                        className="w-full border rounded-md p-2"
                        value={editForm.niveau || ''}
                        onChange={(e) => setEditForm({...editForm, niveau: e.target.value})}
                      >
                        <option value="">Sélectionner</option>
                        <option value="debutant">Débutant</option>
                        <option value="intermediaire">Intermédiaire</option>
                        <option value="avance">Avancé</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="formatSouhaite">Format souhaité</Label>
                      <Input
                        id="formatSouhaite"
                        value={editForm.formatSouhaite || ''}
                        onChange={(e) => setEditForm({...editForm, formatSouhaite: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Situation et Attentes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Situation et Attentes</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="situationActuelle">Situation actuelle</Label>
                    <Textarea
                      id="situationActuelle"
                      rows={3}
                      value={editForm.situationActuelle || ''}
                      onChange={(e) => setEditForm({...editForm, situationActuelle: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="attentes">Attentes</Label>
                    <Textarea
                      id="attentes"
                      rows={3}
                      value={editForm.attentes || ''}
                      onChange={(e) => setEditForm({...editForm, attentes: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="pratiqueActuelle">Pratique actuelle</Label>
                    <Textarea
                      id="pratiqueActuelle"
                      rows={3}
                      value={editForm.pratiqueActuelle || ''}
                      onChange={(e) => setEditForm({...editForm, pratiqueActuelle: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Entreprise */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Entreprise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="entreprise">Nom de l'entreprise</Label>
                      <Input
                        id="entreprise"
                        value={editForm.entreprise || ''}
                        onChange={(e) => setEditForm({...editForm, entreprise: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="siret">SIRET</Label>
                      <Input
                        id="siret"
                        value={editForm.siret || ''}
                        onChange={(e) => setEditForm({...editForm, siret: e.target.value})}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label htmlFor="adresseEntreprise">Adresse</Label>
                      <Input
                        id="adresseEntreprise"
                        value={editForm.adresseEntreprise || ''}
                        onChange={(e) => setEditForm({...editForm, adresseEntreprise: e.target.value})}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes et Commentaires */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes et Commentaires</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="commentaires">Commentaires</Label>
                    <Textarea
                      id="commentaires"
                      rows={4}
                      value={editForm.commentaires || ''}
                      onChange={(e) => setEditForm({...editForm, commentaires: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes">Notes internes</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={editForm.notes || ''}
                      onChange={(e) => setEditForm({...editForm, notes: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="synthese">Synthèse</Label>
                    <Textarea
                      id="synthese"
                      rows={3}
                      value={editForm.synthese || ''}
                      onChange={(e) => setEditForm({...editForm, synthese: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de création de rendez-vous d'impact */}
      <Dialog open={impactModalOpen} onOpenChange={setImpactModalOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Créer un rendez-vous d'évaluation d'impact
            </DialogTitle>
          </DialogHeader>
          {selectedRdv && (
            <div className="space-y-6">
              {/* Informations du RDV parent */}
              <Card className="bg-purple-50 border-purple-200">
                <CardHeader>
                  <CardTitle className="text-base text-purple-900">
                    Formation de positionnement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <Label className="text-purple-700">Participant</Label>
                      <p className="text-purple-900 font-medium">
                        {selectedRdv.prenom} {selectedRdv.nom}
                      </p>
                    </div>
                    <div>
                      <Label className="text-purple-700">Formation</Label>
                      <p className="text-purple-900 font-medium">
                        {selectedRdv.formationTitre || selectedRdv.formationSelectionnee || 'Non spécifiée'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Formulaire d'évaluation d'impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Évaluation d'impact (6 mois après la formation)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="satisfactionImpact">
                      Niveau de satisfaction global (1-5)
                    </Label>
                    <div className="flex items-center gap-4 mt-2">
                      <input
                        type="range"
                        id="satisfactionImpact"
                        min="1"
                        max="5"
                        value={impactForm.satisfactionImpact}
                        onChange={(e) => setImpactForm({
                          ...impactForm,
                          satisfactionImpact: parseInt(e.target.value)
                        })}
                        className="flex-1"
                      />
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setImpactForm({
                              ...impactForm,
                              satisfactionImpact: star
                            })}
                            className={`text-2xl ${
                              star <= impactForm.satisfactionImpact
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <span className="text-lg font-semibold text-purple-600 min-w-[3ch]">
                        {impactForm.satisfactionImpact}/5
                      </span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="competencesAppliquees">
                      Compétences appliquées en situation professionnelle
                    </Label>
                    <Textarea
                      id="competencesAppliquees"
                      rows={4}
                      value={impactForm.competencesAppliquees}
                      onChange={(e) => setImpactForm({
                        ...impactForm,
                        competencesAppliquees: e.target.value
                      })}
                      placeholder="Décrivez comment vous avez pu mettre en pratique les compétences acquises..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="ameliorationsSuggeres">
                      Améliorations suggérées pour la formation
                    </Label>
                    <Textarea
                      id="ameliorationsSuggeres"
                      rows={4}
                      value={impactForm.ameliorationsSuggeres}
                      onChange={(e) => setImpactForm({
                        ...impactForm,
                        ameliorationsSuggeres: e.target.value
                      })}
                      placeholder="Vos suggestions d'amélioration..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="commentairesImpact">
                      Commentaires additionnels
                    </Label>
                    <Textarea
                      id="commentairesImpact"
                      rows={3}
                      value={impactForm.commentairesImpact}
                      onChange={(e) => setImpactForm({
                        ...impactForm,
                        commentairesImpact: e.target.value
                      })}
                      placeholder="Autres commentaires sur l'impact de la formation..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImpactModalOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleCreateImpact} className="bg-purple-600 hover:bg-purple-700">
              <TrendingUp className="h-4 w-4 mr-2" />
              Créer le rendez-vous d'impact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}