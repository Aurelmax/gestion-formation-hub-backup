import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('🔄 Export des données en cours...');

    // Export des programmes de formation
    const programmes = await prisma.programmeFormation.findMany({
      include: {
        categorie: true
      }
    });

    // Export des catégories
    const categories = await prisma.categorieProgramme.findMany();

    // Export des positionnements
    const positionnements = await prisma.positionnementRequest.findMany();

    // Créer l'objet d'export
    const exportData = {
      timestamp: new Date().toISOString(),
      programmes: programmes,
      categories: categories,
      positionnements: positionnements,
      stats: {
        programmes_count: programmes.length,
        categories_count: categories.length,
        positionnements_count: positionnements.length
      }
    };

    // Sauvegarder en JSON
    const filename = `export-data-${new Date().toISOString().split('T')[0]}.json`;
    fs.writeFileSync(`exports/${filename}`, JSON.stringify(exportData, null, 2));

    console.log(`✅ Export terminé: exports/${filename}`);
    console.log(`📊 Statistiques:`);
    console.log(`   - ${programmes.length} programmes de formation`);
    console.log(`   - ${categories.length} catégories`);
    console.log(`   - ${positionnements.length} positionnements`);

  } catch (error) {
    console.error('❌ Erreur lors de l\'export:', error);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();