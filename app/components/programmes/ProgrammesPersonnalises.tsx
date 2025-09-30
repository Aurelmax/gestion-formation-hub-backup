'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { FilePlus } from 'lucide-react';
import api from '@/services/api';
import { ApiResponse, ProgrammePersonnalise, TypeProgramme, StatutProgramme, VariantCard } from './types';
import { ProgrammeCard } from './ProgrammeCard';

export default function ProgrammesPersonnalises() {
  const [programmes, setProgrammes] = useState<ProgrammePersonnalise[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tous');
  const { toast } = useToast();

  const fetchProgrammes = async (statut?: string) => {
    try {
      setLoading(true);
      const endpoint = statut && statut !== 'tous'
        ? `/api/programmes-personnalises?statut=${statut}`
        : '/api/programmes-personnalises';

      const response = await api.get<ApiResponse<ProgrammePersonnalise[]>>(endpoint);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setProgrammes(response.data.data);
      } else if (Array.isArray(response.data)) {
        // Fallback pour compatibilité avec d'autres APIs
        setProgrammes(response.data);
      } else {
        console.warn('Format de réponse inattendu:', response.data);
        setProgrammes([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des programmes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les programmes personnalisés.',
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
        type: TypeProgramme.SUR_MESURE,
        modules: [
          {
            id: 'm1',
            titre: 'Introduction à WordPress',
            description: 'Bases et fondamentaux',
            duree: '3 heures',
            ordre: 1,
            objectifs: ['Comprendre l\'architecture', 'Installer WordPress'],
            prerequis: ['Connaissances web basiques'],
            contenu: ['Installation', 'Configuration initiale', 'Tableau de bord']
          },
          {
            id: 'm2',
            titre: 'Personnalisation avancée',
            description: 'Thèmes et templates',
            duree: '7 heures',
            ordre: 2,
            objectifs: ['Créer des thèmes personnalisés', 'Maîtriser les templates'],
            prerequis: ['Bases HTML/CSS'],
            contenu: ['Structure des thèmes', 'Hiérarchie des templates', 'Hooks et filtres']
          }
        ],
        rendezvousId: '101',
        beneficiaire: 'Jean Dupont',
        dateCreation: '2023-08-16T10:30:00Z',
        statut: StatutProgramme.BROUILLON,
        estValide: false
      },
      {
        id: '2',
        titre: 'Formation SEO pour webmarketing - Marie Martin',
        description: 'Programme personnalisé suite au rendez-vous d\'évaluation',
        type: TypeProgramme.SUR_MESURE,
        modules: [
          {
            id: 'm1',
            titre: 'Fondamentaux du SEO',
            description: 'Les bases du référencement',
            duree: '4 heures',
            ordre: 1,
            objectifs: ['Comprendre les algorithmes', 'Optimiser le contenu'],
            prerequis: ['Aucun'],
            contenu: ['Fonctionnement des moteurs', 'Mots-clés', 'Structure de site']
          }
        ],
        rendezvousId: '102',
        beneficiaire: 'Marie Martin',
        dateCreation: '2023-08-18T14:45:00Z',
        statut: StatutProgramme.VALIDE,
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
      });
    }
  };

  const handleGenerateDocument = async (programmeId: string) => {
    try {
      const response = await api.post<{ url: string }>(`/api/programmes-personnalises/${programmeId}/generer-document`);
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
      });
    }
  };

  const handleCreateProgramme = () => {
    // Pour l'instant, on affiche un toast informatif
    // En production, ceci devrait ouvrir un modal ou rediriger vers une page de création
    toast({
      title: 'Nouveau programme',
      description: 'Fonctionnalité de création en cours de développement.',
    });

    // Optionnel: redirection vers une page de création
    // window.location.href = '/dashboard/programmes/nouveau';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight">Programmes personnalisés</h2>
        <Button onClick={() => handleCreateProgramme()}>
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
          ) : !Array.isArray(programmes) || programmes.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">Aucun programme trouvé.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {programmes.map(programme => (
                <ProgrammeCard
                  key={programme.id}
                  programme={programme}
                  variant={VariantCard.SUR_MESURE}
                  actions={{
                    onValidate: handleValidateProgramme,
                    onGenerateDocument: handleGenerateDocument,
                    onDelete: handleDeleteProgramme
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}