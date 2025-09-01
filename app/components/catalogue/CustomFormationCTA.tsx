
import { Button } from "@/components/ui/button";

const CustomFormationCTA = () => {
  return (
    <section className="bg-blue-50 py-12">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Formation sur mesure
        </h3>
        <p className="text-lg text-gray-600 mb-6">
          Besoin d'une formation adaptée à vos besoins spécifiques ? 
          Nous créons des programmes sur mesure pour votre entreprise.
        </p>
        <Button size="lg" className="text-lg px-8 py-3">
          Contactez-nous
        </Button>
      </div>
    </section>
  );
};

export default CustomFormationCTA;
