#!/usr/bin/env node

import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function updateProgrammesType() {
  try {
    console.log('🚀 Début de la mise à jour des types de programmes...');

    // Mettre à jour tous les programmes existants pour les marquer comme "catalogue"
    const result = await prisma.programmeFormation.updateMany({
      where: {
        typeProgramme: null
      },
      data: {
        typeProgramme: 'catalogue'
      }
    });

    console.log(`✅ ${result.count} programmes mis à jour avec le type "catalogue"`);

    // Vérifier le résultat
    const totalCatalogue = await prisma.programmeFormation.count({
      where: {
        typeProgramme: 'catalogue'
      }
    });

    console.log(`📊 Total des programmes "catalogue" : ${totalCatalogue}`);

  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour :', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter le script
updateProgrammesType();