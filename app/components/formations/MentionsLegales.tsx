
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info, Users, Clock, Euro, CreditCard, Accessibility, FileCheck, AlertTriangle } from "lucide-react";

const MentionsLegales = () => {
  const mentionsData = [
    {
      title: "Prérequis",
      content: "Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur.",
      icon: Info,
    },
    {
      title: "Public concerné",
      content: "Artisans, commerçants ou professions libérales.",
      icon: Users,
    },
    {
      title: "Durée et horaires de la formation",
      content: "14 heures ou 2 jours (9h à 13h et de 14h à 17h)",
      icon: Clock,
    },
    {
      title: "Modalités, délais moyens d'accès",
      content: "À réception de votre accord de prise en charge pour les professionnels.",
      icon: FileCheck,
    },
    {
      title: "Tarif de la formation",
      content: "980€ Nets de taxes Art-293 du CGI",
      icon: Euro,
    },
    {
      title: "Modalités de règlement",
      content: "Chèque ou virement à réception de facture",
      icon: CreditCard,
    },
    {
      title: "Accessibilité handicapée",
      content: "Démarche complète : entretien téléphonique, évaluation des besoins, mise en œuvre d'adaptations",
      icon: Accessibility,
    },
    {
      title: "Modalités d'évaluation",
      content: "Quiz via EVALBOX, grille d'analyse des compétences, travaux pratiques",
      icon: FileCheck,
    },
    {
      title: "Sanction de la formation",
      content: "Un certificat de réalisation de formation + feuille d'émargement",
      icon: FileCheck,
    },
    {
      title: "Cessation anticipée ou abandon",
      content: "Clause claire : non-facturation si abandon avant le début, facturation au prorata en cours de formation",
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Info className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold">Mentions légales - Formations</h3>
        <Badge variant="secondary">Conformité Qualiopi</Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mentionsData.map((mention, index) => (
          <Card key={index} className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <mention.icon className="h-4 w-4 text-blue-600" />
                {mention.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 leading-relaxed">
                {mention.content}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MentionsLegales;
