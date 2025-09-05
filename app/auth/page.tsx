"use client";

import AuthPage from "@/components/auth/AuthPage";

// Disable static generation for auth page (requires client-side auth)
export const dynamic = 'force-dynamic';

export default function Auth() {
  return <AuthPage />;
}
