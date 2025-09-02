'use client';

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

type AuthProviderProps = {
  children: ReactNode;
};

export function useAuth() {
  return {}; // Conserve la compatibilité avec le hook useAuth existant
}

export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
