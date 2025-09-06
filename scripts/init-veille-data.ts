import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function initVeilleData() {
  try {
    console.log('=== INITIALISATION DES DONNÉES DE VEILLE ===\n');

    // Vérifier si des veilles existent déjà
    const veillesExistantes = await prisma.veille.count();
    if (veillesExistantes > 0) {
      console.log(`⚠️  ${veillesExistantes} veille(s) déjà présente(s) dans la base.`);
      console.log('Voulez-vous continuer et ajouter les données de test ? (les données existantes seront conservées)');
    }

    // Données de test
    const veillesTest = [
      {
        titre: "Nouvelle réglementation accessibilité RGAA 4.1",
        description: "Suivi des évolutions du Référentiel Général d'Amélioration de l'Accessibilité et des normes WCAG 2.1 AA",
        type: "reglementaire",
        statut: "en-cours",
        avancement: 65,
        dateEcheance: new Date("2024-06-15"),
        commentaires: [
          "Première analyse de la réglementation effectuée",
          "Contact pris avec l'expert accessibilité DGFIP",
          "Planning de mise en conformité établi"
        ],
        historique: [
          {
            action: "Création de la veille",
            details: "Veille créée suite à l'annonce des nouvelles normes",
            utilisateur: "Système"
          },
          {
            action: "Changement de statut",
            details: "Statut modifié de 'nouvelle' vers 'en-cours'",
            utilisateur: "Système"
          }
        ]
      },
      {
        titre: "WordPress 6.5 - Nouvelles fonctionnalités",
        description: "Analyse des nouvelles fonctionnalités WordPress et impact sur nos formations existantes",
        type: "metier",
        statut: "nouvelle",
        avancement: 15,
        commentaires: [
          "Téléchargement et installation de la version beta",
          "Test des nouvelles fonctionnalités identifiées"
        ],
        historique: [
          {
            action: "Création de la veille",
            details: "Veille créée pour analyser WordPress 6.5",
            utilisateur: "Système"
          }
        ]
      },
      {
        titre: "IA Générative et outils no-code - Impact formations",
        description: "Étude de l'impact de l'intelligence artificielle générative (ChatGPT, Claude, etc.) sur nos formations en développement web",
        type: "innovation",
        statut: "terminee",
        avancement: 100,
        dateEcheance: new Date("2024-02-28"),
        commentaires: [
          "Analyse complète des outils IA disponibles",
          "Formations mises à jour avec modules IA",
          "Guide d'utilisation créé pour les formateurs",
          "Retour très positif des apprenants"
        ],
        historique: [
          {
            action: "Création de la veille",
            details: "Veille créée pour analyser l'impact de l'IA",
            utilisateur: "Système"
          },
          {
            action: "Changement de statut",
            details: "Statut modifié de 'nouvelle' vers 'en-cours'",
            utilisateur: "Système"
          },
          {
            action: "Mise à jour avancement",
            details: "Avancement modifié de 50% vers 100%",
            utilisateur: "Système"
          },
          {
            action: "Changement de statut",
            details: "Statut modifié de 'en-cours' vers 'terminee'",
            utilisateur: "Système"
          }
        ]
      },
      {
        titre: "RGPD et formations - Mise à jour 2024",
        description: "Veille sur les évolutions réglementaires RGPD et adaptation de nos formations conformité",
        type: "reglementaire",
        statut: "en-cours",
        avancement: 30,
        dateEcheance: new Date("2024-04-30"),
        commentaires: [
          "Suivi des recommandations CNIL 2024",
          "Analyse des nouvelles sanctions"
        ],
        historique: [
          {
            action: "Création de la veille",
            details: "Veille RGPD 2024 créée",
            utilisateur: "Système"
          }
        ]
      }
    ];

    // Insérer les données
    for (const veilleData of veillesTest) {
      const { commentaires, historique, ...veilleBase } = veilleData;

      const veille = await prisma.veille.create({
        data: {
          ...veilleBase,
          commentaires: {
            createMany: {
              data: commentaires.map(contenu => ({
                contenu,
                utilisateur: "Système"
              }))
            }
          },
          historique: {
            createMany: {
              data: historique.map(h => ({
                action: h.action,
                details: h.details,
                utilisateur: h.utilisateur
              }))
            }
          }
        }
      });

      console.log(`✅ Veille créée: "${veille.titre}" (${veille.type})`);
    }

    console.log(`\n🎉 ${veillesTest.length} veilles de test créées avec succès !`);

    // Statistiques finales
    const stats = await prisma.veille.groupBy({
      by: ['type', 'statut'],
      _count: true
    });

    console.log('\n📊 STATISTIQUES DES VEILLES:');
    stats.forEach(stat => {
      console.log(`- ${stat.type} (${stat.statut}): ${stat._count} veille(s)`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
  } finally {
    await prisma.$disconnect();
  }
}

initVeilleData();