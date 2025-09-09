import { PrismaClient } from '@prisma/client'

// Optimiser les performances avec connection pooling global
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Réutiliser la même instance Prisma pour éviter les reconnexions
const prisma = globalForPrisma.prisma ?? 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export { prisma }
export default prisma