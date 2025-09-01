
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Users, CheckCircle } from "lucide-react";

const AboutSection = () => {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Votre formateur certifié
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Formateur indépendant certifié Qualiopi, je vous accompagne dans 
              l'apprentissage de WordPress avec une approche personnalisée et pratique.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Certification Qualiopi</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Formations éligibles CPF</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Suivi personnalisé</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span>Support technique inclus</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Formations</h4>
                <p className="text-3xl font-bold text-blue-600">50+</p>
                <p className="text-sm text-gray-600">Sessions réalisées</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h4 className="text-lg font-semibold mb-2">Apprenants</h4>
                <p className="text-3xl font-bold text-green-600">200+</p>
                <p className="text-sm text-gray-600">Personnes formées</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
