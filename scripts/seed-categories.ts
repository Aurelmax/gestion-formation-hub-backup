import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedCategories() {
  const categories = [
    {
      code: 'WEB-DEV',
      titre: 'Conception et gestion de site web',
      description: 'Formations sur la création, la conception et la gestion de sites web',
      ordre: 1
    },
    {
      code: 'DIGITAL-COM',
      titre: 'Relation client et communication digitale',
      description: 'Formations sur la relation client et les stratégies de communication digitale',
      ordre: 2
    },
    {
      code: 'WEB-OPS',
      titre: 'Exploitation, maintenance et sécurité d\'un site',
      description: 'Formations sur l\'exploitation, la maintenance et la sécurité des sites web',
      ordre: 3
    }
  ];

  try {
    console.log('Début de l\'ajout des catégories...');
    
    for (const category of categories) {
      await prisma.categorieProgramme.upsert({
        where: { code: category.code },
        update: {},
        create: category
      });
      console.log(`✅ Catégorie ajoutée/mise à jour : ${category.titre}`);
    }
    
    console.log('✅ Toutes les catégories ont été ajoutées avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des catégories :', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
