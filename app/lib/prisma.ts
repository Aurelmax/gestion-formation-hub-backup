import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

declare global {
  // PrismaClient est attaché à `global` pour réutilisation
  // eslint-disable-next-line no-var
  var __prisma: any;
}

// Configuration optimisée pour Vercel + Prisma Accelerate
const prisma = global.__prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['error', 'warn'] // Moins de logs en dev pour la perf
    : ['error'],
}).$extends(withAccelerate());

// Éviter les fuites de connexion en production
if (process.env.NODE_ENV !== 'production') {
  global.__prisma = prisma;
} else {
  // En production, assurer la fermeture propre
  process.on('beforeExit', async () => {
    await prisma.$disconnect();
  });
}

export { prisma };