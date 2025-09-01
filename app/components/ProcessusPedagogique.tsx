import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, BookOpen, Target } from "lucide-react";
import PositionnementForm from "@/components/rendez-vous/PositionnementForm";

const ProcessusPedagogique = () => {
  const [showPositionnementForm, setShowPositionnementForm] = useState(false);

  const etapes = [
    {
      numero: 1,
      titre: "Rendez-vous de découverte",
      description: "Un échange en présentiel pour analyser vos besoins spécifiques et définir ensemble des objectifs opérationnels concrets adaptés à votre activité.",
      icon: Calendar,
      couleur: "bg-blue-100 text-blue-600"
    },
    {
      numero: 2,
      titre: "Inscription et formation",
      description: "Un rendez-vous d'inscription officialise votre entrée en formation. Dès le début du parcours, nous fixons une date provisionnelle pour le rendez-vous d'impact.",
      icon: BookOpen,
      couleur: "bg-green-100 text-green-600"
    },
    {
      numero: 3,
      titre: "Rendez-vous d'impact",
      description: "Un échange en présentiel pour mesurer les résultats obtenus, valider vos acquis et envisager ensemble les suites possibles pour continuer votre progression.",
      icon: Target,
      couleur: "bg-purple-100 text-purple-600"
    }
  ];

  const handlePositionnementSubmit = (data: any) => {
    console.log("Données du positionnement:", data);
    setShowPositionnementForm(false);
    // Ici on pourrait rediriger vers une page de confirmation ou envoyer un email
  };

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Processus pédagogique personnalisé
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Une approche structurée en 3 étapes pour garantir l'efficacité de votre formation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {etapes.map((etape) => (
              <Card key={etape.numero} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4">
                    <div className={`w-16 h-16 rounded-full ${etape.couleur} flex items-center justify-center mx-auto mb-4`}>
                      <etape.icon className="h-8 w-8" />
                    </div>
                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">
                      {etape.numero}
                    </div>
                  </div>
                  <CardTitle className="text-xl text-blue-900 mb-3">
                    {etape.titre}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {etape.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3"
              onClick={() => setShowPositionnementForm(true)}
            >
              Démarrer votre parcours
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Rendez-vous de positionnement obligatoire avant toute inscription
            </p>
          </div>
        </div>
      </section>

      <Dialog open={showPositionnementForm} onOpenChange={setShowPositionnementForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Formulaire de positionnement</DialogTitle>
          </DialogHeader>
          <PositionnementForm
            onSubmit={handlePositionnementSubmit}
            onCancel={() => setShowPositionnementForm(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProcessusPedagogique;
