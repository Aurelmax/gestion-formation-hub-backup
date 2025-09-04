"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Shield } from "lucide-react";

export default function AdminAccessPage() {
  const { status } = useSession();
  const router = useRouter();

  // Si déjà connecté, aller directement au dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Accès Administration</CardTitle>
          <CardDescription>
            Accédez à votre dashboard de gestion sécurisé
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Fonctionnalités disponibles :</h4>
            <ul className="space-y-1 text-sm">
              <li>• Gestion des formations et programmes</li>
              <li>• Suivi des apprenants et rendez-vous</li>
              <li>• Gestion des réclamations</li>
              <li>• Actions correctives et conformité</li>
              <li>• Veille et accessibilité</li>
              <li>• Gestion des compétences</li>
            </ul>
          </div>
          
          <Button 
            className="w-full" 
            onClick={() => router.push("/admin/login")}
            size="lg"
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Accéder au Dashboard
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full" 
            onClick={() => router.push("/catalogue")}
          >
            ← Retour au catalogue public
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}