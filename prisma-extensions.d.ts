// prisma-extensions.d.ts
import { PrismaClient } from '@prisma/client'

declare module '@prisma/client' {
  interface PrismaClient {
    formation: {
      findMany: (args?: any) => Promise<any[]>,
      findUnique: (args?: any) => Promise<any | null>,
      create: (args?: any) => Promise<any>,
      update: (args?: any) => Promise<any>,
      delete: (args?: any) => Promise<any>
    },
    categorieProgramme: {
      findUnique: (args?: any) => Promise<any | null>,
      findMany: (args?: any) => Promise<any[]>,
      create: (args?: any) => Promise<any>,
      update: (args?: any) => Promise<any>,
      delete: (args?: any) => Promise<any>
    }
  }
  
  namespace Prisma {
    interface ProgrammeFormation {
      id: string;
      titre: string;
      description: string | null;
      type: string;
      estActif: boolean;
      categorieId: string | null;
      prix: number | null;
      duree: number | null;
      objectifs: string | null;
      publicCible: string | null;
      prerequis: string | null;
      programmeSourId: string | null;
      dateCreation: Date;
      dateModification: Date;
      createdAt: Date;
      updatedAt: Date;
      version: number;
    }
  }
}
