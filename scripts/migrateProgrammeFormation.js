const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Initialisation du client Prisma
const prisma = new PrismaClient();

// Structure des données du catalogue - Extrait de Catalogue.tsx
const categoriesFormations = [
  {
    id: "digital",
    titre: "Maîtrisez les Bases du Digital",
    description: "Des formations essentielles pour débuter dans l'univers du digital et acquérir des compétences fondamentales.",
    formations: [
      {
        id: "A001-WP-DD",
        titre: "CRÉATION DE SON SITE INTERNET (WORDPRESS) + STRATÉGIE DE DÉVELOPPEMENT DIGITAL",
        description: "Formation complète pour créer et gérer un site WordPress et développer une stratégie digitale efficace pour votre activité.",
        duree: "14 heures (2 jours)",
        prix: "980€",
        niveau: "Débutant",
        participants: "Artisans, commerçants ou professions libérales",
        objectifs: [
          "Créer et personnaliser un site internet avec WordPress",
          "Gérer le contenu et la structure du site",
          "Définir une stratégie de développement digital",
          "Mettre en œuvre des actions SEO et réseaux sociaux"
        ],
        prerequis: "Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur",
        modalites: "Présentiel",
        tauxParticipation: "98%",
        tauxReussite: "94%",
        programmeUrl: "/programmes/A001-WP-DD-programme.html"
      },
      {
        id: "A010-WP-IM",
        titre: "CRÉER ET GÉRER UN SITE WORDPRESS & STRATÉGIE DE CONTENU INBOUND MARKETING",
        description: "Apprenez à créer et gérer un site WordPress tout en développant une stratégie de contenu efficace basée sur l'Inbound Marketing.",
        duree: "14 heures (2 jours)",
        prix: "980€",
        niveau: "Débutant",
        participants: "Artisans, commerçants ou professions libérales",
        objectifs: [
          "Créer et gérer un site WordPress",
          "Développer une stratégie de contenu Inbound Marketing",
          "Attirer et convertir des prospects",
          "Mesurer les performances de votre stratégie"
        ],
        prerequis: "Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur",
        modalites: "Présentiel",
        tauxParticipation: "97%",
        tauxReussite: "93%",
        programmeUrl: "/programmes/A010-WP-IM-programme.html"
      },
      {
        id: "A015-IA-CGPT",
        titre: "GÉNÉRATION DE CONTENU AVEC CHATGPT + AUTOMATISATION MARKETING",
        description: "Maîtrisez les techniques de génération de contenu avec ChatGPT et mettez en place des stratégies d'automatisation marketing efficaces.",
        duree: "14 heures (2 jours)",
        prix: "980€",
        niveau: "Débutant à intermédiaire",
        participants: "Artisans, commerçants ou professions libérales",
        objectifs: [
          "Comprendre les fondamentaux de ChatGPT",
          "Créer des contenus optimisés pour le web et les réseaux sociaux",
          "Mettre en place des stratégies d'automatisation marketing",
          "Utiliser des outils comme ChatGPT, Brevo et Make"
        ],
        prerequis: "Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur",
        modalites: "Présentiel ou distanciel",
        tauxParticipation: "96%",
        tauxReussite: "92%",
        programmeUrl: "/programmes/A015-IA-CGPT-programme-optimise.html"
      },
      {
        id: "A016-RE-HL",
        titre: "BACKEND HEADLESS AVEC WORDPRESS ET FRONTEND REACT",
        description: "Développez des applications modernes en utilisant WordPress comme backend headless et React pour créer des interfaces utilisateur dynamiques et performantes.",
        duree: "35 heures (5 jours)",
        prix: "2450€",
        niveau: "Avancé",
        participants: "Développeurs web, intégrateurs, freelances",
        objectifs: [
          "Configurer WordPress comme API headless",
          "Développer une application frontend avec React",
          "Connecter React à l'API WordPress REST",
          "Déployer et maintenir une architecture headless"
        ],
        prerequis: "Connaissances en développement web et notions de JavaScript",
        modalites: "Présentiel ou distanciel",
        tauxParticipation: "92%",
        tauxReussite: "88%",
        programmeUrl: "/programmes/A016-RE-HL-programme.html"
      }
    ]
  }
];

// Valeurs par défaut pour les champs obligatoires non présents dans le catalogue
const defaultFormationValues = {
  publicConcerne: "Artisans, commerçants, professions libérales et TPE/PME",
  contenuDetailleJours: "Contenu détaillé à compléter",
  modalitesAcces: "Inscription requise 2 semaines avant le début de la formation",
  modalitesTechniques: "Ordinateur avec accès internet, navigateur récent",
  modalitesReglement: "Par virement, espèces ou carte bancaire",
  formateur: "Aurélien Lien",
  ressourcesDisposition: "Support de cours, exercices pratiques, accès à une plateforme en ligne",
  modalitesEvaluation: "Exercices pratiques et QCM en fin de formation",
  sanctionFormation: "Attestation de formation",
  niveauCertification: "Non certifiante",
  delaiAcceptation: "15 jours avant le début de la formation",
  accessibiliteHandicap: "Formation accessible aux personnes en situation de handicap. Contactez notre référent handicap pour adapter le parcours.",
  cessationAbandon: "En cas d'abandon, facturation des heures suivies. Report possible sur une session ultérieure.",
  pictogramme: "💻",
};

