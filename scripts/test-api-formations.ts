import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testAPI() {
  console.log('=== TEST API FORMATIONS ===\n');

  try {
    // 1. Tester les données directement en base
    console.log('1. TEST DIRECT BASE DE DONNÉES:');
    const categories = await prisma.categorieProgramme.findMany({
      orderBy: { ordre: 'asc' },
      include: {
        programmes: {
          where: {
            type: 'catalogue',
            estActif: true,
            estVisible: true
          },
          orderBy: { dateCreation: 'desc' }
        }
      }
    });

    console.log(`Catégories trouvées: ${categories.length}`);
    
    const formattedCategories = categories
      .filter(category => category.programmes.length > 0)
      .map(category => ({
        id: category.id,
        titre: category.titre,
        description: category.description,
        formations: category.programmes.map(programme => ({
          id: programme.id,
          titre: programme.titre,
          description: programme.description,
          duree: programme.duree,
          prix: programme.prix,
          niveau: programme.niveau,
          participants: programme.participants,
          objectifs: programme.objectifs || [],
          prerequis: programme.prerequis,
          modalites: programme.modalites,
          programmeUrl: `/formations/${programme.id}`
        }))
      }));

    console.log('✅ Données formatées prêtes:');
    formattedCategories.forEach(cat => {
      console.log(`- ${cat.titre}: ${cat.formations.length} formations`);
      cat.formations.forEach(form => {
        console.log(`  • ${form.titre} (${form.duree}, ${form.prix})`);
      });
    });

    console.log('\n2. SIMULATION DE L\'APPEL API:');
    console.log('URL attendue par le front: /api/programmes-formation/par-categorie/groupes');
    console.log(`Données qui seraient retournées: ${JSON.stringify(formattedCategories).length} caractères`);

    if (formattedCategories.length > 0) {
      console.log('\n🎉 SUCCÈS! L\'API devrait maintenant retourner des données au front-end');
      console.log('\n=== PROCHAINES ÉTAPES ===');
      console.log('1. Démarrer le serveur: npm run dev');
      console.log('2. Tester l\'URL: http://localhost:3000/api/programmes-formation/par-categorie/groupes');
      console.log('3. Vérifier l\'affichage sur le catalogue: http://localhost:3000/catalogue');
    } else {
      console.log('\n❌ PROBLÈME: Aucune catégorie avec formations trouvée');
    }

  } catch (error) {
    console.error('❌ ERREUR lors du test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();