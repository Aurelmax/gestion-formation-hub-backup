
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Award, CheckCircle } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="/formation-wordpress-antibes.webp" 
          alt="Formation WordPress Antibes" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/80"></div>
      </div>
      <div className="relative z-10 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Formations WordPress Professionnelles
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Développez vos compétences WordPress avec un formateur certifié. 
            Formations éligibles CPF et conformes Qualiopi.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
            <Link href="/catalogue" legacyBehavior passHref>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Voir le catalogue
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4 bg-accent/90 hover:bg-accent border-white text-white">
              Demander un devis
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Award className="h-5 w-5 mr-2" />
              Certifié Qualiopi
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <CheckCircle className="h-5 w-5 mr-2" />
              Éligible CPF
            </Badge>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
