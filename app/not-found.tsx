"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-4">Oops! Page non trouvée</p>
          <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
            Retourner à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
