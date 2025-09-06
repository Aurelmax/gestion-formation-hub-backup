import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('=== VÉRIFICATION DE LA BASE DE DONNÉES ===\n');

    // 1. Vérifier les catégories de programmes
    console.log('📂 CATÉGORIES DE PROGRAMMES:');
    const categories = await prisma.categorieProgramme.findMany({
      orderBy: { ordre: 'asc' }
    });
    console.log(`Nombre total: ${categories.length}`);
    categories.forEach(cat => {
      console.log(`- ${cat.code}: ${cat.titre} (ordre: ${cat.ordre})`);
    });
    console.log('');

    // 2. Vérifier les programmes de formation
    console.log('📚 PROGRAMMES DE FORMATION:');
    const programmes = await prisma.programmeFormation.findMany({
      include: {
        categorie: true
      },
      orderBy: { dateCreation: 'desc' }
    });
    console.log(`Nombre total: ${programmes.length}`);
    
    const programmesActifs = programmes.filter(p => p.estActif);
    const programmesVisibles = programmes.filter(p => p.estVisible);
    const programmesCatalogue = programmes.filter(p => p.type === 'catalogue');
    const programmesSurMesure = programmes.filter(p => p.type === 'sur-mesure');

    console.log(`Actifs: ${programmesActifs.length}/${programmes.length}`);
    console.log(`Visibles: ${programmesVisibles.length}/${programmes.length}`);
    console.log(`Type catalogue: ${programmesCatalogue.length}`);
    console.log(`Type sur-mesure: ${programmesSurMesure.length}`);
    console.log('');

    // Détail des programmes par catégorie
    console.log('📋 PROGRAMMES PAR CATÉGORIE:');
    for (const cat of categories) {
      const progsCat = programmes.filter(p => p.categorieId === cat.id);
      const progsActifsCat = progsCat.filter(p => p.estActif && p.estVisible);
      console.log(`${cat.titre}: ${progsActifsCat.length}/${progsCat.length} programmes actifs/visibles`);
      
      progsActifsCat.forEach(prog => {
        console.log(`  - ${prog.code}: ${prog.titre} (${prog.type})`);
      });
      
      if (progsCat.length > progsActifsCat.length) {
        const progsInactifs = progsCat.filter(p => !p.estActif || !p.estVisible);
        console.log(`  Inactifs/invisibles: ${progsInactifs.length}`);
        progsInactifs.forEach(prog => {
          console.log(`    - ${prog.code}: ${prog.titre} (actif: ${prog.estActif}, visible: ${prog.estVisible})`);
        });
      }
      console.log('');
    }

    // 3. Vérifier les formations (table séparée)
    console.log('🎓 FORMATIONS (table séparée):');
    try {
      const formations = await prisma.formation.findMany();
      console.log(`Nombre total: ${formations.length}`);
      formations.forEach(form => {
        console.log(`- ${form.code}: ${form.libelle}`);
      });
    } catch (error) {
      console.log('Erreur lors de la récupération des formations:', error);
    }
    console.log('');

    // 4. Programmes avec contenu HTML détaillé
    console.log('🌐 PROGRAMMES AVEC CONTENU HTML:');
    const programmesAvecHtml = programmes.filter(p => p.programmeUrl);
    console.log(`Programmes avec URL: ${programmesAvecHtml.length}`);
    programmesAvecHtml.forEach(prog => {
      console.log(`- ${prog.code}: ${prog.programmeUrl}`);
    });
    console.log('');

    // 5. Statistiques générales
    console.log('📊 STATISTIQUES:');
    console.log(`Programmes prêts pour publication (actif + visible + catalogue): ${programmes.filter(p => p.estActif && p.estVisible && p.type === 'catalogue').length}`);
    console.log(`Programmes avec catégorie assignée: ${programmes.filter(p => p.categorieId).length}`);
    console.log(`Programmes sans catégorie: ${programmes.filter(p => !p.categorieId).length}`);

  } catch (error) {
    console.error('Erreur lors de la vérification de la base de données:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();