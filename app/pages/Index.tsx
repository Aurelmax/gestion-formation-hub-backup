import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import FormationsPreview from "@/components/FormationsPreview";
import IllustrationSection from "@/components/IllustrationSection";
import OffreEntreprise from "@/components/OffreEntreprise";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { ArrowDownCircle } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  // Variantes d'animation pour les sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: "easeOut" as const
      } 
    }
  };

  // Variantes pour le séparateur
  const separatorVariants = {
    hidden: { width: 0 },
    visible: { 
      width: "100%",
      transition: { duration: 1.2, ease: "easeInOut" as const }
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      <Header />
      
      <main id="main-content" role="main">
        {/* Hero avec animation subtile */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <HeroSection />
        </motion.div>
      
      {/* Séparateur visuel élégant */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex justify-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.8 }}
          className="flex flex-col items-center"
        >
          <ArrowDownCircle className="text-blue-600 w-10 h-10 animate-bounce" />
          <motion.div
            variants={separatorVariants}
            className="h-0.5 bg-gradient-to-r from-transparent via-blue-600 to-transparent mt-8 max-w-md w-full"
          />
        </motion.div>
      </div>
      
      {/* Section À propos */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative z-10 bg-gradient-to-b from-white to-gray-50"
      >
        <AboutSection />
      </motion.div>
      
      {/* Séparateur décoratif */}
      <div className="w-full overflow-hidden">
        <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-gray-50"
          />
        </svg>
      </div>
      
      {/* Section Formations */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative z-10 bg-white pt-6"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <h2 className="text-center text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            <span className="text-blue-700">Formations d'excellence</span>
          </h2>
          <div className="flex justify-center mb-12">
            <div className="h-1 w-24 bg-blue-600 rounded"></div>
          </div>
        </div>
        <FormationsPreview />
      </motion.div>
      
      {/* Section Illustrations */}
      <IllustrationSection />
      
      {/* Séparateur élégant */}
      <div className="w-full overflow-hidden transform rotate-180">
        <svg className="w-full h-24" preserveAspectRatio="none" viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            className="fill-gray-50"
          />
        </svg>
      </div>
      
      {/* Section Offre Entreprise */}
      <OffreEntreprise />
      
      {/* Section CTA avec design amélioré */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={sectionVariants}
        className="relative"
      >
        <div className="absolute inset-0 bg-blue-600 bg-opacity-90 backdrop-filter backdrop-blur-sm"></div>
        <div className="relative bg-blue-600 bg-[url('/img/pattern-bg.png')] bg-blend-multiply text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" as const }}
              className="text-4xl font-bold mb-4">
              Prêt à faire évoluer vos compétences professionnelles ?
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl mb-10 max-w-3xl mx-auto">
              Découvrez notre catalogue complet de formations et transformez votre avenir professionnel
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row justify-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
                    Accéder au Dashboard
                  </Button>
                </Link>
              ) : (
                <Link href="/auth">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300">
                    Se connecter
                  </Button>
                </Link>
              )}
              <Link href="/catalogue">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Voir le catalogue complet
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
