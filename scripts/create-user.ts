// scripts/create-user.js
const { hash } = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUser() {
  const email = 'aurelien@gestionmax.fr';
  const password = 'admin2026!';
  const hashedPassword = await hash(password, 12);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: 'Aurélien',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log('Utilisateur créé avec succès:', user);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createUser();