import { User } from '@clerk/nextjs/server';

declare global {
  namespace Clerk {
    interface PublicMetadata {
      role?: string;
      permissions?: string[];
    }
  }
}

// Extension des types Clerk pour inclure nos métadonnées personnalisées
declare module '@clerk/nextjs/server' {
  interface User {
    publicMetadata: {
      role?: string;
      permissions?: string[];
    };
  }
}
