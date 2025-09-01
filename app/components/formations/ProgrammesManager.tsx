import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProgrammeListEnhanced from './ProgrammeListEnhanced';
import ProgrammeFormEnhanced from './ProgrammeFormEnhanced';
import { ProgrammeFormation } from '@/hooks/useProgrammesFormation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen, FileSpreadsheet, FileUp } from 'lucide-react';
import ImportProgrammesHtml from '../admin/ImportProgrammesHtml';

// Composant pour visualiser les détails d'un programme spécifique
const ProgrammeDetails = ({ programme, onBack }: { programme: ProgrammeFormation; onBack: () => void }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">
          <span className="text-2xl mr-2">{programme.pictogramme || '📚'}</span>
          {programme.titre || "Programme sans titre"}
        </h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Code</h3>
              <p>{programme.code}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type</h3>
              <p>{programme.type === 'catalogue' ? 'Catalogue' : 'Sur-mesure'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
              <p>{programme.categorie?.titre || "Non catégorisé"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Version</h3>
              <p>{programme.version || '1.0'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Durée</h3>
              <p>{programme.duree}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Prix</h3>
              <p>{programme.prix} €</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="description" className="space-y-4">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="programme">Programme détaillé</TabsTrigger>
          <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
          <TabsTrigger value="modalites">Modalités</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {programme.description ? (
                  <p>{programme.description}</p>
                ) : (
                  <p className="text-gray-500 italic">Aucune description fournie</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public et prérequis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Public concerné</h3>
                  {programme.publicConcerne ? (
                    <p>{programme.publicConcerne}</p>
                  ) : (
                    <p className="text-gray-500 italic">Non spécifié</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Prérequis</h3>
                  {programme.prerequis ? (
                    <p>{programme.prerequis}</p>
                  ) : (
                    <p className="text-gray-500 italic">Aucun prérequis</p>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Niveau</h3>
                  <p>{programme.niveau || "Non spécifié"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programme" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Programme détaillé</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {programme.programme || programme.contenuDetailleJours ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{programme.programme || programme.contenuDetailleJours}</div>
                ) : (
                  <p className="text-gray-500 italic">Le contenu du programme n'est pas disponible</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="objectifs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs pédagogiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {programme.objectifs ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{Array.isArray(programme.objectifs) ? programme.objectifs.join('\n\n') : programme.objectifs}</div>
                ) : (
                  <p className="text-gray-500 italic">Les objectifs pédagogiques ne sont pas définis</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Objectifs spécifiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {programme.objectifsSpecifiques ? (
                  <div style={{ whiteSpace: 'pre-wrap' }}>{programme.objectifsSpecifiques}</div>
                ) : (
                  <p className="text-gray-500 italic">Les objectifs spécifiques ne sont pas définis</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modalites" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Modalités d'organisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {programme.modalites ? (
                  <p>{programme.modalites}</p>
                ) : (
                  <p className="text-gray-500 italic">Les modalités d'organisation ne sont pas spécifiées</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Moyens pédagogiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {programme.ressourcesDisposition ? (
                  <p>{programme.ressourcesDisposition}</p>
                ) : (
                  <p className="text-gray-500 italic">Les moyens pédagogiques ne sont pas spécifiés</p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modalités d'évaluation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {programme.modalitesEvaluation ? (
                  <p>{programme.modalitesEvaluation}</p>
                ) : (
                  <p className="text-gray-500 italic">Les modalités d'évaluation ne sont pas spécifiées</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Composant principal pour la gestion des programmes
export default function ProgrammesManager() {
  const [view, setView] = useState<'list' | 'create' | 'edit' | 'detail'>('list');
  const [selectedProgramme, setSelectedProgramme] = useState<ProgrammeFormation | null>(null);

  const handleCreateClick = () => {
    setSelectedProgramme(null);
    setView('create');
  };

  const handleEditClick = (programme: ProgrammeFormation) => {
    setSelectedProgramme(programme);
    setView('edit');
  };

  const handleViewClick = (programme: ProgrammeFormation) => {
    setSelectedProgramme(programme);
    setView('detail');
  };

  const handleSubmit = (data: any) => {
    // Implémenter la logique de soumission (déjà gérée dans les hooks)
    setView('list');
  };

  const handleBack = () => {
    setView('list');
    setSelectedProgramme(null);
  };

  // Rendu conditionnel selon la vue active
  if (view === 'create' || view === 'edit') {
    return (
      <ProgrammeFormEnhanced 
        programme={view === 'edit' ? selectedProgramme : null} 
        onSubmit={handleSubmit} 
        onCancel={handleBack} 
      />
    );
  }

  if (view === 'detail' && selectedProgramme) {
    return <ProgrammeDetails programme={selectedProgramme} onBack={handleBack} />;
  }

  // Vue liste par défaut
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Bibliothèque de programmes</h2>
          <p className="text-gray-600">Gestion centralisée des programmes catalogue et sur-mesure</p>
        </div>
      </div>

      <Tabs defaultValue="programmes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="programmes" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Bibliothèque de programmes
          </TabsTrigger>
          <TabsTrigger value="import" className="flex items-center gap-2">
            <FileUp className="h-4 w-4" />
            Import HTML
          </TabsTrigger>
          <TabsTrigger value="workflow" className="flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Workflow de formation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="programmes">
          <ProgrammeListEnhanced 
            onCreateClick={handleCreateClick} 
            onEditClick={handleEditClick} 
            onViewClick={handleViewClick} 
          />
        </TabsContent>
        
        <TabsContent value="import">
          <Card>
            <CardHeader>
              <CardTitle>Import de Templates HTML</CardTitle>
            </CardHeader>
            <CardContent>
              <ImportProgrammesHtml />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workflow">
          <Card>
            <CardHeader>
              <CardTitle>Workflow de formation</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Fonctionnalité à venir: gestion du workflow complet de formation depuis le positionnement jusqu'au dossier.</p>
              <p className="text-gray-600 mt-4">Cette interface permettra de:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-600">
                <li>Créer un programme sur-mesure à partir d'une demande de positionnement</li>
                <li>Suivre le workflow complet de création des dossiers</li>
                <li>Générer les documents administratifs associés</li>
                <li>Suivre les étapes du parcours de formation</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
