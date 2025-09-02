import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Schéma de validation pour le code formation
const codeSchema = z.string()
  .min(3, 'Le code doit contenir au moins 3 caractères')
  .max(50, 'Le code ne peut pas dépasser 50 caractères')
  .regex(/^[A-Z0-9-]+$/, 'Le code ne peut contenir que des lettres majuscules, chiffres et tirets');

// Schéma de validation pour les paramètres de requête
const queryParamsSchema = z.object({
  version: z.string().regex(/^\d+$/).transform(Number).optional(),
  fields: z.string().optional(),
});

// GET /api/programmes-formation/by-code/[code] - Récupérer un programme par son code
export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;
    const { searchParams } = new URL(request.url);
    
    // Validation du code
    const codeValidation = codeSchema.safeParse(code);
    if (!codeValidation.success) {
      return NextResponse.json(
        { 
          error: 'Code de formation invalide',
          details: codeValidation.error.errors 
        },
        { status: 400 }
      );
    }

    // Validation des paramètres de requête
    const queryParams = Object.fromEntries(searchParams.entries());
    const { version, fields } = queryParamsSchema.parse(queryParams);

    // Définition des champs à récupérer
    const selectFields = {
      id: true,
      code: true,
      titre: true,
      description: true,
      duree: true,
      prix: true,
      niveau: true,
      version: true,
      estActif: true,
      categorie: {
        select: {
          id: true,
          code: true,
          titre: true,
        },
      },
      programmeSource: {
        select: {
          id: true,
          code: true,
          titre: true,
          version: true,
        },
      },
      // Champs optionnels basés sur le paramètre fields
      ...(fields?.includes('details') && {
        objectifs: true,
        prerequis: true,
        modalites: true,
        programmeUrl: true,
      }),
    };

    // Construction de la requête
    const where: any = { 
      code: code,
      ...(version !== undefined && { version: version }),
    };

    // Si pas de version spécifiée, on prend la plus récente active
    const orderBy = version !== undefined 
      ? {} 
      : { version: 'desc' as const };

    // Recherche du programme
    const programme = await prisma.programmeFormation.findFirst({
      where,
      select: selectFields,
      orderBy,
    });

    // Gestion des erreurs
    if (!programme) {
      // Vérifier si le code existe dans une autre version
      const otherVersions = await prisma.programmeFormation.findMany({
        where: { code },
        select: { version: true, estActif: true },
        orderBy: { version: 'desc' },
      });

      if (otherVersions.length > 0) {
        return NextResponse.json(
          { 
            error: 'Version non trouvée',
            availableVersions: otherVersions,
            latestVersion: otherVersions[0],
            message: version 
              ? `La version ${version} n'existe pas pour ce code.` 
              : 'Aucune version active trouvée.'
          },
          { status: 404 }
        );
      }

      // Vérifier les redirections (alias de code)
      const redirect = await checkCodeAlias(code);
      if (redirect) {
        return NextResponse.redirect(
          new URL(`/api/programmes-formation/by-code/${redirect.newCode}${version ? `?version=${version}` : ''}`, request.url),
          301
        );
      }

      return NextResponse.json(
        { 
          error: 'Programme non trouvé',
          message: `Aucun programme trouvé avec le code: ${code}`
        },
        { status: 404 }
      );
    }

    // Si une version spécifique est demandée mais que le programme n'est pas actif
    if (version && !programme.estActif) {
      const latestActive = await prisma.programmeFormation.findFirst({
        where: { code, estActif: true },
        orderBy: { version: 'desc' },
        select: { version: true },
      });

      if (latestActive) {
        return NextResponse.json(
          { 
            error: 'Version inactive',
            message: `La version ${version} n'est plus active.`,
            latestActiveVersion: latestActive.version,
            redirect: `/api/programmes-formation/by-code/${code}?version=${latestActive.version}`
          },
          { status: 410 // Gone
        });
      }
    }

    return NextResponse.json(programme, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });

  } catch (error) {
    console.error('Erreur lors de la recherche du programme par code:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Paramètres de requête invalides',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Une erreur est survenue lors de la recherche du programme',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    );
  }
}

// Fonction utilitaire pour gérer les redirections de code
async function checkCodeAlias(oldCode: string): Promise<{ newCode: string } | null> {
  // Implémentation de la logique de redirection
  // Par exemple, en vérifiant une table d'alias dans la base de données
  /*
  const alias = await prisma.codeAlias.findUnique({
    where: { oldCode },
    select: { newCode: true },
  });
  return alias;
  */
  
  // Pour l'instant, retourne null (à implémenter selon vos besoins)
  return null;
}

// OPTIONS pour CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Cache-Control': 'public, max-age=86400', // 24h
    },
  });
}
