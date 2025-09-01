"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex items-center gap-6" aria-label="Menu principal">
      <Link href="/">
        <Button 
          variant={isActive("/") ? "default" : "ghost"}
          className="text-base"
        >
          Accueil
        </Button>
      </Link>
      <Link href="/catalogue">
        <Button 
          variant={isActive("/catalogue") ? "default" : "ghost"}
          className="text-base"
        >
          Catalogue
        </Button>
      </Link>
      <Link href="/blog">
        <Button 
          variant={isActive("/blog") ? "default" : "ghost"}
          className="text-base"
        >
          Blog
        </Button>
      </Link>
      <Link href="/a-propos">
        <Button 
          variant={isActive("/a-propos") ? "default" : "ghost"}
          className="text-base"
        >
          À propos
        </Button>
      </Link>
      <Link href="/contact">
        <Button 
          variant={isActive("/contact") ? "default" : "ghost"}
          className="text-base"
        >
          Contact
        </Button>
      </Link>
      <Link href="/dashboard">
        <Button variant="outline" className="text-base">
          Espace formation
        </Button>
      </Link>
    </nav>
  );
};

export default Navigation;
