import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si la catégorie existe, sinon la créer
  let categorie = await prisma.categorieProgramme.findUnique({
    where: { code: 'WEB-DEV' }
  });

  if (!categorie) {
    categorie = await prisma.categorieProgramme.create({
      data: {
        id: uuidv4(),
        code: 'WEB-DEV',
        titre: 'Conception et gestion de site web',
        description: 'Formations en développement web et gestion de contenu'
      }
    });
  }

  // Créer la formation
  const formation = await prisma.programmeFormation.create({
    data: {
      id: uuidv4(),
      code: 'A001-WP-DD',
      type: 'Catalogue',
      typeProgramme: 'Développement Web',
      titre: 'Création site internet (WordPress) & Stratégie de développement Digital',
      description: 'Formation complète sur la création de sites WordPress et la stratégie digitale associée.',
      duree: '5 jours',
      prix: '2500€',
      niveau: 'Débutant/Intermédiaire',
      participants: '3-8 personnes',
      objectifs: [
        'Maîtriser WordPress',
        'Comprendre les enjeux du développement digital',
        'Mettre en place une stratégie digitale efficace'
      ],
      prerequis: 'Connaissances de base en informatique et navigation web',
      publicConcerne: 'Professionnels souhaitant créer ou gérer un site WordPress',
      contenuDetailleJours: 'Jour 1: Introduction à WordPress\nJour 2: Thèmes et personnalisation\nJour 3: Plugins et fonctionnalités avancées\nJour 4: Référencement et performance\nJour 5: Stratégie digitale et analyse',
      modalites: 'Présentiel ou distanciel',
      modalitesAcces: 'Accessible aux personnes en situation de handicap',
      modalitesTechniques: 'Ordinateur avec connexion internet',
      modalitesReglement: 'Paiement à l\\'inscription',
      formateur: 'Expert WordPress certifié',
      ressourcesDisposition: 'Support de cours, accès à un espace de formation en ligne',
      modalitesEvaluation: 'Exercices pratiques et projet final',
      sanctionFormation: 'Attestation de formation',
      niveauCertification: 'Non certifiante',
      accessibiliteHandicap: 'Accessible',
      categorie: {
        connect: { id: categorie.id }
      }
    }
  });

  console.log('Formation créée avec succès:', formation);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
