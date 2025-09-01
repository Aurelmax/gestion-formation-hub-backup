const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Affiche toutes les propriétés disponibles sur le client Prisma
console.log("Propriétés disponibles sur le client Prisma:");
console.log(Object.keys(prisma));

// Ferme la connexion Prisma
prisma.$disconnect();
