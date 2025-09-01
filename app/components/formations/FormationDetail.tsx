
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Users, Clock, Calendar, GitBranch, Euro, CreditCard, Accessibility, AlertTriangle } from "lucide-react";
import { generateFormationPDF } from "@/utils/pdfGenerator";

interface FormationDetailProps {
  formation: any;
  onBack: () => void;
  onGeneratePDF?: (formation: any) => void;
}

const FormationDetail = ({ formation, onBack, onGeneratePDF }: FormationDetailProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGeneratePDF = () => {
    if (onGeneratePDF) {
      onGeneratePDF(formation);
    } else {
      generateFormationPDF(formation);
    }
  };

  const mentionsLegales = [
    {
      title: "Code de la formation",
      content: formation.code,
      icon: FileText,
    },
    {
      title: "Prérequis",
      content: formation.prerequis,
      icon: Users,
    },
    {
      title: "Public concerné",
      content: formation.publicConcerne,
      icon: Users,
    },
    {
      title: "Durée",
      content: formation.duree,
      icon: Clock,
    },
    {
      title: "Horaires",
      content: formation.horaires,
      icon: Clock,
    },
    {
      title: "Objectifs pédagogiques",
      content: formation.objectifsPedagogiques,
      icon: FileText,
    },
    {
      title: "Modalités et délais d'accès",
      content: formation.modalitesAcces,
      icon: Calendar,
    },
    {
      title: "Tarif de la formation",
      content: formation.tarif,
      icon: Euro,
    },
    {
      title: "Modalités de règlement",
      content: formation.modalitesReglement,
      icon: CreditCard,
    },
    {
      title: "Contact organisme",
      content: formation.contactOrganisme,
      icon: Users,
    },
    {
      title: "Référent pédagogique",
      content: formation.referentPedagogique,
      icon: Users,
    },
    {
      title: "Référent qualité",
      content: formation.referentQualite,
      icon: Users,
    },
    {
      title: "Modalités techniques",
      content: formation.modalitesTechniques,
      icon: FileText,
    },
    {
      title: "Formateur",
      content: formation.formateur,
      icon: Users,
    },
    {
      title: "Ressources mises à disposition",
      content: formation.ressourcesDisposition,
      icon: FileText,
    },
    {
      title: "Modalités d'évaluation",
      content: formation.modalitesEvaluation,
      icon: FileText,
    },
    {
      title: "Sanction de la formation",
      content: formation.sanctionFormation,
      icon: FileText,
    },
    {
      title: "Niveau/certification",
      content: formation.niveauCertification,
      icon: FileText,
    },
    {
      title: "Délai d'acceptation",
      content: formation.delaiAcceptation,
      icon: Calendar,
    },
    {
      title: "Accessibilité handicapée",
      content: formation.accessibiliteHandicapee,
      icon: Accessibility,
    },
    {
      title: "Cessation anticipée ou abandon",
      content: formation.cessationAbandon,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold">{formation.code}</h2>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formation.duree}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Formation certifiée Qualiopi
            </Badge>
            <Badge variant="default" className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              {new Date(formation.dateModification).toLocaleDateString('fr-FR')}
            </Badge>
          </div>
        </div>
        <Button onClick={handleGeneratePDF} className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Générer PDF
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Objectifs pédagogiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {formation.objectifsPedagogiques}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Public concerné</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{formation.publicConcerne}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prérequis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{formation.prerequis}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modalités techniques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-line text-gray-700 leading-relaxed">
                {formation.modalitesTechniques}
              </div>
            </CardContent>
          </Card>

          {/* Section Mentions légales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600" />
                Mentions légales - Conformité Qualiopi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mentionsLegales.map((mention, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <mention.icon className="h-4 w-4 text-blue-600" />
                      <h4 className="font-semibold text-sm">{mention.title}</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {mention.content}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informations de conformité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Date de création</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {formatDate(formation.dateCreation)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Dernière modification</span>
                </div>
                <p className="text-sm text-gray-600 ml-6">
                  {formatDate(formation.dateModification)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">Version actuelle</span>
                </div>
                <div className="ml-6">
                  <Badge variant="default" className="text-sm">
                    v{formation.version}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {formation.pdfUrl && (
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Télécharger le programme PDF
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FormationDetail;
