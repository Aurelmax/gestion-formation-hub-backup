<<<<<<< HEAD
"use client";
=======
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import AdminNav from '@/components/admin/AdminNav';
>>>>>>> feature/clerk-only-final

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

<<<<<<< HEAD
export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Protection contre l'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Attendre que le composant soit monté côté client
    
    // Rediriger selon le statut d'authentification
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router, mounted]);

  // Ne rien rendre côté serveur pour éviter les différences d'hydratation
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
=======
export default async function AdminDashboardPage() {
  const { userId } = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/admin');
>>>>>>> feature/clerk-only-final
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">
        {status === "loading" ? "Chargement..." : "Redirection..."}
      </div>
    </div>
  );
}