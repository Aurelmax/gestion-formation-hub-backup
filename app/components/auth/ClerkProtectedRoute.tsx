"use client";

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface ClerkProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export default function ClerkProtectedRoute({ 
  children, 
  fallback = <div>Chargement...</div>,
  redirectTo = '/auth/sign-in'
}: ClerkProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push(redirectTo);
    }
  }, [isLoaded, isSignedIn, router, redirectTo]);

  if (!isLoaded) {
    return <>{fallback}</>;
  }

  if (!isSignedIn) {
    return null;
  }

  return <>{children}</>;
}
