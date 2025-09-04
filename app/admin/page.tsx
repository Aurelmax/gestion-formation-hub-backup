"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Rediriger selon le statut d'authentification
    if (status === "authenticated") {
      router.push("/dashboard");
    } else if (status === "unauthenticated") {
      router.push("/admin/login");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg">Redirection...</div>
    </div>
  );
}
