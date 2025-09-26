import { NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';



export async function GET() {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return authResult.error!;
    }

    
    console.log('Requête reçue sur /api/programmes-formation/par-categorie/groups');

    // Récupérer toutes les catégories avec leurs programmes actifs et visibles
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
    
    // Transformer les données au format attendu par le front-end
    const formattedCategories = categories
      .filter(category => category.programmes.length > 0) // Ne garder que les catégories avec des programmes
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

    console.log('Catégories formatées:', formattedCategories.map(cat => `${cat.titre}: ${cat.formations.length} programmes`));

    return NextResponse.json(formattedCategories);
  } catch (error) {
    console.error('Erreur lors de la récupération des programmes par catégorie:', error);
    return NextResponse.json(
      { 
        error: 'Erreur serveur',
        details: process.env.NODE_ENV === 'development' 
          ? error instanceof Error ? error.message : String(error)
          : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}