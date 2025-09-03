import { PrismaClient } from "@prisma/client";

declare global {
  // Évite de créer plusieurs instances de PrismaClient en dev
  // @ts-ignore
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
