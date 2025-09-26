import { NextRequest, NextResponse } from 'next/server';
import { prisma } from "@/lib/prisma";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth, requireAuthWithRole } from '@/lib/api-auth';

// Taille maximale des fichiers: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

// Types de fichiers autorisés
const ALLOWED_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/plain'
];

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    const { id } = await params;

    // Vérifier que la veille existe
    const veille = await prisma.veille.findUnique({
      where: { id }
    });

    if (!veille) {
      return NextResponse.json(
        { error: 'Veille non trouvée' },
        { status: 404 }
      );
    }

    // Récupérer le fichier depuis FormData
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'Aucun fichier fourni' },
        { status: 400 }
      );
    }

    // Vérifications de sécurité
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux (max 10MB)' },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Type de fichier non autorisé. Types acceptés: PDF, JPEG, PNG, WEBP, DOCX, XLSX, TXT' },
        { status: 400 }
      );
    }

    // Générer un nom de fichier unique
    const fileExtension = file.name.split('.').pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    
    // Créer le dossier de stockage s'il n'existe pas
    const uploadDir = join(process.cwd(), 'uploads', 'veille', id);
    
    try {
      await import('fs').then(fs => {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
      });

    );
  }

    );
  }
    // Sauvegarder le fichier sur le serveur
    const filePath = join(uploadDir, uniqueFileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    await writeFile(filePath, buffer);

    // Enregistrer les informations du document en base
    const document = await prisma.veilleDocument.create({
      data: {
        nom: file.name,
        type: file.type,
        taille: file.size,
        url: `/api/files/veille/${id}/${uniqueFileName}`,
        veilleId: id
      }
    });

    // Ajouter une entrée dans l'historique
    await prisma.veilleHistorique.create({
      data: {
        action: 'Document ajouté',
        details: `Document "${file.name}" ajouté (${Math.round(file.size / 1024)} KB)`,
        utilisateur: 'Système',
        veilleId: id
      }
    });

    return NextResponse.json({
      id: document.id,
      nom: document.nom,
      url: document.url,
      type: document.type,
      taille: document.taille,
      dateAjout: document.dateAjout
    }, { status: 201 });

  );
}
}

// DELETE - Supprimer un document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

  try {
    // Vérifier l'authentification et les permissions admin
    const authResult = await requireAuthWithRole('admin');
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    );
  }
    // Vérifier l'authentification
    const authResult = await requireAuth();
    if (!authResult.isAuthenticated) {
      return NextResponse.json(
    { error: "Non authentifié" },
    { status: 401 }
  );
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json(
        { error: 'ID du document requis' },
        { status: 400 }
      );
    }

    // Récupérer le document
    const document = await prisma.veilleDocument.findUnique({
      where: { 
        id: documentId,
        veilleId: id
      }
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      );
    }

    // Supprimer le fichier physique
    try {
      // Extraire le nom du fichier depuis l'URL
      const fileName = document.url.split('/').pop();
      const filePath = join(process.cwd(), 'uploads', 'veille', id, fileName);
      await import('fs').then(fs => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });

    );
  }
    // Supprimer l'enregistrement de la base
    await prisma.veilleDocument.delete({
      where: { id: documentId }
    });

    // Ajouter une entrée dans l'historique
    await prisma.veilleHistorique.create({
      data: {
        action: 'Document supprimé',
        details: `Document "${document.nom}" supprimé`,
        utilisateur: 'Système',
        veilleId: id
      }
    });

    return NextResponse.json(
      { message: 'Document supprimé avec succès' },
      { status: 200 }
    );

  );
}
}