/**
 * Fonction principale de migration
 */
async function migrateProgrammes() {
  try {
    console.log('Début de la migration des données vers ProgrammeFormation...');

    // 1. Création des catégories
    console.log('Création des catégories...');
    const categoriesMap = new Map();
    
    for (const categorie of categoriesFormations) {
      const categorieDb = await prisma.categorieProgramme.create({
        data: {
          code: categorie.id,
          titre: categorie.titre,
          description: categorie.description,
          ordre: 0
        }
      });
      categoriesMap.set(categorie.id, categorieDb.id);
      console.log(`Catégorie créée: ${categorie.titre} (${categorieDb.id})`);
    }

    // 2. Migration des formations du catalogue
    console.log('\nMigration des formations du catalogue...');
    let totalImported = 0;

    for (const categorie of categoriesFormations) {
      const categorieId = categoriesMap.get(categorie.id);
      
      for (const formation of categorie.formations) {
        // Vérifier si le programme existe déjà
        const existingProgramme = await prisma.programmeFormation.findFirst({
          where: { code: formation.id }
        });

        if (existingProgramme) {
          console.log(`Programme ${formation.id} existe déjà, passage au suivant...`);
          continue;
        }

        // Créer le programme
        await prisma.programmeFormation.create({
          data: {
            code: formation.id,
            type: "catalogue",
            titre: formation.titre,
            description: formation.description,
            duree: formation.duree,
            prix: formation.prix,
            niveau: formation.niveau,
            participants: formation.participants,
            objectifs: formation.objectifs,
            prerequis: formation.prerequis,
            modalites: formation.modalites,
            programmeUrl: formation.programmeUrl || null,
            categorieId: categorieId,
            // Valeurs par défaut pour les champs obligatoires
            ...defaultFormationValues,
            publicConcerne: formation.participants || defaultFormationValues.publicConcerne,
          }
        });

        console.log(`Programme importé: ${formation.titre} (${formation.id})`);
        totalImported++;
      }
    }

    console.log(`\nTotal des programmes importés depuis le catalogue: ${totalImported}`);

    // 3. Migration des programmes personnalisés
    console.log('\nMigration des programmes personnalisés...');
    const programmesPersonnalises = await prisma.programmePersonnalise.findMany();
    let totalPersImported = 0;

    for (const programme of programmesPersonnalises) {
      // Vérifier si le programme a déjà été importé
      const existingProgramme = await prisma.programmeFormation.findFirst({
        where: { 
          positionnementRequestId: programme.positionnementId 
        }
      });

      if (existingProgramme) {
        console.log(`Programme personnalisé lié au positionnement ${programme.positionnementId} existe déjà, passage au suivant...`);
        continue;
      }

      // Générer un code unique pour le programme personnalisé
      const code = `P${String(programme.id).substring(0, 8)}`;

      try {
        // Récupérer la demande de positionnement
        const positionnement = programme.positionnementId ? 
          await prisma.positionnementRequest.findUnique({
            where: { id: programme.positionnementId }
          }) : null;

        // Créer le programme dans le nouveau modèle
        await prisma.programmeFormation.create({
          data: {
            code: code,
            type: "sur-mesure",
            titre: programme.titre,
            description: programme.description || 'Programme personnalisé',
            duree: programme.duree || '14 heures',
            prix: programme.tarif || 'Sur devis',
            niveau: programme.niveau || 'Adapté',
            participants: '1 à 3 participants',
            objectifs: programme.objectifs || [],
            prerequis: programme.prerequis || 'À définir avec le formateur',
            modalites: programme.modaliteFormation || 'Présentiel et distanciel',
            contenuDetailleJours: programme.contenuDetaille || defaultFormationValues.contenuDetailleJours,
            publicConcerne: programme.publicCible || defaultFormationValues.publicConcerne,
            positionnementRequestId: programme.positionnementId,
            beneficiaireId: positionnement ? `${positionnement.nomBeneficiaire} ${positionnement.prenomBeneficiaire}` : null,
            objectifsSpecifiques: positionnement ? positionnement.attentes : null,
            // Valeurs par défaut pour les champs obligatoires
            ...defaultFormationValues
          }
        });

        console.log(`Programme personnalisé importé: ${programme.titre} (${code})`);
        totalPersImported++;
      } catch (error) {
        console.error(`Erreur lors de l'importation du programme personnalisé ${programme.id}:`, error);
      }
    }

    console.log(`\nTotal des programmes personnalisés importés: ${totalPersImported}`);
    console.log('\nMigration terminée avec succès!');

  } catch (error) {
    console.error('Erreur lors de la migration:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateProgrammes()
  .catch(e => {
    console.error('Erreur non gérée:', e);
    process.exit(1);
  });
