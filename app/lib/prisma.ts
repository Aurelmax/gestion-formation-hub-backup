import { PrismaClient } from '@prisma/client';

declare global {
  // PrismaClient est attaché à `global` en développement pour empêcher
  // d'avoir trop d'instances de PrismaClient lors du rechargement à chaud (HMR).
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

// Initialise PrismaClient une seule fois et le réutilise dans toute l'application
const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// En développement, attache PrismaClient à `global` pour le rechargement à chaud (HMR)
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export { prisma };
