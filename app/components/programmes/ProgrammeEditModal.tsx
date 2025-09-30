'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Save,
  X,
  CheckCircle,
  AlertTriangle,
  FileText,
  Users,
  Clock,
  Euro,
  Shield,
  BookOpen,
  Settings,
  Target,
  GraduationCap,
  Calendar,
  User,
  Phone,
  Mail
} from 'lucide-react';

interface ProgrammeFormData {
  id: string;
  code: string;
  titre: string;
  description: string;
  duree: string;
  prix: string;
  niveau: string;
  participants: string;
  objectifs: string[];
  objectifsSpecifiques?: string;
  prerequis: string;
  publicConcerne: string;
  contenuDetailleJours: string;
  evaluationSur?: string;
  horaires: string;
  modalites: string;
  modalitesAcces: string;
  modalitesTechniques: string;
  delaiAcces?: string;
  modalitesReglement: string;
  contactOrganisme: string;
  referentPedagogique: string;
  referentQualite: string;
  formateur: string;
  ressourcesDisposition: string;
  modalitesEvaluation: string;
  sanctionFormation: string;
  niveauCertification: string;
  delaiAcceptation: string;
  accessibiliteHandicap: string;
  cessationAbandon: string;
  ressourcesAssociees: string[];
  estActif: boolean;
  estVisible: boolean;
}

interface ProgrammeEditModalProps {
  programme: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, data: Partial<ProgrammeFormData>) => Promise<void>;
}

