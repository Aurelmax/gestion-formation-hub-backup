"use client";

import { motion } from "framer-motion";

const OffreEntreprise = () => {
  return (
    <section className="py-16 overflow-hidden relative">
      {/* Fond stylisé */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-50 z-0">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-emerald-700" />
          </svg>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-center text-4xl md:text-5xl font-extrabold mb-8 text-emerald-700">
            NOTRE OFFRE SPÉCIALE ENTREPRISE
          </h2>
          
          <div className="text-center mb-10 max-w-3xl mx-auto">
            <h3 className="text-xl md:text-2xl font-bold text-blue-900 mb-6">
              Offrez à vos équipes une formation qui valorise leurs talents et renforce leur impact professionnel
            </h3>
          </div>
          
          {/* Description de la formation */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md">
              <p className="text-blue-900 mb-4">
                Notre formation en anglais professionnel est conçue pour répondre aux besoins spécifiques de votre organisation.
              </p>
              <p className="text-blue-900 mb-4">
                Elle se compose de <span className="font-bold">12 ateliers thématiques</span>, animés par un formateur expert doté d'une expérience professionnelle remarquable à l'international.
              </p>
              <p className="text-blue-900">
                Que ce soit pour <span className="font-bold">une personne</span> ou un groupe allant <span className="font-bold">jusqu'à 5 participants</span>, chaque atelier est adapté aux besoins des apprenants.
              </p>
            </div>
            <div className="bg-white bg-opacity-70 p-6 rounded-lg shadow-md">
              <p className="text-blue-900 mb-4">
                Chaque session d'une heure combine des mises en situations concrètes et des points de grammaire essentiels.
              </p>
              <p className="text-blue-900">
                Notre parcours garantit donc une progression rapide et efficace et des compétences applicables immédiatement au sein de votre entreprise.
              </p>
            </div>
          </div>
          
          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-blue-900 text-white rounded-lg p-4 text-center flex flex-col items-center justify-center">
              <span className="text-5xl font-bold mb-2">5</span>
              <p className="text-sm">personnes maximum par atelier pour le même tarif</p>
            </div>
            <div className="bg-blue-900 text-white rounded-lg p-4 text-center flex flex-col items-center justify-center">
              <span className="text-5xl font-bold mb-2">1</span>
              <p className="text-sm">formateur natif avec 30 ans d'expérience dans le monde professionnel</p>
            </div>
            <div className="bg-blue-900 text-white rounded-lg p-4 text-center flex flex-col items-center justify-center">
              <span className="text-5xl font-bold mb-2">12</span>
              <p className="text-sm">ateliers thématiques adaptés aux différents métiers et besoins</p>
            </div>
            <div className="bg-blue-900 text-white rounded-lg p-4 text-center flex flex-col items-center justify-center">
              <span className="text-5xl font-bold mb-2">100%</span>
              <p className="text-sm">finançable par votre OPCO</p>
            </div>
          </div>
          
          {/* Formules de tarification */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Formule Intra-entreprise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-emerald-500"
            >
              <div className="bg-emerald-700 text-white p-4 text-center">
                <h3 className="font-bold text-xl">Intra-entreprise</h3>
                <p className="text-sm">Salariés de la même entreprise</p>
              </div>
              <div className="p-6">
                <p className="text-center mb-4 font-medium text-gray-700">Tarif unique de 3 à 5 personnes</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-emerald-600">2670 €</span>
                  <p className="text-sm text-gray-500">net de taxe - Hors coût de certification</p>
                </div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Formule Inter-entreprise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-emerald-500"
            >
              <div className="bg-emerald-700 text-white p-4 text-center">
                <h3 className="font-bold text-xl">Inter-entreprise</h3>
                <p className="text-sm">Salariés d'entreprises différentes</p>
              </div>
              <div className="p-6">
                <p className="text-center mb-4 font-medium text-gray-700">Tarif par personne (groupe jusqu'à 5 personnes)</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-emerald-600">735 €</span>
                  <p className="text-sm text-gray-500">net de taxe - Hors coût de certification</p>
                </div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Formule Individuel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border-t-4 border-blue-700"
            >
              <div className="bg-blue-900 text-white p-4 text-center">
                <h3 className="font-bold text-xl">Individuel</h3>
                <p className="text-sm">Face à face avec formateur</p>
              </div>
              <div className="p-6">
                <p className="text-center mb-4 font-medium text-gray-700">Tarif pour 1 personne</p>
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold text-blue-700">1236 €</span>
                  <p className="text-sm text-gray-500">net de taxe - Hors coût de certification</p>
                </div>
                <div className="flex justify-center">
                  <div className="w-10 h-10 bg-blue-700 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Call to action */}
          <div className="mt-12 text-center">
            <a 
              href="/contact?subject=Offre%20Entreprise" 
              className="inline-block px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white font-medium rounded-md shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
            >
              Demander un devis personnalisé
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OffreEntreprise;
