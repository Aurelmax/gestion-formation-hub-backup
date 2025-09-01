import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";
import { ApiError, ApiResponse } from "@/types";

// Interface pour les programmes de formation unifiés
export interface ProgrammeFormation {
  id: string;
  code: string;
  type: "catalogue" | "sur-mesure"; // Type du programme (catalogue ou sur-mesure)
  titre: string;
  description: string;
  
  // Champs descriptifs
  niveau: string;
  participants: string;
  duree: string;
  prix: string;
  objectifs: string[];
  prerequis: string;
  modalites: string;
  
  // Champs réglementaires
  publicConcerne: string;
  contenuDetailleJours: string;
  modalitesAcces: string;
  modalitesTechniques: string;
  modalitesReglement: string;
  formateur: string;
  ressourcesDisposition: string;
  modalitesEvaluation: string;
  sanctionFormation: string;
  niveauCertification: string;
  delaiAcceptation: string;
  accessibiliteHandicap: string;
  cessationAbandon: string;
  
  // Champs spécifiques aux programmes sur-mesure
  beneficiaireId: string | null;
  objectifsSpecifiques: string | null;
  positionnementRequestId: string | null;
  
  // URL vers le programme HTML
  programmeUrl: string | null;
  programme?: string; // Contenu détaillé du programme au format HTML ou texte
  contenuDetailleHtml?: string; // Contenu détaillé au format HTML
  
  // Catégorie
  categorieId: string | null;
  categorie?: {
    id: string;
    code: string;
    titre: string;
    description: string;
  };
  
  // Style
  pictogramme: string;
  
  // Statut
  estActif?: boolean;
  version?: string;
  typeProgramme?: string;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
}

