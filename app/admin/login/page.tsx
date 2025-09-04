"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SimpleLoginForm from "@/components/auth/SimpleLoginForm";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Si déjà connecté, rediriger vers le dashboard
    if (status === "authenticated" && session?.user) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Afficher la page de connexion si pas encore authentifié
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Chargement...</div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <SimpleLoginForm />;
  }

  // Pendant la redirection
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirection...</div>
    </div>
  );
}