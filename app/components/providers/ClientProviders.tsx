"use client";

import { TooltipProvider } from "../ui/tooltip";
import { Toaster } from "../ui/toaster";
import { Toaster as Sonner } from "../ui/sonner";
import { ReactNode } from "react";

interface ClientProvidersProps {
  children: ReactNode;
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      {children}
    </TooltipProvider>
  );
}
