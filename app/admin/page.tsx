"use client";

import { useAuth } from "@/app/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login"); // redirige si non connecté ou pas admin
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return <p>Redirection...</p>;

  return (
    <div>
      <h1>Administration</h1>
      <p>Bienvenue {user.email} !</p>
      {/* Contenu admin */}
    </div>
  );
}
