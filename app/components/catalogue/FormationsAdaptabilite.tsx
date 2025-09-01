import { Info } from "lucide-react";

const FormationsAdaptabilite = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-lg shadow-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0 mt-0.5">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Formations personnalisées</h3>
            <p className="text-blue-700">
              Les formations présentées dans ce catalogue sont conçues pour répondre aux besoins spécifiques des artisans, commerçants et très petites entreprises (TPE). 
              Elles constituent une base structurée, construite à partir de situations professionnelles courantes.
            </p>
            <p className="text-blue-700 mt-3">
              Toutefois, chaque module peut être entièrement adapté en fonction des résultats du rendez-vous de positionnement initial, 
              afin de tenir compte de vos objectifs, contraintes et compétences déjà acquises. Cette phase d'analyse garantit la pertinence 
              du parcours proposé et son alignement avec vos besoins réels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormationsAdaptabilite;
