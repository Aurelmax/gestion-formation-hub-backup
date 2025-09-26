export interface PrismaError extends Error {
  code?: string;
  meta?: {
    target?: string[];
    cause?: string;
  };
}

export function isPrismaError(error: unknown): error is PrismaError {
  return error instanceof Error && 'code' in error;
}

export function handlePrismaError(error: unknown) {
  if (isPrismaError(error)) {
    switch (error.code) {
      case 'P2025':
        return { status: 404, message: 'Ressource non trouvée' };
      case 'P2002':
        return { status: 409, message: 'Conflit - ressource déjà existante' };
      case 'P2003':
        return { status: 400, message: 'Violation de contrainte de clé étrangère' };
      default:
        return { status: 500, message: 'Erreur de base de données' };
    }
  }
  return { status: 500, message: 'Erreur interne du serveur' };
}