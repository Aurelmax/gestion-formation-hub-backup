import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { FileEdit, FilePlus, Eye, Trash2, Calendar, Download, CheckSquare } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import api from '@/services/api';
import { ApiResponse } from '@/types';

interface ProgrammePersonnalise {
  id: string;
  titre: string;
  description: string;
  modules: Module[];
  rendezvousId: string;
  beneficiaire: string;
  dateCreation: string;
  statut: string;
  estValide: boolean;
  documentUrl?: string;
}

interface Module {
  id: string;
  titre: string;
  description: string;
  duree: number;
  objectifs: string[];
  prerequis: string[];
  contenu: string[];
}

interface ProgrammeDialogProps {
  programme: ProgrammePersonnalise | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProgrammesPersonnalises() {
  const [programmes, setProgrammes] = useState<ProgrammePersonnalise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tous');
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammePersonnalise | null>(null);
  const [showProgrammeDetails, setShowProgrammeDetails] = useState(false);
  const { toast } = useToast();

  const fetchProgrammes = async (statut?: string) => {
    try {
      setLoading(true);
      const endpoint = statut && statut !== 'tous' 
        ? `/api/programmes-personnalises?statut=${statut}` 
        : '/api/programmes-personnalises';
      
      const response = await api.get<ApiResponse<ProgrammePersonnalise[]>>(endpoint);
      
      if (Array.isArray(response.data)) {
        setProgrammes(response.data);
      } else if (response.data && typeof response.data === 'object') {
        setProgrammes(response.data as unknown as ProgrammePersonnalise[]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les programmes personnalisés.',
        variant: 'destructive',
      });
      // En mode démonstration, générer des données de test
      generateDemoData();
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = () => {
    const demoData: ProgrammePersonnalise[] = [
      {
        id: '1',
        titre: 'Formation WordPress avancée - Jean Dupont',
        description: 'Programme personnalisé pour le positionnement du 15/08/2023',
        modules: [
          {
            id: 'm1',
            titre: 'Introduction à WordPress',
            description: 'Bases et fondamentaux',
            duree: 3,
            objectifs: ['Comprendre l\'architecture', 'Installer WordPress'],
            prerequis: ['Connaissances web basiques'],
            contenu: ['Installation', 'Configuration initiale', 'Tableau de bord']
          },
          {
            id: 'm2',
            titre: 'Personnalisation avancée',
            description: 'Thèmes et templates',
            duree: 7,
            objectifs: ['Créer des thèmes personnalisés', 'Maîtriser les templates'],
            prerequis: ['Bases HTML/CSS'],
            contenu: ['Structure des thèmes', 'Hiérarchie des templates', 'Hooks et filtres']
          }
        ],
        rendezvousId: '101',
        beneficiaire: 'Jean Dupont',
        dateCreation: '2023-08-16T10:30:00Z',
        statut: 'brouillon',
        estValide: false
      },
      {
        id: '2',
        titre: 'Formation SEO pour webmarketing - Marie Martin',
        description: 'Programme personnalisé suite au rendez-vous d\'évaluation',
        modules: [
          {
            id: 'm1',
            titre: 'Fondamentaux du SEO',
            description: 'Les bases du référencement',
            duree: 4,
            objectifs: ['Comprendre les algorithmes', 'Optimiser le contenu'],
            prerequis: ['Aucun'],
            contenu: ['Fonctionnement des moteurs', 'Mots-clés', 'Structure de site']
          }
        ],
        rendezvousId: '102',
        beneficiaire: 'Marie Martin',
        dateCreation: '2023-08-18T14:45:00Z',
        statut: 'valide',
        estValide: true,
        documentUrl: '/documents/programme-2.pdf'
      }
    ];
    
    setProgrammes(demoData);
  };

  useEffect(() => {
    fetchProgrammes(activeTab === 'tous' ? undefined : activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    fetchProgrammes(value === 'tous' ? undefined : value);
  };

  const handleViewProgramme = (programme: ProgrammePersonnalise) => {
    setSelectedProgramme(programme);
    setShowProgrammeDetails(true);
  };

  const handleValidateProgramme = async (programmeId: string) => {
    try {
      await api.put<ApiResponse<ProgrammePersonnalise>>(`/api/programmes-personnalises/${programmeId}/valider`);
      toast({
        title: 'Programme validé',
        description: 'Le programme a été validé avec succès.',
      });
      fetchProgrammes(activeTab === 'tous' ? undefined : activeTab);
    } catch (error) {
      console.error('Erreur lors de la validation du programme:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de valider le programme.',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProgramme = async (programmeId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce programme ?')) {
      return;
    }

    try {
      await api.delete<ApiResponse<void>>(`/api/programmes-personnalises/${programmeId}`);
      toast({
        title: 'Programme supprimé',
        description: 'Le programme a été supprimé avec succès.',
      });
      fetchProgrammes(activeTab === 'tous' ? undefined : activeTab);
    } catch (error) {
      console.error('Erreur lors de la suppression du programme:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le programme.',
        variant: 'destructive',
      });
    }
  };

  const handleGenerateDocument = async (programmeId: string) => {
    try {
      const response = await api.post<{url: string}>(`/api/programmes-personnalises/${programmeId}/generer-document`);
      if (response.data && response.data.url) {
        window.open(response.data.url, '_blank');
        toast({
          title: 'Document généré',
          description: 'Le document a été généré avec succès.',
        });
        fetchProgrammes(activeTab === 'tous' ? undefined : activeTab);
      }
    } catch (error) {
      console.error('Erreur lors de la génération du document:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de générer le document.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'brouillon':
        return <Badge variant="outline">Brouillon</Badge>;
      case 'valide':
        return <Badge variant="default" className="bg-green-500">Validé</Badge>;
      case 'archive':
        return <Badge variant="secondary">Archivé</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const ProgrammeDetailsDialog = ({ programme, isOpen, onClose }: ProgrammeDialogProps) => {
    if (!programme) return null;

    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{programme.titre}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Créé le {format(new Date(programme.dateCreation), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                </p>
                <p className="text-sm">Bénéficiaire: <span className="font-medium">{programme.beneficiaire}</span></p>
              </div>
              <div>{getStatusBadge(programme.statut)}</div>
            </div>

            <div className="p-4 bg-muted/50 rounded-md">
              <h3 className="font-medium mb-2">Description</h3>
              <p>{programme.description}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Modules ({programme.modules.length})</h3>
              {programme.modules.map(module => (
                <Card key={module.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{module.titre}</CardTitle>
                      <Badge variant="outline">{module.duree}h</Badge>
                    </div>
                    <CardDescription>{module.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-1">Objectifs</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {module.objectifs.map((obj, idx) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Prérequis</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {module.prerequis.map((pre, idx) => (
                          <li key={idx}>{pre}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium mb-1">Contenu</h4>
                      <ul className="list-disc pl-5 text-sm space-y-1">
                        {module.contenu.map((cont, idx) => (
                          <li key={idx}>{cont}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={onClose}>
              Fermer
            </Button>
            {!programme.estValide && (
              <Button onClick={() => handleValidateProgramme(programme.id)}>
                <CheckSquare className="mr-2 h-4 w-4" />
                Valider le programme
              </Button>
            )}
            <Button onClick={() => handleGenerateDocument(programme.id)}>
              <Download className="mr-2 h-4 w-4" />
              Générer le document
            </Button>
            {programme.documentUrl && (
              <Button onClick={() => window.open(programme.documentUrl, '_blank')}>
                <Eye className="mr-2 h-4 w-4" />
                Voir le document
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Programmes personnalisés</h2>
        <Button>
          <FilePlus className="mr-2 h-4 w-4" />
          Nouveau programme
        </Button>
      </div>

      <Tabs defaultValue="tous" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="brouillon">Brouillons</TabsTrigger>
          <TabsTrigger value="valide">Validés</TabsTrigger>
          <TabsTrigger value="archive">Archivés</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center p-8">
              <p>Chargement des programmes...</p>
            </div>
          ) : programmes.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Aucun programme trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programmes.map(programme => (
                <Card key={programme.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{programme.titre}</CardTitle>
                      {getStatusBadge(programme.statut)}
                    </div>
                    <CardDescription>
                      {format(new Date(programme.dateCreation), 'dd MMMM yyyy', { locale: fr })}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <p className="mb-2 line-clamp-2">{programme.description}</p>
                    <p className="text-sm mb-4">
                      <span className="font-medium">Modules:</span> {programme.modules.length}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleViewProgramme(programme)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Détails
                      </Button>
                      
                      {!programme.estValide && (
                        <Button 
                          size="sm" 
                          onClick={() => handleValidateProgramme(programme.id)}
                        >
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Valider
                        </Button>
                      )}

                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleGenerateDocument(programme.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Document
                      </Button>

                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDeleteProgramme(programme.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <ProgrammeDetailsDialog 
        programme={selectedProgramme}
        isOpen={showProgrammeDetails}
        onClose={() => {
          setShowProgrammeDetails(false);
          setSelectedProgramme(null);
        }}
      />
    </div>
  );
}
