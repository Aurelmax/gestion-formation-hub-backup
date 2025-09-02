#!/bin/bash
# setup-nextauth.sh
# Script pour créer la structure NextAuth et les fichiers de configuration

set -e

echo "🚀 Création du dossier de route NextAuth..."
mkdir -p app/api/auth/[...nextauth]

ROUTE_FILE="app/api/auth/[...nextauth]/route.ts"

if [ ! -f "$ROUTE_FILE" ]; then
  echo "📄 Création du fichier route.ts..."
  cat <<EOL > "$ROUTE_FILE"
import { handlers } from '@/app/auth';

export const { GET, POST } = handlers;
EOL
else
  echo "ℹ️ route.ts existe déjà, rien à créer."
fi

AUTH_FILE="app/auth.ts"

if [ ! -f "$AUTH_FILE" ]; then
  echo "📄 Création du fichier auth.ts avec configuration NextAuth..."
  cat <<'EOL' > "$AUTH_FILE"
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email et mot de passe requis');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          throw new Error('Identifiants invalides');
        }

        const isValid = await compare(credentials.password as string, user.password);
        if (!isValid) {
          throw new Error('Mot de passe incorrect');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
};

export const { handlers, signIn, signOut, auth } = NextAuth(authOptions);
EOL
else
  echo "ℹ️ auth.ts existe déjà, rien à créer."
fi

echo "✅ Structure NextAuth mise en place."
echo "💡 N'oublie pas de mettre à jour ton .env.local avec :"
echo "   NEXTAUTH_URL=http://localhost:3000"
echo "   NEXTAUTH_SECRET=your-secret-here"
echo "   NEXTAUTH_URL_INTERNAL=http://localhost:3000"
echo "Puis redémarre le serveur avec : npm run dev"
