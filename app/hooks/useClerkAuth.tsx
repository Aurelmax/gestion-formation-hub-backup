"use client";

import { createContext, useContext, ReactNode, useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useAuth as useClerkAuth, useSignIn, useSignUp } from '@clerk/nextjs';

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
  isSignedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function ClerkAuthProvider({ children }: AuthProviderProps) {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();
  const { signIn: clerkSignIn, isLoaded: signInLoaded } = useSignIn();
  const { signUp: clerkSignUp, isLoaded: signUpLoaded } = useSignUp();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const loading = !userLoaded || !signInLoaded || !signUpLoaded;

  // Éviter les problèmes d'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading) {
      setError(null);
    }
  }, [loading]);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setError(null);
      
      if (!clerkSignIn) {
        throw new Error('Service de connexion non disponible');
      }

      const result = await clerkSignIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        return true;
      } else {
        setError('Connexion échouée');
        return false;
      }
    } catch (error: any) {
      const errorMessage = error?.errors?.[0]?.message || 'Erreur lors de la connexion';
      setError(errorMessage);
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const signOut = async () => {
    try {
      const { signOut: clerkSignOut } = await import('@clerk/nextjs');
      await clerkSignOut();
      router.push('/auth');
    } catch (error) {
      setError('Erreur lors de la déconnexion');
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  // Convertir l'utilisateur Clerk en format compatible
  const user = useMemo(() => {
    if (!clerkUser) return null;
    
    return {
      id: clerkUser.id,
      email: clerkUser.primaryEmailAddress?.emailAddress || null,
      name: clerkUser.fullName || null,
      role: clerkUser.publicMetadata?.role as string || 'user',
      image: clerkUser.imageUrl || null
    };
  }, [clerkUser]);

  const value: AuthContextType = {
    user,
    signIn,
    signOut,
    loading,
    error,
    isSignedIn,
  };

  // Attendre que le composant soit monté côté client pour éviter l'hydratation
  if (!mounted) {
    return (
      <AuthContext.Provider value={{ user: null, signIn, signOut, loading: true, error: null, isSignedIn: false }}>
        {children}
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useClerkAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useClerkAuth must be used within a ClerkAuthProvider');
  }
  return context;
}

// Export types
export type { AuthContextType };