const ProgrammeEditModal = ({ programme, isOpen, onClose, onSave }: ProgrammeEditModalProps) => {
  const { toast } = useToast();
  const [loading, setSaving] = useState(false);
  const [formData, setFormData] = useState<ProgrammeFormData>({
    id: '',
    code: '',
    titre: '',
    description: '',
    duree: '',
    prix: '',
    niveau: '',
    participants: '',
    objectifs: [],
    objectifsSpecifiques: '',
    prerequis: '',
    publicConcerne: '',
    contenuDetailleJours: '',
    evaluationSur: '',
    horaires: '9h-12h30 et 14h-17h30',
    modalites: '',
    modalitesAcces: '',
    modalitesTechniques: '',
    delaiAcces: '',
    modalitesReglement: '',
    contactOrganisme: 'GestionMax - aurelien@gestionmax.fr - 06.46.02.24.68',
    referentPedagogique: 'Aurélien Lien - aurelien@gestionmax.fr',
    referentQualite: 'Aurélien Lien - aurelien@gestionmax.fr',
    formateur: '',
    ressourcesDisposition: '',
    modalitesEvaluation: '',
    sanctionFormation: '',
    niveauCertification: '',
    delaiAcceptation: '',
    accessibiliteHandicap: '',
    cessationAbandon: '',
    ressourcesAssociees: [],
    estActif: true,
    estVisible: true
  });

  const [newObjectif, setNewObjectif] = useState('');
  const [newRessource, setNewRessource] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (programme) {
      setFormData({
        id: programme.id || '',
        code: programme.code || '',
        titre: programme.titre || '',
        description: programme.description || '',
        duree: programme.duree || '',
        prix: programme.prix || '',
        niveau: programme.niveau || '',
        participants: programme.participants || '',
        objectifs: programme.objectifs || [],
        objectifsSpecifiques: programme.objectifsSpecifiques || '',
        prerequis: programme.prerequis || '',
        publicConcerne: programme.publicConcerne || '',
        contenuDetailleJours: programme.contenuDetailleJours || '',
        evaluationSur: programme.evaluationSur || '',
        horaires: programme.horaires || '9h-12h30 et 14h-17h30',
        modalites: programme.modalites || '',
        modalitesAcces: programme.modalitesAcces || '',
        modalitesTechniques: programme.modalitesTechniques || '',
        delaiAcces: programme.delaiAcces || '',
        modalitesReglement: programme.modalitesReglement || '',
        contactOrganisme: programme.contactOrganisme || 'GestionMax - aurelien@gestionmax.fr - 06.46.02.24.68',
        referentPedagogique: programme.referentPedagogique || 'Aurélien Lien - aurelien@gestionmax.fr',
        referentQualite: programme.referentQualite || 'Aurélien Lien - aurelien@gestionmax.fr',
        formateur: programme.formateur || '',
        ressourcesDisposition: programme.ressourcesDisposition || '',
        modalitesEvaluation: programme.modalitesEvaluation || '',
        sanctionFormation: programme.sanctionFormation || '',
        niveauCertification: programme.niveauCertification || '',
        delaiAcceptation: programme.delaiAcceptation || '',
        accessibiliteHandicap: programme.accessibiliteHandicap || '',
        cessationAbandon: programme.cessationAbandon || '',
        ressourcesAssociees: programme.ressourcesAssociees || [],
        estActif: programme.estActif ?? true,
        estVisible: programme.estVisible ?? true
      });
    }
  }, [programme]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(formData.id, formData);
      toast({
        title: "Succès",
        description: "Programme modifié avec succès",
      });
      onClose();
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du programme",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addObjectif = () => {
    if (newObjectif.trim()) {
      setFormData({
        ...formData,
        objectifs: [...formData.objectifs, newObjectif.trim()]
      });
      setNewObjectif('');
    }
  };

  const removeObjectif = (index: number) => {
    setFormData({
      ...formData,
      objectifs: formData.objectifs.filter((_, i) => i !== index)
    });
  };

  const addRessource = () => {
    if (newRessource.trim()) {
      setFormData({
        ...formData,
        ressourcesAssociees: [...formData.ressourcesAssociees, newRessource.trim()]
      });
      setNewRessource('');
    }
  };

  const removeRessource = (index: number) => {
    setFormData({
      ...formData,
      ressourcesAssociees: formData.ressourcesAssociees.filter((_, i) => i !== index)
    });
  };

  const getValidationStatus = () => {
    const requiredFields = [
      'titre', 'description', 'duree', 'prix', 'niveau', 'participants',
      'prerequis', 'publicConcerne', 'contenuDetailleJours', 'horaires',
      'modalites', 'modalitesAcces', 'modalitesTechniques', 'modalitesReglement',
      'formateur', 'ressourcesDisposition', 'modalitesEvaluation',
      'sanctionFormation', 'niveauCertification', 'delaiAcceptation',
      'accessibiliteHandicap', 'cessationAbandon'
    ];

    const completed = requiredFields.filter(field => formData[field as keyof ProgrammeFormData]).length;
    const total = requiredFields.length;
    const percentage = Math.round((completed / total) * 100);

    return { completed, total, percentage, isValid: percentage === 100 };
  };

  const validationStatus = getValidationStatus();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Modification du programme: {formData.titre}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {validationStatus.isValid ? (
                <Badge variant="outline" className="text-green-600 bg-green-50">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Conforme
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600 bg-orange-50">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {validationStatus.completed}/{validationStatus.total} champs
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[80vh]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Général
              </TabsTrigger>
              <TabsTrigger value="pedagogie" className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                Pédagogie
              </TabsTrigger>
              <TabsTrigger value="modalites" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Modalités
              </TabsTrigger>
              <TabsTrigger value="conformite" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Conformité
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Informations générales
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="code">Code programme *</Label>
                      <Input
                        id="code"
                        value={formData.code}
                        onChange={(e) => setFormData({...formData, code: e.target.value})}
                        placeholder="Ex: FORM-001"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Label>Statut de publication</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.estActif}
                            onCheckedChange={(checked) => setFormData({...formData, estActif: checked})}
                          />
                          <Label>Actif</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={formData.estVisible}
                            onCheckedChange={(checked) => setFormData({...formData, estVisible: checked})}
                          />
                          <Label>Visible</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="titre">Titre du programme *</Label>
                    <Input
                      id="titre"
                      value={formData.titre}
                      onChange={(e) => setFormData({...formData, titre: e.target.value})}
                      placeholder="Titre du programme de formation"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Description complète du programme"
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="duree">Durée *</Label>
                      <Input
                        id="duree"
                        value={formData.duree}
                        onChange={(e) => setFormData({...formData, duree: e.target.value})}
                        placeholder="Ex: 14h"
                      />
                    </div>
                    <div>
                      <Label htmlFor="prix">Prix *</Label>
                      <Input
                        id="prix"
                        value={formData.prix}
                        onChange={(e) => setFormData({...formData, prix: e.target.value})}
                        placeholder="Ex: 1200€"
                      />
                    </div>
                    <div>
                      <Label htmlFor="niveau">Niveau *</Label>
                      <Select value={formData.niveau} onValueChange={(value) => setFormData({...formData, niveau: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="debutant">Débutant</SelectItem>
                          <SelectItem value="intermediaire">Intermédiaire</SelectItem>
                          <SelectItem value="avance">Avancé</SelectItem>
                          <SelectItem value="expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="participants">Participants *</Label>
                      <Input
                        id="participants"
                        value={formData.participants}
                        onChange={(e) => setFormData({...formData, participants: e.target.value})}
                        placeholder="Ex: 1 à 6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="publicConcerne">Public concerné *</Label>
                    <Textarea
                      id="publicConcerne"
                      value={formData.publicConcerne}
                      onChange={(e) => setFormData({...formData, publicConcerne: e.target.value})}
                      placeholder="Description du public cible"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pedagogie" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Objectifs pédagogiques
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Objectifs généraux</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newObjectif}
                        onChange={(e) => setNewObjectif(e.target.value)}
                        placeholder="Ajouter un objectif"
                        onKeyPress={(e) => e.key === 'Enter' && addObjectif()}
                      />
                      <Button onClick={addObjectif} variant="outline">Ajouter</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.objectifs.map((objectif, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {objectif}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => removeObjectif(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="objectifsSpecifiques">Objectifs spécifiques</Label>
                    <Textarea
                      id="objectifsSpecifiques"
                      value={formData.objectifsSpecifiques}
                      onChange={(e) => setFormData({...formData, objectifsSpecifiques: e.target.value})}
                      placeholder="Objectifs spécifiques détaillés"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="prerequis">Prérequis *</Label>
                    <Textarea
                      id="prerequis"
                      value={formData.prerequis}
                      onChange={(e) => setFormData({...formData, prerequis: e.target.value})}
                      placeholder="Prérequis nécessaires pour suivre la formation"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="contenuDetailleJours">Contenu détaillé par jour *</Label>
                    <Textarea
                      id="contenuDetailleJours"
                      value={formData.contenuDetailleJours}
                      onChange={(e) => setFormData({...formData, contenuDetailleJours: e.target.value})}
                      placeholder="Programme détaillé jour par jour"
                      rows={6}
                    />
                  </div>

                  <div>
                    <Label htmlFor="ressourcesDisposition">Ressources mises à disposition *</Label>
                    <Textarea
                      id="ressourcesDisposition"
                      value={formData.ressourcesDisposition}
                      onChange={(e) => setFormData({...formData, ressourcesDisposition: e.target.value})}
                      placeholder="Supports, matériels, ressources pédagogiques"
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="modalites" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Modalités de formation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="horaires">Horaires *</Label>
                    <Input
                      id="horaires"
                      value={formData.horaires}
                      onChange={(e) => setFormData({...formData, horaires: e.target.value})}
                      placeholder="Ex: 9h-12h30 et 14h-17h30"
                    />
                  </div>

                  <div>
                    <Label htmlFor="modalites">Modalités pédagogiques *</Label>
                    <Textarea
                      id="modalites"
                      value={formData.modalites}
                      onChange={(e) => setFormData({...formData, modalites: e.target.value})}
                      placeholder="Présentiel, distanciel, mixte, méthodes pédagogiques"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="modalitesAcces">Modalités d'accès *</Label>
                    <Textarea
                      id="modalitesAcces"
                      value={formData.modalitesAcces}
                      onChange={(e) => setFormData({...formData, modalitesAcces: e.target.value})}
                      placeholder="Conditions d'accès, inscription, admission"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="modalitesTechniques">Modalités techniques *</Label>
                    <Textarea
                      id="modalitesTechniques"
                      value={formData.modalitesTechniques}
                      onChange={(e) => setFormData({...formData, modalitesTechniques: e.target.value})}
                      placeholder="Matériel technique, plateforme, équipements"
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="delaiAcces">Délai d'accès</Label>
                      <Input
                        id="delaiAcces"
                        value={formData.delaiAcces}
                        onChange={(e) => setFormData({...formData, delaiAcces: e.target.value})}
                        placeholder="Ex: 7 jours ouvrables"
                      />
                    </div>
                    <div>
                      <Label htmlFor="delaiAcceptation">Délai d'acceptation *</Label>
                      <Input
                        id="delaiAcceptation"
                        value={formData.delaiAcceptation}
                        onChange={(e) => setFormData({...formData, delaiAcceptation: e.target.value})}
                        placeholder="Ex: 7 jours ouvrables"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="modalitesReglement">Modalités de règlement *</Label>
                    <Textarea
                      id="modalitesReglement"
                      value={formData.modalitesReglement}
                      onChange={(e) => setFormData({...formData, modalitesReglement: e.target.value})}
                      placeholder="Conditions de paiement, modalités de financement"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="conformite" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Conformité réglementaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="formateur">Formateur *</Label>
                    <Textarea
                      id="formateur"
                      value={formData.formateur}
                      onChange={(e) => setFormData({...formData, formateur: e.target.value})}
                      placeholder="Qualification, expérience, expertise du formateur"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="modalitesEvaluation">Modalités d'évaluation *</Label>
                    <Textarea
                      id="modalitesEvaluation"
                      value={formData.modalitesEvaluation}
                      onChange={(e) => setFormData({...formData, modalitesEvaluation: e.target.value})}
                      placeholder="Évaluation des acquis, QCM, mise en pratique, etc."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sanctionFormation">Sanction de la formation *</Label>
                    <Textarea
                      id="sanctionFormation"
                      value={formData.sanctionFormation}
                      onChange={(e) => setFormData({...formData, sanctionFormation: e.target.value})}
                      placeholder="Attestation, certificat, validation des acquis"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor="niveauCertification">Niveau de certification *</Label>
                    <Input
                      id="niveauCertification"
                      value={formData.niveauCertification}
                      onChange={(e) => setFormData({...formData, niveauCertification: e.target.value})}
                      placeholder="Ex: Formation non certifiante, Niveau 3, etc."
                    />
                  </div>

                  <div>
                    <Label htmlFor="accessibiliteHandicap">Accessibilité handicap *</Label>
                    <Textarea
                      id="accessibiliteHandicap"
                      value={formData.accessibiliteHandicap}
                      onChange={(e) => setFormData({...formData, accessibiliteHandicap: e.target.value})}
                      placeholder="Adaptations possibles, contact référent handicap"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cessationAbandon">Conditions de cessation/abandon *</Label>
                    <Textarea
                      id="cessationAbandon"
                      value={formData.cessationAbandon}
                      onChange={(e) => setFormData({...formData, cessationAbandon: e.target.value})}
                      placeholder="Procédure en cas d'abandon, conditions de remboursement"
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="contactOrganisme">Contact organisme *</Label>
                      <Input
                        id="contactOrganisme"
                        value={formData.contactOrganisme}
                        onChange={(e) => setFormData({...formData, contactOrganisme: e.target.value})}
                        placeholder="GestionMax - email - téléphone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="referentPedagogique">Référent pédagogique *</Label>
                      <Input
                        id="referentPedagogique"
                        value={formData.referentPedagogique}
                        onChange={(e) => setFormData({...formData, referentPedagogique: e.target.value})}
                        placeholder="Nom - email du référent pédagogique"
                      />
                    </div>
                    <div>
                      <Label htmlFor="referentQualite">Référent qualité *</Label>
                      <Input
                        id="referentQualite"
                        value={formData.referentQualite}
                        onChange={(e) => setFormData({...formData, referentQualite: e.target.value})}
                        placeholder="Nom - email du référent qualité"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Ressources associées</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={newRessource}
                        onChange={(e) => setNewRessource(e.target.value)}
                        placeholder="Ajouter une ressource"
                        onKeyPress={(e) => e.key === 'Enter' && addRessource()}
                      />
                      <Button onClick={addRessource} variant="outline">Ajouter</Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.ressourcesAssociees.map((ressource, index) => (
                        <Badge key={index} variant="secondary" className="text-sm">
                          {ressource}
                          <X
                            className="h-3 w-3 ml-1 cursor-pointer"
                            onClick={() => removeRessource(index)}
                          />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-500">
            Conformité: {validationStatus.percentage}% ({validationStatus.completed}/{validationStatus.total} champs)
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Settings className="h-4 w-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgrammeEditModal;