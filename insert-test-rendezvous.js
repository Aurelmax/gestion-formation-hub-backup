// Script pour insérer un rendez-vous de test
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createTestRendezvous = async () => {
  try {
    // Vérifier si un rendez-vous avec le même email existe déjà
    const existingRendezvous = await prisma.rendezvous.findFirst({
      where: {
        email: 'test@exemple.fr'
      }
    });

    if (existingRendezvous) {
      console.log('Un rendez-vous de test existe déjà:', existingRendezvous.id);
      return;
    }

    // Créer un nouveau rendez-vous de test
    const rendezvous = await prisma.rendezvous.create({
      data: {
        type: "positionnement",
        status: "nouveau",
        prenom: "Test",
        nom: "Utilisateur",
        email: "test@exemple.fr",
        telephone: "0612345678",
        objectifs: "Test de la base de données",
        competencesActuelles: "Débutant",
        niveau: "Débutant",
        formatSouhaite: "distanciel",
        disponibilites: "Après-midi",
        commentaires: "Rendez-vous créé par script de test",
        formationTitre: "Formation WordPress",
        formationSelectionnee: "wordpress-fondamentaux",
        situationActuelle: "Salarié",
        pratiqueActuelle: "Débutant",
        isFinancement: false,
        hasHandicap: false,
        entreprise: "Entreprise Test",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('Rendez-vous créé avec succès:', rendezvous.id);
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
  } finally {
    await prisma.$disconnect();
  }
};

createTestRendezvous();
