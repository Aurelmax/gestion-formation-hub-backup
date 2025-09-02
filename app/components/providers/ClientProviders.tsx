"use client";

import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "../ui/toaster";
import { Toaster as Sonner } from "../ui/sonner";
import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <SessionProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {children}
      </TooltipProvider>
    </SessionProvider>
  );
}
