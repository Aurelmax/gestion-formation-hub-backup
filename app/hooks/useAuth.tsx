'use client';

import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs';

export interface User {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  image: string | null;
}

export function useAuth() {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { isSignedIn } = useClerkAuth();

  // Convertir l'utilisateur Clerk en format compatible
  const user: User | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.primaryEmailAddress?.emailAddress || null,
    name: clerkUser.fullName || null,
    role: clerkUser.publicMetadata?.role as string || 'user',
    image: clerkUser.imageUrl || null
  } : null;

  return {
    user,
    isAuthenticated: isSignedIn,
    isLoading: !userLoaded,
    isSignedIn
  };
}