"use client";

import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn as nextAuthSignIn, signOut as nextAuthSignOut, useSession } from 'next-auth/react';

// Types
export interface User {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const loading = status === 'loading';

  useEffect(() => {
    if (!loading) {
      setError(null);
    }
  }, [loading]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      const result = await nextAuthSignIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        const errorMessage = result.error === 'CredentialsSignin' 
          ? 'Email ou mot de passe incorrect' 
          : 'Erreur lors de la connexion';
        
        setError(errorMessage);
        console.error('Erreur de connexion:', result.error);
        return false;
      }

      return true;
    } catch (error) {
      const errorMessage = 'Une erreur est survenue lors de la connexion';
      setError(errorMessage);
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await nextAuthSignOut({ redirect: false });
      router.push('/auth');
    } catch (error) {
      setError('Erreur lors de la déconnexion');
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Ensure user object always has required fields
  const user = session?.user ? {
    id: session.user.id || '',
    email: session.user.email || null,
    name: session.user.name || null,
    role: (session.user as any).role, // Cast to any to avoid TypeScript errors for custom properties
    image: session.user.image || null
  } : null;

  const value: AuthContextType = {
    user,
    signIn,
    signOut,
    loading,
    error,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export types
export type { AuthContextType, User };
