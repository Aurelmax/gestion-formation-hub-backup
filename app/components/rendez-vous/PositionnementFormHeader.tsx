import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PositionnementFormHeaderProps {
  formationTitre: string;
  onClose?: () => void;
}

const PositionnementFormHeader = ({ 
  formationTitre,
  onClose 
}: PositionnementFormHeaderProps) => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-t-lg">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Demande de rendez-vous de positionnement
          </h2>
          {formationTitre && (
            <p className="text-blue-100">
              Formation : <span className="font-medium">{formationTitre}</span>
            </p>
          )}
          <p className="text-blue-100 text-sm max-w-3xl">
            Remplissez ce formulaire pour réserver votre entretien de positionnement. 
            Notre équipe vous contactera pour confirmer le créneau.
          </p>
        </div>
        
        {onClose && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-blue-700 hover:text-white rounded-full h-8 w-8"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Fermer</span>
          </Button>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-blue-500/30">
        <div className="flex items-center text-sm text-blue-100">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/30 mr-2">
              <span className="font-bold">1</span>
            </div>
            <span>Formulaire</span>
          </div>
          
          <div className="flex-1 h-px bg-blue-500/50 mx-4"></div>
          
          <div className="flex items-center text-blue-200/70">
            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500/20 mr-2">
              <span className="font-bold">2</span>
            </div>
            <span>Confirmation</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionnementFormHeader;
