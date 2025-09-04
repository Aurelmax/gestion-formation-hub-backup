"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">
        {status === "loading" ? "Chargement..." : "Redirection..."}
      </div>
    </div>
  );
}
