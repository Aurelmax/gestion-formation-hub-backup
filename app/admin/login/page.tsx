"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SimpleLoginForm from "@/components/auth/SimpleLoginForm";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Protection contre l'hydratation
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return; // Attendre que le composant soit monté côté client
    
    // Si déjà connecté, rediriger vers le dashboard
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [session, status, router, mounted]);

  // Ne rien rendre côté serveur pour éviter les différences d'hydratation
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  // Afficher la page de connexion si pas encore authentifié
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-lg">Vérification...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <SimpleLoginForm />;
  }

  // Pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-lg">Redirection vers le dashboard...</div>
    </div>
  );
}