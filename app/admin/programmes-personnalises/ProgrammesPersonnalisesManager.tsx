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
  Users,
  BookOpen,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  History,
  Download,
  RefreshCw,
  Edit,
  FileText,
  Calendar,
  User,
  Target,
  BarChart3,
  Filter,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import ProgrammeCard from '@/components/programmes/ProgrammeCard';
import ProgrammeEditModal from '@/components/programmes/ProgrammeEditModal';
import { Programme, VariantCard } from '@/components/programmes/types';

interface ProgrammesPersonnalisesStats {
  totalProgrammes: number;
  programmesValides: number;
  programmesEnCours: number;
  beneficiairesUniques: number;
  derniereMiseAJour: string;
}

interface ModificationLog {
  id: string;
  programmeId: string;
  programmeTitre: string;
  action: 'VALIDE' | 'INVALIDE' | 'MODIFICATION' | 'CREATION';
  utilisateur: string;
  dateModification: string;
  ancienneValeur: boolean;
  nouvelleValeur: boolean;
}

export default function ProgrammesPersonnalisesManager() {
  const { toast } = useToast();
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [stats, setStats] = useState<ProgrammesPersonnalisesStats | null>(null);
  const [modificationLogs, setModificationLogs] = useState<ModificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statutFilter, setStatutFilter] = useState<string>('all');
  const [beneficiaireFilter, setBeneficiaireFilter] = useState<string>('all');
  const [showHistory, setShowHistory] = useState(false);
  const [editingProgramme, setEditingProgramme] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const router = useRouter();

  const handleEditProgramme = (programme: any) => {
    setEditingProgramme(programme);
    setShowEditModal(true);
  };

  const handleSaveProgramme = async (id: string, data: any) => {
    try {
      const response = await fetch(`/api/programmes-personnalises/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour');
      }

      // Log de modification pour l'audit
      const newLog = {
        id: Date.now().toString(),
        programmeId: id,
        programmeTitre: data.titre || 'Programme modifié',
        action: 'MODIFICATION' as any,
        utilisateur: 'Administrateur',
        dateModification: new Date().toISOString(),
        ancienneValeur: true,
        nouvelleValeur: true
      };
      setModificationLogs(prev => [newLog, ...prev]);

      // Actualiser la liste
      await fetchProgrammesData();

      setShowEditModal(false);
      setEditingProgramme(null);

      toast({
        title: "Succès",
        description: "Programme personnalisé modifié avec succès",
      });
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      throw error;
    }
  };

  const fetchProgrammesData = async () => {
    try {
      setLoading(true);

      // Récupérer tous les programmes personnalisés
      const params = new URLSearchParams({
        type: 'sur-mesure',
        includeInactive: 'true',
        ...(beneficiaireFilter !== 'all' && { beneficiaire: beneficiaireFilter }),
      });

      const response = await fetch(`/api/programmes-formation?${params}`);
      const programmesData = await response.json();

      if (programmesData.data) {
        const programmesFormatted = programmesData.data.map((prog: any) => ({
          id: prog.id,
          code: prog.code,
          titre: prog.titre,
          description: prog.description,
          type: prog.type || 'sur-mesure',
          dateCreation: prog.dateCreation,
          dateModification: prog.dateModification,
          statut: prog.statut || 'brouillon',
          estActif: prog.estActif,
          estVisible: prog.estVisible,
          beneficiaire: prog.beneficiaireId,
          rendezvousId: prog.positionnementRequestId,
          duree: prog.duree,
          prix: prog.prix,
          niveau: prog.niveau,
          participants: prog.participants,
          objectifs: prog.objectifs,
          prerequis: prog.prerequis,
          publicConcerne: prog.publicConcerne,
          contenuDetailleJours: prog.contenuDetailleJours,
          modalites: prog.modalites,
          modalitesAcces: prog.modalitesAcces,
          modalitesTechniques: prog.modalitesTechniques,
          delaiAcces: prog.delaiAcces,
          modalitesReglement: prog.modalitesReglement,
          contactOrganisme: prog.contactOrganisme,
          referentPedagogique: prog.referentPedagogique,
          referentQualite: prog.referentQualite,
          formateur: prog.formateur,
          ressourcesDisposition: prog.ressourcesDisposition,
          modalitesEvaluation: prog.modalitesEvaluation,
          sanctionFormation: prog.sanctionFormation,
          niveauCertification: prog.niveauCertification,
          delaiAcceptation: prog.delaiAcceptation,
          accessibiliteHandicap: prog.accessibiliteHandicap,
          cessationAbandon: prog.cessationAbandon,
          horaires: prog.horaires,
          evaluationSur: prog.evaluationSur,
          ressourcesAssociees: prog.ressourcesAssociees,
          objectifsSpecifiques: prog.objectifsSpecifiques
        }));

        setProgrammes(programmesFormatted);

        // Calculer les statistiques
        const statsCalculated = {
          totalProgrammes: programmesFormatted.length,
          programmesValides: programmesFormatted.filter((p: any) => p.statut === 'valide').length,
          programmesEnCours: programmesFormatted.filter((p: any) => p.statut === 'en-cours').length,
          beneficiairesUniques: new Set(programmesFormatted.map((p: any) => p.beneficiaire).filter(Boolean)).size,
          derniereMiseAJour: new Date().toISOString()
        };
        setStats(statsCalculated);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les programmes personnalisés",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammesData();
  }, [beneficiaireFilter]);

  const handleToggleValidity = async (programmeId: string, currentValidity: boolean, programmeTitre: string) => {
    try {
      const response = await fetch(`/api/programmes-personnalises/${programmeId}/valider`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estValide: !currentValidity })
      });

      if (!response.ok) throw new Error('Erreur lors de la validation');

      // Log pour l'audit
      const newLog = {
        id: Date.now().toString(),
        programmeId,
        programmeTitre,
        action: (!currentValidity ? 'VALIDE' : 'INVALIDE') as any,
        utilisateur: 'Administrateur',
        dateModification: new Date().toISOString(),
        ancienneValeur: currentValidity,
        nouvelleValeur: !currentValidity
      };
      setModificationLogs(prev => [newLog, ...prev]);

      await fetchProgrammesData();

      toast({
        title: "Succès",
        description: `Programme ${!currentValidity ? 'validé' : 'invalidé'} avec succès`,
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification du statut",
        variant: "destructive",
      });
    }
  };

  const handleGenerateDocument = async (programmeId: string, programmeTitre: string) => {
    try {
      const response = await fetch(`/api/programmes-personnalises/${programmeId}/generer-document`, {
        method: 'POST'
      });

      if (!response.ok) throw new Error('Erreur lors de la génération');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `programme-${programmeTitre.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Succès",
        description: "Document généré et téléchargé avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Erreur lors de la génération du document",
        variant: "destructive",
      });
    }
  };

  const exportAuditLog = () => {
    const csvContent = [
      ['Date', 'Action', 'Programme', 'Utilisateur', 'Ancienne Valeur', 'Nouvelle Valeur'].join(','),
      ...modificationLogs.map(log => [
        new Date(log.dateModification).toLocaleString('fr-FR'),
        log.action,
        log.programmeTitre,
        log.utilisateur,
        log.ancienneValeur.toString(),
        log.nouvelleValeur.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit-programmes-personnalises-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const filteredProgrammes = programmes.filter(programme => {
    const matchesSearch = programme.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         programme.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (programme.beneficiaire && programme.beneficiaire.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatut = statutFilter === 'all' || programme.statut === statutFilter;

    return matchesSearch && matchesStatut;
  });

  const beneficiaires = Array.from(new Set(programmes.map(p => p.beneficiaire).filter(Boolean)));

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Chargement des programmes personnalisés...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-4 mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Programmes Personnalisés</h2>
            <Button
              onClick={fetchProgrammesData}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Actualiser
            </Button>
          </div>

          {stats && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-2xl font-bold text-blue-900">{stats.totalProgrammes}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-900">{stats.programmesValides}</div>
                <div className="text-sm text-green-700">Validés</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-2xl font-bold text-orange-900">{stats.programmesEnCours}</div>
                <div className="text-sm text-orange-700">En cours</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-2xl font-bold text-purple-900">{stats.beneficiairesUniques}</div>
                <div className="text-sm text-purple-700">Bénéficiaires</div>
              </div>
            </div>
          )}
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
            onClick={() => router.push('/admin/positionnement')}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Nouveau programme
          </Button>
        </div>
      </div>

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
          </CardHeader>
          <CardContent>
            {modificationLogs.length === 0 ? (
              <p className="text-amber-600 text-center py-4">Aucune modification enregistrée</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {modificationLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex items-center gap-3">
                      <Badge variant={log.action === 'VALIDE' ? 'default' : log.action === 'INVALIDE' ? 'destructive' : 'secondary'}>
                        {log.action}
                      </Badge>
                      <span className="font-medium">{log.programmeTitre}</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(log.dateModification).toLocaleString('fr-FR')} - {log.utilisateur}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Rechercher par titre, description ou bénéficiaire..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select value={statutFilter} onValueChange={setStatutFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="brouillon">Brouillon</SelectItem>
            <SelectItem value="en-cours">En cours</SelectItem>
            <SelectItem value="valide">Validé</SelectItem>
            <SelectItem value="archive">Archivé</SelectItem>
          </SelectContent>
        </Select>

        <Select value={beneficiaireFilter} onValueChange={setBeneficiaireFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrer par bénéficiaire" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les bénéficiaires</SelectItem>
            {beneficiaires.map((beneficiaire) => (
              <SelectItem key={beneficiaire} value={beneficiaire || ''}>
                {beneficiaire}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Liste des programmes */}
      <div className="space-y-4">
        {filteredProgrammes.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg mb-2">Aucun programme personnalisé trouvé</p>
            <p className="text-gray-400 mb-4">Les programmes sont créés suite aux entretiens de positionnement</p>
            <Button onClick={() => router.push('/admin/positionnement')} className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Voir les positionnements
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProgrammes.map((programme) => (
              <div key={programme.id} className="border rounded-lg p-4 bg-white">
                <div className="flex gap-4 mb-4">
                  {programme.beneficiaire && (
                    <Badge variant="outline" className="text-blue-600 bg-blue-50">
                      <User className="h-3 w-3 mr-1" />
                      {programme.beneficiaire}
                    </Badge>
                  )}
                  {programme.statut && (
                    <Badge variant={
                      programme.statut === 'valide' ? 'default' :
                      programme.statut === 'en-cours' ? 'secondary' :
                      programme.statut === 'archive' ? 'outline' : 'destructive'
                    }>
                      {programme.statut}
                    </Badge>
                  )}
                  {programme.rendezvousId && (
                    <Badge variant="outline" className="text-green-600 bg-green-50">
                      <Calendar className="h-3 w-3 mr-1" />
                      RDV-{programme.rendezvousId}
                    </Badge>
                  )}
                </div>

                <ProgrammeCard
                  programme={programme}
                  variant={VariantCard.SUR_MESURE}
                  showActions={true}
                  actions={{
                    onView: () => router.push(`/admin/programmes/${programme.id}`),
                    onEdit: () => handleEditProgramme(programme),
                    onGenerateDocument: () => handleGenerateDocument(programme.id, programme.titre)
                  }}
                />

                {/* Actions spécialisées pour programmes personnalisés */}
                <div className="mt-3 space-y-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditProgramme(programme)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Button>
                    <Button
                      variant={programme.statut === 'valide' ? "destructive" : "default"}
                      size="sm"
                      onClick={() => handleToggleValidity(programme.id, programme.statut === 'valide', programme.titre)}
                      className="flex-1"
                    >
                      {programme.statut === 'valide' ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1" />
                          Invalider
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Valider
                        </>
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleGenerateDocument(programme.id, programme.titre)}
                    className="w-full"
                  >
                    <FileText className="h-4 w-4 mr-1" />
                    Générer le document de formation
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal d'édition */}
      <ProgrammeEditModal
        programme={editingProgramme}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingProgramme(null);
        }}
        onSave={handleSaveProgramme}
      />
    </div>
  );
}