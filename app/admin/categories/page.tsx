<<<<<<< HEAD
"use client";
=======
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CategoriesManager from '@/components/admin/CategoriesManager';
import AdminNav from '@/components/admin/AdminNav';
>>>>>>> feature/clerk-only-final

import { useAuth } from "@/app/components/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

<<<<<<< HEAD
export default function AdminCategoriesPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user || user.role !== "admin") {
      router.push("/login"); // redirige si non connecté ou pas admin
    }
  }, [user, router]);

  if (!user || user.role !== "admin") return <p>Redirection...</p>;

=======
export default async function AdminCategoriesPage() {
  const { userId } = await auth();

  // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
  if (!userId) {
    redirect('/auth/sign-in?redirect_url=/admin/categories');
  }

>>>>>>> feature/clerk-only-final
  return (
    <div>
      <h1>Catégories Admin</h1>
      <p>Bienvenue {user.email} !</p>
      {/* Liste des catégories, boutons CRUD, etc. */}
    </div>
  );
<<<<<<< HEAD
}


=======
}
>>>>>>> feature/clerk-only-final
