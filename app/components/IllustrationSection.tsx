"use client";

import { motion } from "framer-motion";

const IllustrationSection = () => {
  // Animation variants pour les images
  const imageVariants = {
    offscreen: { 
      y: 50, 
      opacity: 0 
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
            <span className="text-blue-700">
              Des formations qui donnent des ailes
            </span>
          </h2>
          <div className="flex justify-center mb-6">
            <div className="h-1 w-24 bg-blue-600 rounded"></div>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nos apprenants témoignent de la qualité de nos formations et de l'impact positif sur leur carrière
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Première illustration */}
          <motion.div
            className="relative"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
          >
            <div className="bg-gradient-to-tr from-blue-500 to-indigo-600 absolute inset-0 rounded-lg transform -rotate-6 scale-95 opacity-20 blur-xl"></div>
            <div className="relative p-2 bg-white border-2 border-gray-100 rounded-lg shadow-xl transform transition-transform hover:scale-105 duration-300">
              <img 
                src="/professionnel-dynamique-en-costume-bleujpg-20250805-070512.webp" 
                alt="Professionnel dynamique en costume bleu" 
                className="w-full h-auto rounded"
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold">Dynamisme</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-gray-800">Maîtrisez WordPress</h3>
              <p className="text-gray-600">Développez des compétences qui vous démarquent sur le marché</p>
            </div>
          </motion.div>

          {/* Deuxième illustration */}
          <motion.div
            className="relative mt-12 md:mt-24"
            initial="offscreen"
            whileInView="onscreen"
            viewport={{ once: true, amount: 0.3 }}
            variants={imageVariants}
          >
            <div className="bg-gradient-to-bl from-yellow-400 to-orange-500 absolute inset-0 rounded-lg transform rotate-6 scale-95 opacity-20 blur-xl"></div>
            <div className="relative p-2 bg-white border-2 border-gray-100 rounded-lg shadow-xl transform transition-transform hover:scale-105 duration-300">
              <img 
                src="/professinnelle-dynamique-tailleurjpg-20250805-070512.webp" 
                alt="Professionnelle dynamique en tailleur" 
                className="w-full h-auto rounded"
              />
              <div className="absolute -bottom-4 -right-4 bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg">
                <span className="text-sm font-bold">Innovation</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-xl font-bold text-gray-800">Développez vos compétences</h3>
              <p className="text-gray-600">Des formations adaptées à votre rythme et à vos objectifs</p>
            </div>
          </motion.div>
        </div>
        
        {/* Bouton d'appel à l'action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          <a 
            href="/catalogue" 
            className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all duration-300"
          >
            Découvrir toutes nos formations
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default IllustrationSection;
