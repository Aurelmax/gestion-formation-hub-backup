import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  console.log('🔍 Vérification des catégories existantes...');
  
  const existingCategories = await prisma.categorieProgramme.findMany();
  console.log(`📊 ${existingCategories.length} catégories trouvées`);
  
  if (existingCategories.length === 0) {
    console.log('➕ Création des catégories par défaut...');
    
    const categories = [
      {
        code: 'wordpress',
        titre: 'WordPress',
        description: 'Formation et développement WordPress',
        ordre: 1
      },
      {
        code: 'web',
        titre: 'Développement Web',
        description: 'HTML, CSS, JavaScript et frameworks modernes',
        ordre: 2
      },
      {
        code: 'design',
        titre: 'Design & UX/UI',
        description: 'Design graphique et expérience utilisateur',
        ordre: 3
      },
      {
        code: 'marketing',
        titre: 'Marketing Digital',
        description: 'SEO, réseaux sociaux et marketing en ligne',
        ordre: 4
      },
      {
        code: 'gestion',
        titre: 'Gestion de Projet',
        description: 'Management et organisation de projets',
        ordre: 5
      }
    ];

    for (const category of categories) {
      await prisma.categorieProgramme.create({ data: category });
      console.log(`✅ Catégorie créée: ${category.titre}`);
    }
  } else {
    console.log('📋 Catégories existantes:');
    for (const cat of existingCategories) {
      console.log(`  - ${cat.titre} (${cat.code})`);
    }
  }
}

main()
  .catch(e => {
    console.error('❌ Erreur:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('✨ Script terminé');
  });