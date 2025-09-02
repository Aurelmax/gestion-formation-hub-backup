import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, CheckCircle, Globe, Laptop, Code, BookOpen, BarChart, Search, ShoppingBag, Lightbulb, Sparkles, Calendar, FileDown } from "lucide-react";
import { Formation } from "./types";
import FormationDetailsModal from "./FormationDetailsModal";

interface FormationCardProps {
  formation: Formation;
  onPositionnement: (titre: string) => void;
}

// Fonction pour déterminer l'icône à afficher en fonction de l'ID ou du titre de la formation
const getFormationIcon = (formation: Formation) => {
  const id = formation.id.toLowerCase();
  const titre = formation.titre.toLowerCase();
  
  if (id.includes('wp') || titre.includes('wordpress')) {
    return <Globe className="h-6 w-6 text-blue-600" />;
  } else if (id.includes('wc') || titre.includes('woocommerce') || titre.includes('e-commerce')) {
    return <ShoppingBag className="h-6 w-6 text-purple-600" />;
  } else if (id.includes('seo') || titre.includes('référencement')) {
    return <Search className="h-6 w-6 text-green-600" />;
  } else if (id.includes('marketing') || titre.includes('marketing')) {
    return <BarChart className="h-6 w-6 text-orange-600" />;
  } else if (id.includes('dev') || titre.includes('développement')) {
    return <Code className="h-6 w-6 text-gray-700" />;
  } else if (titre.includes('stratégie') || titre.includes('inbound')) {
    return <Lightbulb className="h-6 w-6 text-yellow-600" />;
  } else if (titre.includes('avancé')) {
    return <Sparkles className="h-6 w-6 text-purple-500" />;
  }
  
  // Icône par défaut
  return <BookOpen className="h-6 w-6 text-blue-500" />;
};

const FormationCard = ({ formation, onPositionnement }: FormationCardProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const router = useRouter();

  const handlePositionnementClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPositionnement(formation.titre);
  };

  const handleDetailsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setModalOpen(true);
  };

  return (
    <>
      <FormationDetailsModal 
        formation={formation}
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onPositionnement={() => {
          setModalOpen(false);
          onPositionnement(formation.titre);
        }}
      />
      <Card className="hover:shadow-lg transition-all duration-300 flex flex-col border-t-4 border-primary overflow-hidden h-full">
        {/* En-tête avec style "STARTER PACK" */}
        <div className="bg-yellow-500 text-xs font-bold uppercase tracking-wider text-white py-1 px-3 text-center flex items-center justify-center gap-2">
          <Sparkles className="h-3 w-3" />
          STARTER PACK
        </div>
        
        <CardHeader className="py-3 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-blue-700 mb-1">Réf: {formation.id}</span>
              <CardTitle className="text-base font-bold text-blue-900 uppercase pr-8">{formation.titre}</CardTitle>
            </div>
            <div className="absolute top-3 right-4 bg-white rounded-full p-1 shadow-sm">
              {getFormationIcon(formation)}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0 pb-4 flex flex-col flex-grow">
          {/* Niveau et badges */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="outline" className="text-xs bg-blue-50">{formation.niveau}</Badge>
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700">Éligible FAF et OPCO</Badge>
          </div>

          <div className="mt-auto">
            {/* Prix */}
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-xs text-gray-500">À partir de</span>
                <p className="text-xl font-bold text-primary">
                  {formation.prix}
                </p>
                <span className="text-xs text-gray-500">Net de taxes</span>
              </div>
            </div>
            
            {/* Boutons */}
            <div className="mt-4 flex flex-col space-y-2">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handlePositionnementClick}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Réserver un RDV de positionnement
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-blue-200 hover:bg-blue-50"
                onClick={handleDetailsClick}
              >
                <FileDown className="h-4 w-4 mr-2" />
                Voir le détail et télécharger
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default FormationCard;
