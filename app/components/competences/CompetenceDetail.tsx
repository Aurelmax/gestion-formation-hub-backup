
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Edit, Trash2, ExternalLink, FileText } from "lucide-react";
import { Competence, CategorieCompetence, StatutCompetence } from "@/types/competence";

interface CompetenceDetailProps {
  competence: Competence;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
}

const CompetenceDetail = ({ competence, onEdit, onDelete, onBack }: CompetenceDetailProps) => {
  const getCategorieColor = (categorie: CategorieCompetence) => {
    const colors = {
      'technique': 'bg-blue-100 text-blue-800',
      'pedagogique': 'bg-green-100 text-green-800',
      'relationnelle': 'bg-purple-100 text-purple-800',
      'organisationnelle': 'bg-orange-100 text-orange-800'
    };
    return colors[categorie];
  };

  const getStatutColor = (statut: StatutCompetence) => {
    const colors = {
      'planifie': 'bg-gray-100 text-gray-800',
      'en-cours': 'bg-yellow-100 text-yellow-800',
      'realise': 'bg-green-100 text-green-800',
      'reporte': 'bg-red-100 text-red-800'
    };
    return colors[statut];
  };

  const getNiveauLabel = (niveau: number) => {
    const labels = {
      1: "Débutant",
      2: "Élémentaire", 
      3: "Intermédiaire",
      4: "Avancé",
      5: "Expert"
    };
    return labels[niveau as keyof typeof labels] || "Non défini";
  };

  const progressPercentage = (competence.niveauActuel / competence.objectifNiveau) * 100;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h2 className="text-2xl font-bold">{competence.nom}</h2>
            <p className="text-gray-600">Détails de la compétence</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations générales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Badge className={getCategorieColor(competence.categorie)}>
                  {competence.categorie.charAt(0).toUpperCase() + competence.categorie.slice(1)}
                </Badge>
                <Badge className={getStatutColor(competence.statut)}>
                  {competence.statut.charAt(0).toUpperCase() + competence.statut.slice(1)}
                </Badge>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{competence.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Domaine de développement</h4>
                <p className="text-gray-600">{competence.domaineDeveloppement}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plan d'action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Actions prévues</h4>
                <p className="text-gray-600">{competence.actionPrevue}</p>
              </div>
              
              {competence.plateformeFomation && (
                <div>
                  <h4 className="font-medium mb-2">Plateforme de formation</h4>
                  <p className="text-gray-600">{competence.plateformeFomation}</p>
                </div>
              )}
              
              {competence.lienFormation && (
                <div>
                  <h4 className="font-medium mb-2">Lien vers la formation</h4>
                  <a 
                    href={competence.lienFormation} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {competence.lienFormation}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preuves et documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-2">
                {competence.typePreuve === 'fichier' ? (
                  <FileText className="h-5 w-5 text-gray-500" />
                ) : (
                  <ExternalLink className="h-5 w-5 text-gray-500" />
                )}
                <span className="font-medium">
                  {competence.typePreuve === 'fichier' ? 'Fichier' : 'URL'}
                </span>
              </div>
              
              {competence.typePreuve === 'url' ? (
                <a 
                  href={competence.contenuPreuve} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 break-all"
                >
                  {competence.contenuPreuve}
                </a>
              ) : (
                <p className="text-gray-600">{competence.contenuPreuve}</p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Progression</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression vers l'objectif</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{competence.niveauActuel}</div>
                  <div className="text-sm text-gray-600">Niveau actuel</div>
                  <div className="text-xs text-gray-500">{getNiveauLabel(competence.niveauActuel)}</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{competence.objectifNiveau}</div>
                  <div className="text-sm text-gray-600">Objectif</div>
                  <div className="text-xs text-gray-500">{getNiveauLabel(competence.objectifNiveau)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="font-medium">Créée le :</span>
                <br />
                <span className="text-gray-600">{formatDate(competence.dateCreation)}</span>
              </div>
              <div>
                <span className="font-medium">Dernière modification :</span>
                <br />
                <span className="text-gray-600">{formatDate(competence.dateModification)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompetenceDetail;
