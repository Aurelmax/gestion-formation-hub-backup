import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'node-html-parser';

const prisma = new PrismaClient();

// Mappage des catégories basé sur le préfixe du code de formation
const getCategorieByCode = (code: string) => {
  const prefix = code.split('-')[1];
  switch(prefix) {
    case 'WP': return 'WEB-DEV';  // WordPress
    case 'BD': return 'WEB-DEV';  // Base de données
    case 'SW': return 'WEB-DEV';  // Développement web
    case 'CV': return 'WEB-DEV';  // Création de site vitrine
    case 'FB': return 'digital';  // Formation bureautique
    case 'IA': return 'digital';  // Intelligence artificielle
    case 'RE': return 'WEB-DEV';  // React/JavaScript
    default: return 'digital';
  }
};

async function importProgrammes() {
  try {
    console.log('Début de l\'import des programmes de formation...');
    
    const programmesDir = path.join(process.cwd(), 'public/programmes/ml');
    const files = fs.readdirSync(programmesDir)
      .filter(file => file.endsWith('.html') && !file.includes('template') && !file.includes('exemple'));

    console.log(`Trouvé ${files.length} fichiers de programme`);

    for (const file of files) {
      const filePath = path.join(programmesDir, file);
      const html = fs.readFileSync(filePath, 'utf8');
      const root = parse(html);
      
      // Extraire les informations du fichier HTML
      const titre = root.querySelector('h2')?.text.trim() || '';
      const code = file.split('-programme.html')[0];
      const categorieCode = getCategorieByCode(code);
      
      // Extraire les objectifs (si disponibles)
      const objectifsSection = Array.from(root.querySelectorAll('h2'))
        .find(h2 => h2.text.includes('Objectifs'));
      
      let objectifs: string[] = [];
      if (objectifsSection) {
        const nextElement = objectifsSection.nextElementSibling;
        if (nextElement) {
          // Essayer d'extraire les objectifs des listes ou paragraphes
          const listItems = nextElement.querySelectorAll('li');
          if (listItems.length > 0) {
            objectifs = listItems.map(li => li.text.trim());
          } else {
            // Si pas de liste, essayer de diviser le texte
            objectifs = nextElement.text
              .split('\n')
              .map(s => s.trim())
              .filter(s => s.length > 0);
          }
        }
      }

      // Valeurs par défaut
      const programmeData = {
        code,
        type: 'catalogue',
        titre,
        description: titre, // À affiner si nécessaire
        duree: '14 heures (2 jours)', // Valeur par défaut à ajuster
        prix: '980€', // Valeur par défaut à ajuster
        niveau: 'Débutant', // Valeur par défaut à ajuster
        participants: 'Artisans, commerçants ou professions libérales',
        objectifs: objectifs.length > 0 ? objectifs : ['Développer des compétences numériques essentielles'],
        prerequis: 'Maîtriser son environnement et les fonctions de base pour utiliser un ordinateur',
        modalites: 'Présentiel',
        programmeUrl: `/programmes/ml/${file}`,
        publicConcerne: 'Artisans, commerçants ou professions libérales',
        modalitesAcces: 'Sur inscription',
        modalitesTechniques: 'Matériel fourni',
        modalitesReglement: 'À la fin de la formation',
        formateur: 'Aurélien LAVAYSSIERE - GESTIONMAX',
        ressourcesDisposition: 'Supports de formation numériques',
        modalitesEvaluation: 'Évaluation continue et questionnaire de satisfaction',
        sanctionFormation: 'Attestation de fin de formation',
        niveauCertification: 'Non certifiante',
        accessibiliteHandicap: 'Accessible aux personnes en situation de handicap',
        estActif: true,
        estVisible: true,
      };

      // Vérifier si le programme existe déjà
      const existingProgramme = await prisma.programmeFormation.findFirst({
        where: { code }
      });

      if (existingProgramme) {
        console.log(`Mise à jour du programme existant: ${code} - ${titre}`);
        await prisma.programmeFormation.update({
          where: { id: existingProgramme.id },
          data: programmeData
        });
      } else {
        // Récupérer l'ID de la catégorie
        const categorie = await prisma.categorieProgramme.findFirst({
          where: { code: categorieCode }
        });

        if (!categorie) {
          console.error(`Catégorie non trouvée pour le code: ${categorieCode}`);
          continue;
        }

        console.log(`Création du programme: ${code} - ${titre}`);
        await prisma.programmeFormation.create({
          data: {
            ...programmeData,
            categorie: {
              connect: { id: categorie.id }
            }
          }
        });
      }
    }

    console.log('Import des programmes terminé avec succès!');
  } catch (error) {
    console.error('Erreur lors de l\'import des programmes:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter l'import
importProgrammes()
  .catch(e => {
    console.error('Erreur non gérée:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