export const useProgrammesFormation = () => {
  const [programmes, setProgrammes] = useState<ProgrammeFormation[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Données simulées pour démonstration quand l'API n'est pas disponible
  const MOCK_PROGRAMMES: ProgrammeFormation[] = [
    {
      id: "1",
      code: "DEV-WEB-01",
      type: "catalogue",
      titre: "Développement Web Front-End",
      description: "Formation complète sur les technologies front-end modernes incluant HTML5, CSS3 et JavaScript.",
      niveau: "Débutant",
      participants: "8 à 12 personnes",
      duree: "35 heures",
      prix: "1950€ HT",
      objectifs: [
        "Maîtriser les fondamentaux du développement web",
        "Créer des interfaces utilisateur modernes et responsives",
        "Comprendre et utiliser JavaScript et ses frameworks"
      ],
      prerequis: "Connaissances de base en informatique",
      modalites: "Formation en présentiel ou à distance",
      pictogramme: "💻",
      estActif: true,
      contenuDetailleHtml: "<h2>Module 1: Introduction au HTML5</h2><p>Structure, balises sémantiques, formulaires avancés</p>",
      publicConcerne: "Tout public souhaitant se former au développement web",
      contenuDetailleJours: "Jour 1: HTML5, Jour 2: CSS3, Jour 3: JavaScript, Jour 4-5: Projets",
      modalitesAcces: "Inscription en ligne ou par téléphone",
      modalitesTechniques: "Ordinateur avec connexion internet, environnement de développement",
      modalitesReglement: "Paiement par virement bancaire ou CB",
      formateur: "Experts en développement web avec +5 ans d'expérience",
      ressourcesDisposition: "Support de cours, exercices pratiques, accès à une plateforme en ligne",
      modalitesEvaluation: "QCM et projet pratique",
      sanctionFormation: "Attestation de fin de formation",
      niveauCertification: "N/A",
      delaiAcceptation: "15 jours avant le début de la formation",
      accessibiliteHandicap: "Locaux accessibles aux personnes à mobilité réduite",
      cessationAbandon: "Remboursement au prorata des heures suivies",
      beneficiaireId: null,
      objectifsSpecifiques: null,
      positionnementRequestId: null,
      programmeUrl: "https://www.example.com/programmes/dev-web-01",
      programme: "<h1>Programme détaillé</h1><p>Formation développement web complète</p>",
      categorie: {
        id: "1",
        code: "DEV",
        titre: "Développement informatique",
        description: "Formations en développement informatique",
      },
      categorieId: "1",
      createdAt: new Date('2023-05-10'),
      updatedAt: new Date('2023-09-18')
    },
    {
      id: "2",
      code: "DATA-SCIENCE-01",
      type: "catalogue",
      titre: "Introduction à la Data Science",
      description: "Découvrez les fondamentaux de la data science et apprenez à manipuler et analyser des données.",
      niveau: "Intermédiaire",
      participants: "6 à 10 personnes",
      duree: "21 heures",
      prix: "1450€ HT",
      objectifs: [
        "Comprendre les concepts de base de la data science",
        "Manipuler et nettoyer des jeux de données",
        "Créer des visualisations pertinentes",
        "S'initier au machine learning"
      ],
      prerequis: "Connaissances en programmation et statistiques de base",
      modalites: "Formation en présentiel ou à distance",
      pictogramme: "📊",
      estActif: true,
      contenuDetailleHtml: "<h2>Module 1: Introduction à Python pour la Data Science</h2><p>Pandas, NumPy, visualisation avec Matplotlib</p>",
      publicConcerne: "Analystes, développeurs et professionnels de l'informatique",
      contenuDetailleJours: "Jour 1: Python et librairies, Jour 2: Analyse de données, Jour 3: Machine Learning",
      modalitesAcces: "Inscription via le site web",
      modalitesTechniques: "Ordinateur avec Python installé, accès à Google Colab",
      modalitesReglement: "Paiement à l'inscription",
      formateur: "Data Scientists expérimentés",
      ressourcesDisposition: "Notebooks Jupyter, datasets, documentation",
      modalitesEvaluation: "Projet d'analyse de données réel",
      sanctionFormation: "Attestation de compétences",
      niveauCertification: "N/A",
      delaiAcceptation: "10 jours avant le début",
      accessibiliteHandicap: "Formation adaptable selon les besoins",
      cessationAbandon: "Remboursement si annulation 7 jours avant",
      beneficiaireId: null,
      objectifsSpecifiques: null,
      positionnementRequestId: null,
      programmeUrl: "https://www.example.com/programmes/data-science-01",
      programme: "<h1>Programme Data Science</h1><p>Formation aux fondamentaux de la data science</p>",
      categorie: {
        id: "2",
        code: "DATA",
        titre: "Data Science & IA",
        description: "Formations en science des données et intelligence artificielle",
      },
      categorieId: "2",
      createdAt: new Date('2023-06-15'),
      updatedAt: new Date('2023-10-05')
    },
    {
      id: "3",
      code: "SM-DEVOPS-01",
      type: "sur-mesure",
      titre: "DevOps pour entreprise",
      description: "Formation sur mesure adaptée aux besoins spécifiques de votre entreprise en matière de DevOps.",
      niveau: "Avancé",
      participants: "4 à 8 personnes",
      duree: "28 heures",
      prix: "Sur devis",
      objectifs: [
        "Mettre en place une chaîne CI/CD adaptée à votre environnement",
        "Maîtriser les outils DevOps spécifiques à votre infrastructure",
        "Optimiser les processus de déploiement"
      ],
      prerequis: "Expérience en administration système et développement",
      modalites: "Formation en intra-entreprise",
      pictogramme: "🔄",
      estActif: false,
      contenuDetailleHtml: "<h2>Module 1: CI/CD avec GitLab</h2><p>Configuration, pipelines, automatisation</p>",
      publicConcerne: "Équipes techniques de l'entreprise",
      contenuDetailleJours: "Jour 1-2: CI/CD, Jour 3: Conteneurs, Jour 4: Monitoring",
      modalitesAcces: "Formation réservée aux collaborateurs de l'entreprise",
      modalitesTechniques: "Environnement technique de l'entreprise",
      modalitesReglement: "Facturation après la formation",
      formateur: "Expert DevOps sénior",
      ressourcesDisposition: "Documentation technique, scripts, exercices pratiques",
      modalitesEvaluation: "Mise en situation réelle",
      sanctionFormation: "Attestation de compétences DevOps",
      niveauCertification: "N/A",
      delaiAcceptation: "30 jours avant le début",
      accessibiliteHandicap: "Adaptable selon les besoins spécifiques",
      cessationAbandon: "Voir conditions contractuelles",
      beneficiaireId: "client-123",
      objectifsSpecifiques: "Réduire le temps de déploiement de 75% sur les applications critiques",
      positionnementRequestId: "pos-456",
      programmeUrl: "https://www.example.com/programmes/sm-devops-01",
      programme: "<h1>Programme DevOps Personnalisé</h1><p>Formation adaptée aux besoins de l'entreprise</p>",
      categorie: {
        id: "3",
        code: "DEVOPS",
        titre: "DevOps & Cloud",
        description: "Formations en DevOps et technologies cloud",
      },
      categorieId: "3",
      createdAt: new Date('2023-09-01'),
      updatedAt: new Date('2023-11-20')
    }
  ];

  const fetchProgrammes = async () => {
    try {
      setLoading(true);
      console.log('Récupération des programmes de formation publiés...');
      const response = await api.get('/api/programmes-formation/catalogue');
      console.log('Programmes récupérés:', response.data);
      setProgrammes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des programmes de formation:', error);
      toast({
        title: 'Mode démonstration',
        description: 'Affichage de données simulées pour la démonstration',
      });
      // Utiliser des données simulées si l'API n'est pas disponible
      setProgrammes(MOCK_PROGRAMMES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const createProgramme = async (
    programmeData: Omit<ProgrammeFormation, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      const response = await api.post('/api/programmes-formation', programmeData);
      const newProgramme = response.data;
      setProgrammes(prev => [newProgramme, ...prev]);
      toast({
        title: 'Programme créé',
        description: `Programme "${newProgramme.titre}" créé avec succès`,
      });
      return newProgramme;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateProgramme = async (id: string, programmeData: Partial<ProgrammeFormation>) => {
    try {
      const response = await api.put(`/api/programmes-formation/${id}`, programmeData);
      const updated = response.data;
      setProgrammes(prev => prev.map(p => (p.id === id ? updated : p)));
      toast({
        title: 'Programme mis à jour',
        description: `Programme "${updated.titre}" mis à jour`,
      });
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteProgramme = async (id: string) => {
    try {
      const programme = programmes.find(p => p.id === id);
      await api.delete(`/api/programmes-formation/${id}`);
      setProgrammes(prev => prev.filter(p => p.id !== id));
      toast({
        title: 'Programme supprimé',
        description: `Programme "${programme?.titre}" supprimé avec succès`,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        title: 'Erreur',
        description: 'Impossible de supprimer le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Récupérer les catégories de programmes
  const [categories, setCategories] = useState<ProgrammeFormation["categorie"][]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get('/api/categories-programme');
      setCategories(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des catégories:', error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtrer les programmes par catégorie
  const getProgrammesByCategorie = (categorieId: string) => {
    return programmes.filter(prog => prog.categorieId === categorieId);
  };

  // Filtrer les programmes par type
  const getProgrammesByType = (type: "catalogue" | "sur-mesure") => {
    return programmes.filter(prog => prog.type === type);
  };

  // Dupliquer un programme (catalogue vers sur-mesure ou vice-versa)
  const duplicateProgramme = async (id: string, modificationData: Partial<ProgrammeFormation>) => {
    try {
      console.log('duplicateProgramme appelé avec id:', id, 'et modifications:', modificationData);
      
      // Récupérer le programme source
      const sourceProgramme = programmes.find(p => p.id === id);
      if (!sourceProgramme) {
        console.error('Programme source introuvable avec id:', id);
        throw new Error('Programme source introuvable');
      }
      console.log('Programme source trouvé:', sourceProgramme);

      // Créer un nouveau programme basé sur le programme source avec les modifications
      const duplicateData = {
        ...sourceProgramme,
        ...modificationData,
        id: undefined // Le backend va générer un nouvel ID
      };
      console.log('Données pour duplication préparées:', duplicateData);

      // Essayons d'abord une approche alternative si l'API originale échoue
      let response;
      try {
        // Approche 1: Endpoint spécifique de duplication
        console.log('Tentative d\'appel API 1: /api/programmes-formation/duplicate');
        response = await api.post('/api/programmes-formation/duplicate', { 
          sourceId: id,
          newData: duplicateData
        });
      } catch (dupError) {
        console.warn('Première tentative échouée, essai avec création standard...', dupError);
        
        // Approche 2: Créer un nouveau programme avec les données dupliquées
        console.log('Tentative d\'appel API 2: /api/programmes-formation (création standard)');
        const newProgrammeData = {
          ...duplicateData,
          id: undefined,
          createdAt: undefined,
          updatedAt: undefined
        };
        response = await api.post('/api/programmes-formation', newProgrammeData);
      }

      const duplicatedProgramme = response.data;
      console.log('Programme dupliqué avec succès:', duplicatedProgramme);
      
      setProgrammes(prev => [duplicatedProgramme, ...prev]);

      toast({
        title: 'Programme dupliqué',
        description: `Programme "${duplicatedProgramme.titre}" créé avec succès`,
      });

      return duplicatedProgramme;
    } catch (error) {
      console.error('Erreur lors de la duplication:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de dupliquer le programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  // Mettre à jour le statut d'un programme (actif/inactif)
  const updateProgrammeStatus = async (id: string, { estActif }: { estActif: boolean }) => {
    console.log('updateProgrammeStatus appelé avec id:', id, 'estActif:', estActif);
    try {
      // Récupérer le programme pour les logs
      const programme = programmes.find(p => p.id === id);
      console.log('Programme trouvé pour mise à jour de statut:', programme);
      
      // Essayer plusieurs approches en cas d'échec
      let response;
      try {
        // Approche 1: Endpoint dédié au statut
        console.log('Tentative API 1: PATCH /api/programmes-formation/:id/status');
        response = await api.patch(`/api/programmes-formation/${id}/status`, { estActif });
      } catch (statusError) {
        console.warn('Première tentative échouée, essai avec mise à jour standard...', statusError);
        
        // Approche 2: Update standard
        console.log('Tentative API 2: PUT /api/programmes-formation/:id (update standard)');
        response = await api.put(`/api/programmes-formation/${id}`, { estActif });
      }
      
      const updated = response.data;
      console.log('Programme mis à jour avec succès:', updated);
      
      // Mettre à jour l'état local avant la notification
      setProgrammes(prev => prev.map(p => (p.id === id ? updated : p)));
      console.log('Liste des programmes mise à jour');
      
      toast({
        title: estActif ? 'Programme activé' : 'Programme désactivé',
        description: `Le statut du programme a été mis à jour`,
      });
      
      return updated;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le statut du programme',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    programmes,
    loading,
    createProgramme,
    updateProgramme,
    deleteProgramme,
    duplicateProgramme,
    updateProgrammeStatus,
    categories,
    loadingCategories,
    getProgrammesByCategorie,
    getProgrammesByType,
    refreshProgrammes: fetchProgrammes
  };
};
