import { NextRequest, NextResponse } from 'next/server';

// Données de démonstration (en attendant l'intégration avec Prisma)
const demoData = [
  {
    id: '1',
    titre: 'Formation WordPress avancée - Jean Dupont',
    description: 'Programme personnalisé pour le positionnement du 15/08/2023',
    type: 'sur-mesure',
    modules: [
      {
        id: 'm1',
        titre: 'Introduction à WordPress',
        description: 'Bases et fondamentaux',
        duree: '3 heures',
        ordre: 1,
        objectifs: ['Comprendre l\'architecture', 'Installer WordPress'],
        prerequis: ['Connaissances web basiques'],
        contenu: ['Installation', 'Configuration initiale', 'Tableau de bord']
      },
      {
        id: 'm2',
        titre: 'Personnalisation avancée',
        description: 'Thèmes et templates',
        duree: '7 heures',
        ordre: 2,
        objectifs: ['Créer des thèmes personnalisés', 'Maîtriser les templates'],
        prerequis: ['Bases HTML/CSS'],
        contenu: ['Structure des thèmes', 'Hiérarchie des templates', 'Hooks et filtres']
      }
    ],
    rendezvousId: '101',
    beneficiaire: 'Jean Dupont',
    dateCreation: '2023-08-16T10:30:00Z',
    statut: 'brouillon',
    estValide: false
  },
  {
    id: '2',
    titre: 'Formation SEO pour webmarketing - Marie Martin',
    description: 'Programme personnalisé suite au rendez-vous d\'évaluation',
    type: 'sur-mesure',
    modules: [
      {
        id: 'm1',
        titre: 'Fondamentaux du SEO',
        description: 'Les bases du référencement',
        duree: '4 heures',
        ordre: 1,
        objectifs: ['Comprendre les algorithmes', 'Optimiser le contenu'],
        prerequis: ['Aucun'],
        contenu: ['Fonctionnement des moteurs', 'Mots-clés', 'Structure de site']
      }
    ],
    rendezvousId: '102',
    beneficiaire: 'Marie Martin',
    dateCreation: '2023-08-18T14:45:00Z',
    statut: 'valide',
    estValide: true,
    documentUrl: '/documents/programme-2.pdf'
  },
  {
    id: '3',
    titre: 'Formation React avancée - Pierre Durand',
    description: 'Programme personnalisé pour développeur senior',
    type: 'sur-mesure',
    modules: [
      {
        id: 'm1',
        titre: 'React Hooks avancés',
        description: 'Maîtrise des hooks personnalisés',
        duree: '6 heures',
        ordre: 1,
        objectifs: ['Créer des hooks personnalisés', 'Optimiser les performances'],
        prerequis: ['Bases React'],
        contenu: ['useContext', 'useReducer', 'Custom hooks']
      }
    ],
    rendezvousId: '103',
    beneficiaire: 'Pierre Durand',
    dateCreation: '2023-08-20T09:15:00Z',
    statut: 'archive',
    estValide: true,
    documentUrl: '/documents/programme-3.pdf'
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statut = searchParams.get('statut');

    let filteredData = demoData;

    // Filtrer par statut si spécifié
    if (statut && statut !== 'tous') {
      filteredData = demoData.filter(programme => programme.statut === statut);
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
      message: 'Programmes personnalisés récupérés avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des programmes personnalisés:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la récupération des programmes personnalisés'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Créer un nouveau programme avec un ID unique
    const newProgramme = {
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
      statut: 'brouillon',
      estValide: false,
      ...body
    };

    // En production, sauvegarder en base de données
    console.log('Nouveau programme créé:', newProgramme);

    return NextResponse.json({
      success: true,
      data: newProgramme,
      message: 'Programme personnalisé créé avec succès'
    });

  } catch (error) {
    console.error('Erreur lors de la création du programme personnalisé:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la création du programme personnalisé'
      },
      { status: 500 }
    );
  }
}