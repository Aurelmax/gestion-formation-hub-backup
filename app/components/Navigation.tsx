"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const Navigation = () => {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isActive = (path: string) => pathname === path;

  return (
    <nav className="flex items-center gap-4" aria-label="Menu principal">
      <Link href="/catalogue">
        <Button 
          variant={isActive("/catalogue") || pathname === "/" ? "default" : "ghost"}
          className="text-base font-medium"
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
      {session ? (
        <>
          <Link href="/apprenant/dashboard">
            <Button 
              variant={isActive("/apprenant/dashboard") ? "default" : "ghost"}
              className="text-base bg-blue-100 hover:bg-blue-200 text-blue-800"
            >
              Espace Apprenant
            </Button>
          </Link>
          <Link href="/admin">
            <Button 
              variant={isActive("/admin") ? "default" : "ghost"}
              className="text-base bg-primary/10 hover:bg-primary/20"
            >
              Administration
            </Button>
          </Link>
        </>
      ) : (
        <Link href="/auth">
          <Button 
            variant="outline"
            className="text-base"
          >
            Connexion
          </Button>
        </Link>
      )}
    </nav>
  );
};

export default Navigation;
