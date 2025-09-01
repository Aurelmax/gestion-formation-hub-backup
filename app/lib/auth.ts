import { SessionProvider, signIn, signOut, useSession } from "next-auth/react";
import { createContext, useContext, ReactNode } from "react";

// Type pour notre contexte d'authentification personnalisé
export interface AuthContextType {
  user: any;
  session: any;
  loading: boolean;
  signOut: () => Promise<void>;
  signIn: (credentials: { email: string; password: string }) => Promise<boolean>;
}

// Création du contexte d'authentification
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personnalisé pour accéder au contexte d'authentification
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Provider pour le contexte d'authentification
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Utiliser useSession de NextAuth
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const user = session?.user;

  // Fonction de déconnexion
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/auth" });
  };

  // Fonction de connexion
  const handleSignIn = async (credentials: { email: string; password: string }) => {
    const result = await signIn("credentials", {
      redirect: false,
      email: credentials.email,
      password: credentials.password,
    });

    return result?.ok ?? false;
  };

  // Valeur du contexte
  const value = {
    user,
    session,
    loading,
    signOut: handleSignOut,
    signIn: handleSignIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Provider global pour NextAuth.js (à utiliser au niveau de l'application)
export const NextAuthProvider = ({ children }: { children: ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
