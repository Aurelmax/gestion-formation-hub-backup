"use client";

import { FileDown, X, ExternalLink } from "lucide-react";
// html2pdf est importé dynamiquement dans le gestionnaire handleDownload
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { Formation } from "../catalogue/types";
import { Badge } from "@/components/ui/badge";

interface FormationDetailsModalProps {
  formation: Formation | null;
  isOpen: boolean;
  onClose: () => void;
}

const FormationDetailsModal = ({ formation, isOpen, onClose }: FormationDetailsModalProps) => {
  if (!formation) return null;

  // Utiliser l'URL du programme si elle existe, sinon créer une URL par défaut
  const programmeUrl = formation.programmeUrl || `/programmes/${formation.id}-programme.html`;
  
  // Fonction pour déclencher le téléchargement du fichier en PDF
  const handleDownload = async () => {
    try {
      // Afficher un indicateur de chargement (optionnel)
      // toast({ title: "Génération du PDF en cours...", description: "Merci de patienter quelques instants." });
      
      // Import dynamique de html2pdf.js (uniquement côté client)
      const html2pdfModule = await import('html2pdf.js');
      const html2pdf = html2pdfModule.default;
      
      // Récupérer le contenu du fichier HTML
      const response = await fetch(programmeUrl);
      const htmlContent = await response.text();
      
      // Créer un élément div temporaire pour contenir le HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);
      
      // Configuration pour html2pdf
      const options = {
        margin: 10,
        filename: `programme-${formation.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      // Générer le PDF à partir du contenu HTML et le télécharger
      html2pdf()
        .from(tempDiv)
        .set(options)
        .save()
        .then(() => {
          // Nettoyer l'élément temporaire
          document.body.removeChild(tempDiv);
        })
        .catch((error) => {
          console.error('Erreur lors de la génération du PDF:', error);
          // En cas d'erreur, essayer de télécharger le HTML
          window.open(programmeUrl, '_blank');
          document.body.removeChild(tempDiv);
        });
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      // En cas d'erreur, ouvrir simplement le fichier dans un nouvel onglet
      window.open(programmeUrl, '_blank');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4 mb-4">
          <div className="flex items-start justify-between">
            <DialogTitle className="text-2xl text-blue-900">{formation.titre}</DialogTitle>
            {/* Croix personnalisée supprimée - utilisation de la croix par défaut du Dialog */}
          </div>
          <DialogDescription className="text-base mt-2">{formation.description}</DialogDescription>
          <div className="flex items-center gap-3 mt-3 text-xs bg-gray-50 p-2 rounded">
            <span className="font-medium text-gray-600">Version: 2.1</span>
            <span className="text-gray-500">•</span>
            <span className="font-medium text-gray-600">Mise à jour: 04/08/2025</span>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colonne gauche */}
          <div className="md:col-span-2">
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Programme détaillé</h3>
              
              <div className="bg-gray-50 p-4 rounded-md">
                {formation.id === "A001-WP-DD" ? (
                  <>
                    <h3 className="font-semibold mb-3 text-blue-800">Jour 1 : Création et gestion d'un site internet avec WordPress (7 heures)</h3>
                    
                    <h4 className="font-medium mb-2 mt-4">Matin (9h - 13h)</h4>
                    <div className="pl-3 mb-4">
                      <h5 className="text-sm font-semibold mb-1">1. Introduction à WordPress</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Qu'est-ce que WordPress ? Pourquoi choisir WordPress pour créer un site internet.</li>
                        <li>Installation de WordPress : guide pratique pour installer son site sur son hébergeur.</li>
                        <li>Configuration initiale : choisir un thème, régler les paramètres généraux.</li>
                      </ul>
                      
                      <h5 className="text-sm font-semibold mb-1">2. Gestion de la structure du site</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Création des pages essentielles : Accueil, À propos, Contact, Politique de confidentialité.</li>
                        <li>Gestion des articles et catégories : pourquoi et comment organiser un blog.</li>
                        <li>Mise en place des menus de navigation et sous-menus.</li>
                      </ul>
                    </div>
                    
                    <h4 className="font-medium mb-2 mt-4">Après-midi (14h - 17h)</h4>
                    <div className="pl-3 mb-4">
                      <h5 className="text-sm font-semibold mb-1">3. Personnalisation de l'apparence du site</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Choisir un thème adapté à votre activité (thèmes gratuits et payants).</li>
                        <li>Personnalisation via le customizer : couleurs, typographies, menus et widgets.</li>
                        <li>Introduction à l'éditeur Gutenberg pour une mise en page avancée sans coder.</li>
                      </ul>
                      
                      <h5 className="text-sm font-semibold mb-1">4. Ajout de fonctionnalités essentielles</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Installer des plugins : sécurité (ex. Wordfence), SEO (Yoast SEO), formulaires de contact.</li>
                        <li>Introduction à un constructeur de pages (ex. Elementor).</li>
                        <li>Gérer la sécurité et les sauvegardes de votre site.</li>
                      </ul>
                    </div>
                    
                    <h3 className="font-semibold mb-3 mt-6 text-blue-800">Jour 2 : Stratégie de développement digital (7 heures)</h3>
                    
                    <h4 className="font-medium mb-2 mt-4">Matin (9h - 13h)</h4>
                    <div className="pl-3 mb-4">
                      <h5 className="text-sm font-semibold mb-1">1. Définir les objectifs commerciaux sur internet</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Déterminer les objectifs spécifiques de votre site : acquisition de trafic, conversion, fidélisation.</li>
                        <li>Identifier votre audience cible : définition des personas et de leurs besoins.</li>
                        <li>Analyser la concurrence et les tendances du marché.</li>
                      </ul>
                      
                      <h5 className="text-sm font-semibold mb-1">2. Introduction au référencement naturel (SEO)</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Comprendre les bases du SEO : recherche de mots-clés, optimisation du contenu.</li>
                        <li>Optimisation on-page : amélioration de la vitesse du site, structure des URL, maillage interne.</li>
                        <li>Utilisation de plugins SEO (ex. Yoast SEO) pour optimiser vos pages et articles.</li>
                      </ul>
                    </div>
                    
                    <h4 className="font-medium mb-2 mt-4">Après-midi (14h - 17h)</h4>
                    <div className="pl-3 mb-4">
                      <h5 className="text-sm font-semibold mb-1">3. Stratégie sur les réseaux sociaux</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Importance des réseaux sociaux pour accroître la visibilité de votre site.</li>
                        <li>Choisir les bonnes plateformes : Facebook, LinkedIn, Instagram, YouTube, etc.</li>
                        <li>Stratégie de contenu : créer des publications engageantes et adaptées à votre audience.</li>
                      </ul>
                      
                      <h5 className="text-sm font-semibold mb-1">4. Publicité en ligne et autres outils</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Introduction aux publicités payantes : Facebook Ads, Google Ads.</li>
                        <li>Définir un budget et cibler votre audience.</li>
                        <li>Outils pour analyser et suivre la performance de votre site : Google Analytics, Matomo.</li>
                        <li>Automatisation de la communication : campagnes d'emailing (Mailchimp, Brevo).</li>
                      </ul>
                      
                      <h5 className="text-sm font-semibold mb-1">5. Mise en place d'un plan d'action digital</h5>
                      <ul className="list-disc list-inside mb-3 text-sm text-gray-700 space-y-1">
                        <li>Élaboration d'un plan d'action pour une stratégie complète de développement digital.</li>
                        <li>Suivi et ajustement des actions : comment évaluer et améliorer les résultats.</li>
                        <li>Séance de questions-réponses pour les problèmes spécifiques des participants.</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="font-medium mb-2">Module 1: Introduction</h4>
                    <ul className="list-disc list-inside mb-4 text-sm text-gray-700 space-y-1">
                      <li>Présentation des concepts fondamentaux</li>
                      <li>Contexte et enjeux</li>
                      <li>Méthodologie et bonnes pratiques</li>
                    </ul>
                    
                    <h4 className="font-medium mb-2">Module 2: Mise en pratique</h4>
                    <ul className="list-disc list-inside mb-4 text-sm text-gray-700 space-y-1">
                      <li>Application des concepts théoriques</li>
                      <li>Études de cas concrets</li>
                      <li>Exercices pratiques guidés</li>
                    </ul>
                    
                    <h4 className="font-medium mb-2">Module 3: Perfectionnement</h4>
                    <ul className="list-disc list-inside mb-4 text-sm text-gray-700 space-y-1">
                      <li>Techniques avancées</li>
                      <li>Optimisation et performance</li>
                      <li>Intégration dans un environnement professionnel</li>
                    </ul>
                    
                    <h4 className="font-medium mb-2">Évaluation et certification</h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>Quiz et tests de connaissances</li>
                      <li>Projet pratique de validation</li>
                      <li>Certification finale</li>
                    </ul>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Objectifs pédagogiques</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="mb-3 text-sm text-gray-700">À l'issue de cette formation, vous serez capable de :</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                  {formation.objectifs.map((objectif, index) => (
                    <li key={index}>{objectif}</li>
                  ))}
                  <li>Mettre en place une stratégie personnalisée</li>
                  <li>Évaluer et optimiser les performances</li>
                  <li>Résoudre des problématiques complexes du domaine</li>
                </ul>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3 text-blue-800">Méthodes pédagogiques</h3>
              <div className="bg-gray-50 p-4 rounded-md text-sm text-gray-700 space-y-3">
                <p>
                  <span className="font-medium">Approche théorique :</span> Présentations dynamiques, discussions de groupe et études de cas.
                </p>
                <p>
                  <span className="font-medium">Mise en pratique :</span> Exercices guidés, travaux pratiques et projets concrets.
                </p>
                <p>
                  <span className="font-medium">Évaluation continue :</span> Quiz réguliers, feedback personnalisé et évaluation finale.
                </p>
              </div>
            </div>
          </div>
          
          {/* Colonne droite */}
          <div>
            <div className="bg-white border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 text-gray-900">Informations clés</h3>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Niveau</p>
                  <p className="font-medium">{formation.niveau}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Durée</p>
                  <p className="font-medium">{formation.duree}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Modalité</p>
                  <p className="font-medium">{formation.modalites}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Participants</p>
                  <p className="font-medium">{formation.participants}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Prérequis</p>
                  <p className="font-medium">{formation.prerequis}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Prix</p>
                  <p className="font-bold text-blue-600">{formation.prix}</p>
                  <p className="text-xs text-gray-500">Net de taxes</p>
                </div>
              </div>
            </div>
            
            {/* Indicateurs de performance */}
            <div className="bg-white border rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-3 text-gray-900">Indicateurs de performance</h3>
              
              <div className="space-y-3">
                {formation.tauxParticipation && (
                  <div>
                    <p className="text-sm text-gray-500">Taux de participation</p>
                    <p className="font-bold text-blue-700">{formation.tauxParticipation}</p>
                  </div>
                )}
                
                {formation.tauxReussite && (
                  <div>
                    <p className="text-sm text-gray-500">Taux de réussite</p>
                    <p className="font-bold text-green-700">{formation.tauxReussite}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm text-gray-500">Satisfaction globale</p>
                  <p className="font-bold text-amber-600">4,8/5</p>
                </div>
              </div>
            </div>
            
            {/* Certification */}
            <div className="bg-white border border-green-100 rounded-lg p-4">
              <h3 className="font-semibold mb-2 text-gray-900">Certification</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-green-50 text-green-800 border-green-200">
                  Éligible CPF
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">
                  Certification reconnue
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter className="mt-8 pt-4 border-t flex flex-col sm:flex-row gap-4">
          <p className="text-sm text-gray-500 sm:mr-auto">
            <span className="font-semibold">Information réglementaire :</span> Ce programme est fourni conformément aux exigences de la certification Qualiopi.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              className="flex items-center gap-2" 
              onClick={handleDownload}
            >
              <FileDown className="h-4 w-4" />
              Télécharger le programme complet
            </Button>
            <Button 
              className="flex items-center gap-2" 
              variant="outline" 
              onClick={() => window.open(programmeUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
              Consulter en ligne
            </Button>
          </div>
          {/* Bouton de fermeture supprimé pour n'avoir qu'une seule croix */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormationDetailsModal;
