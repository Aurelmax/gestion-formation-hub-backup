"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminNav = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname.startsWith(path);

  return (
    <nav className="flex items-center gap-4 mb-8 border-b pb-4" aria-label="Menu d'administration">
      <Link href="/admin">
        <Button 
          variant={isActive("/admin$") ? "default" : "outline"}
          className="text-sm"
        >
          Tableau de bord
        </Button>
      </Link>
      <Link href="/admin/categories">
        <Button 
          variant={isActive("/admin/categories") ? "default" : "outline"}
          className="text-sm"
        >
          Catégories
        </Button>
      </Link>
      <Link href="/admin/programmes">
        <Button 
          variant={isActive("/admin/programmes") ? "default" : "outline"}
          className="text-sm"
        >
          Programmes
        </Button>
      </Link>
    </nav>
  );
};

export default AdminNav;
