import { useState, useEffect } from "react";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ProcessusPedagogique from "@/components/ProcessusPedagogique";
import PositionnementForm from "@/components/rendez-vous/PositionnementForm";
import CatalogueHeader from "@/components/catalogue/CatalogueHeader";
import CatalogueHero from "@/components/catalogue/CatalogueHero";
import FormationsList from "@/components/catalogue/FormationsList";
import FormationsAdaptabilite from "@/components/catalogue/FormationsAdaptabilite";
import CustomFormationCTA from "@/components/catalogue/CustomFormationCTA";
import Footer from "@/components/Footer";
import WordPressFAQ from "@/components/wordpress/WordPressFAQ";
import { Formation, CategorieFormation } from "@/components/catalogue/types";

const Catalogue = () => {
  const [showPositionnementForm, setShowPositionnementForm] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [categoriesFormations, setCategoriesFormations] = useState<CategorieFormation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du backend
  // Fonction pour transformer les données du backend au format attendu par le frontend
  const transformBackendData = (backendData: any[]): CategorieFormation[] => {
    return backendData.map(category => ({
      id: category.id,
      titre: category.titre,
      description: category.description,
      formations: category.formations.map((formation: any) => ({
        id: formation.id,
        titre: formation.titre,
        description: formation.description,
        duree: formation.duree || '7h',
        prix: formation.prix || '980€',
        niveau: formation.niveau || 'Débutant',
        // Champs requis par le type Formation mais potentiellement manquants dans les données du backend
        participants: formation.participants || 'Tout public', // Champ requis
        objectifs: Array.isArray(formation.objectifs) ? formation.objectifs : 
                  (formation.objectifs ? [formation.objectifs] : ['Objectif à définir']),
        prerequis: formation.prerequis || 'Aucun prérequis spécifique',
        modalites: formation.modalites || 'Formation à distance ou en présentiel',
        // Champs optionnels
        tauxParticipation: formation.tauxParticipation,
        tauxReussite: formation.tauxReussite,
        programmeUrl: formation.programmeUrl || `/formations/${formation.id}`
      }))
    }));
  };
  
  useEffect(() => {
    const fetchCatalogueFormations = async () => {
      try {
        setLoading(true);
        
        // Récupérer les programmes de formation depuis l'API
        const dbResponse = await axios.get('/api/programmes-formation/par-categorie/groupes');
        let allCategories: CategorieFormation[] = [];
        
        if (dbResponse.data && Array.isArray(dbResponse.data)) {
          // Transformation des données de la base de données
          const dbData = transformBackendData(dbResponse.data);
          allCategories = dbData;
          console.log('Programmes de formation chargés:', dbData);
        }
        
        try {
          // Essayer aussi de récupérer des données supplémentaires si disponibles
          const additionalResponse = await axios.get('/api/programmes-formation/par-categorie');
          
          if (additionalResponse.data && Array.isArray(additionalResponse.data)) {
            // Transformation des données supplémentaires
            const additionalData = transformBackendData(additionalResponse.data);
            
            // Fusion des deux sources de données
            additionalData.forEach(additionalCategory => {
              // Vérifier si cette catégorie existe déjà dans allCategories
              const existingCategoryIndex = allCategories.findIndex(cat => cat.id === additionalCategory.id);
              
              if (existingCategoryIndex >= 0) {
                // La catégorie existe, fusionner les formations
                additionalCategory.formations.forEach(additionalFormation => {
                  // Ne pas ajouter les formations en double
                  const existingFormationIndex = allCategories[existingCategoryIndex].formations
                    .findIndex(f => f.id === additionalFormation.id || f.titre === additionalFormation.titre);
                  
                  if (existingFormationIndex < 0) {
                    allCategories[existingCategoryIndex].formations.push(additionalFormation);
                  }
                });
              } else {
                // La catégorie n'existe pas, l'ajouter
                allCategories.push(additionalCategory);
              }
            });
            
            console.log('Données combinées:', allCategories);
          }
        } catch (additionalErr) {
          console.warn("Erreur lors du chargement des données supplémentaires:", additionalErr);
          // On continue avec les données principales
        }
        
        if (allCategories.length > 0) {
          setCategoriesFormations(allCategories);
        } else {
          setError("Aucune formation trouvée dans le catalogue");
        }
      } catch (err) {
        console.error("Erreur lors du chargement du catalogue:", err);
        setError("Impossible de charger le catalogue de formations");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalogueFormations();
  }, []);

  // Affichage des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <CatalogueHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Chargement...</span>
            </div>
            <h2 className="mt-4 text-xl font-semibold">Chargement du catalogue...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <CatalogueHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 bg-red-50 rounded-lg max-w-xl">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold text-red-700 mb-2">Erreur de chargement</h2>
            <p className="text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Utiliser les données combinées pour l'affichage
  const categoriesToDisplay = categoriesFormations;

  const handlePositionnement = (formationTitre: string) => {
    console.log(`Redirection vers la page de rendez-vous de positionnement pour: ${formationTitre}`);
    // Encoder le titre de la formation pour l'URL
    const encodedTitre = encodeURIComponent(formationTitre);
    // Rediriger vers la page de rendez-vous avec le titre de la formation en paramètre
    window.location.href = `/rendezvous-positionnement?formation=${encodedTitre}`;
  };

  const handlePositionnementSubmit = (data: any) => {
    console.log("Données du positionnement:", data);
    setShowPositionnementForm(false);
    setSelectedFormation("");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <CatalogueHeader />
        <CatalogueHero />
        <FormationsAdaptabilite />
        <ProcessusPedagogique />
        <FormationsList 
          categoriesFormations={categoriesToDisplay} 
          onPositionnement={handlePositionnement} 
        />
        {/* FAQ WordPress intégrée juste après la liste des formations */}
        <WordPressFAQ />
        <CustomFormationCTA />
        <Footer />
      </div>

      <Dialog open={showPositionnementForm} onOpenChange={setShowPositionnementForm}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rendez-vous de positionnement - {selectedFormation}</DialogTitle>
          </DialogHeader>
          <PositionnementForm
            formationTitre={selectedFormation}
            onSubmit={handlePositionnementSubmit}
            onCancel={() => {
              setShowPositionnementForm(false);
              setSelectedFormation("");
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Catalogue;
