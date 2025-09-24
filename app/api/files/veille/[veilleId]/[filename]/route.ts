import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { prisma } from "@/lib/prisma";



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ veilleId: string; filename: string }> }
) {
  try {
    const { veilleId, filename } = await params;

    // Vérifier que le document existe et appartient à cette veille
    const document = await prisma.veilleDocument.findFirst({
      where: {
        url: `/api/files/veille/${veilleId}/${filename}`,
        veilleId: veilleId
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    // Construire le chemin du fichier
    const filePath = join(process.cwd(), 'uploads', 'veille', veilleId, filename);

    try {
      // Lire le fichier
      const fileBuffer = await readFile(filePath);

      // Déterminer le type MIME
      const mimeType = document.type || 'application/octet-stream';

      // Créer la réponse avec les bons headers
      return new NextResponse(fileBuffer, {
        status: 200,
        headers: {
          'Content-Type': mimeType,
          'Content-Disposition': `inline; filename="${encodeURIComponent(document.nom)}"`,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'public, max-age=31536000, immutable'
        }
      });

    } catch (fileError) {
      console.error('Erreur lecture fichier:', fileError);
      return NextResponse.json(
        { error: 'Fichier non trouvé sur le serveur' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Erreur lors du téléchargement du document:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors du téléchargement' },
      { status: 500 }
    );
  }
}