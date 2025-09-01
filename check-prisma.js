// Script pour vérifier ce que le client Prisma expose réellement
import { PrismaClient } from '@prisma/client';

async function checkPrismaModels() {
  const prisma = new PrismaClient();

  console.log('=== VÉRIFICATION DES MODÈLES PRISMA ===');

  // Liste de tous les modèles attendus dans le schéma
  const expectedModels = [
    'formation',
    'reclamation',
    'positionnementRequest',
    'documentFormation',
    'dossierFormation',
    'actionCorrective',
    'user',
    'categorieProgramme',
    'historiqueActionCorrective',
    'programmeFormation',
    'competence',
    'rendezvous'
  ];

  try {
    // Vérifier quelles propriétés sont disponibles sur le client Prisma
    console.log('Propriétés disponibles sur le client Prisma:');
    const clientProperties = Object.keys(prisma);
    console.log(clientProperties);

    // Vérifier chaque modèle attendu
    console.log('\nVérification des modèles attendus:');
    for (const model of expectedModels) {
      // Vérifier si le modèle existe directement sur le client
      const exists = model in prisma;
      
      // Vérifier le nom réel en fonction des conventions Prisma (camelCase ou autre)
      let actualModelName = null;
      if (!exists) {
        // Essayer de trouver un nom alternatif
        for (const prop of clientProperties) {
          if (prop.toLowerCase() === model.toLowerCase()) {
            actualModelName = prop;
            break;
          }
        }
      }
      
      console.log(`${model}: ${exists ? '✅ Disponible' : '❌ Non disponible'}${actualModelName ? ` (trouvé comme: ${actualModelName})` : ''}`);
    }

    // Afficher les détails complets du client Prisma pour l'analyse
    console.log('\nDétails complets du client Prisma:');
    console.log(JSON.stringify(Object.getOwnPropertyNames(prisma), null, 2));

    // Quelques vérifications supplémentaires sur les modèles importants
    try {
      // Vérifier si la table existe en effectuant une requête
      const categorieCount = await prisma.$queryRaw`SELECT count(*) FROM categories_programme`;
      console.log('Catégories trouvées dans la base:', categorieCount);
    } catch (e) {
      console.log('Erreur lors de la vérification des catégories:', e.message);
    }

    try {
      // Vérifier la table compétences
      const competenceCount = await prisma.$queryRaw`SELECT count(*) FROM competences`;
      console.log('Compétences trouvées dans la base:', competenceCount);
    } catch (e) {
      console.log('Erreur lors de la vérification des compétences:', e.message);
    }

  } catch (error) {
    console.error('Erreur générale:', error);
  } finally {
    // Fermer la connexion
    await prisma.$disconnect();
  }
}

// Exécuter la fonction
checkPrismaModels().catch(console.error);