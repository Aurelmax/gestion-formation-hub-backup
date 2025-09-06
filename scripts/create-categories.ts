import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const categories = [
  {
    code: 'WEB_CONCEPTION',
    titre: 'Conception et gestion de site web',
    description: 'Formation sur la création, développement et gestion de sites web',
    ordre: 1
  },
  {
    code: 'DIGI_RELATION',
    titre: 'Relation client et communication digitale', 
    description: 'Formation sur la communication digitale et relation client en ligne',
    ordre: 2
  },
  {
    code: 'WEB_EXPLOIT_SEC',
    titre: 'Exploitation, maintenance et sécurité d\'un site',
    description: 'Formation sur l\'exploitation, maintenance et sécurité des sites web',
    ordre: 3
  }
];

async function main() {
  try {
    console.log('🚀 Création des catégories de programmes de formation...');
    console.log('====================================================');
    
    for (const categorieData of categories) {
      // Vérifier si la catégorie existe déjà
      const existingCategorie = await prisma.categorieProgramme.findUnique({
        where: { code: categorieData.code }
      });
      
      if (existingCategorie) {
        console.log(`⏭️  Catégorie ${categorieData.code} existe déjà, mise à jour...`);
        await prisma.categorieProgramme.update({
          where: { code: categorieData.code },
          data: {
            titre: categorieData.titre,
            description: categorieData.description,
            ordre: categorieData.ordre
          }
        });
        console.log(`✅ Catégorie ${categorieData.code} mise à jour`);
      } else {
        console.log(`➕ Création de la catégorie ${categorieData.code}...`);
        await prisma.categorieProgramme.create({
          data: categorieData
        });
        console.log(`✅ Catégorie ${categorieData.code} créée`);
      }
    }
    
    console.log('\n📊 Résumé des catégories créées:');
    const allCategories = await prisma.categorieProgramme.findMany({
      orderBy: { ordre: 'asc' }
    });
    
    allCategories.forEach(cat => {
      console.log(`  • ${cat.code} - ${cat.titre} (Ordre: ${cat.ordre})`);
    });
    
    console.log(`\n🎉 ${categories.length} catégories traitées avec succès!`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des catégories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();