import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  const email = process.argv[2];
  const password = process.argv[3];
  
  if (!email || !password) {
    console.error('Usage: npx ts-node scripts/create-admin.ts <email> <password>');
    process.exit(1);
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      console.log('❌ Un utilisateur avec cet email existe déjà');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur admin
    const admin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: 'Administrateur',
        role: 'admin',
        isActive: true,
        emailVerified: new Date(), // Compte vérifié par défaut
      }
    });

    console.log('✅ Utilisateur admin créé avec succès !');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Mot de passe:', password);
    console.log('🎯 Vous pouvez maintenant vous connecter via /admin/login');

  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();