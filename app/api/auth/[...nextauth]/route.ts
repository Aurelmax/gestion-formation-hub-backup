import NextAuth from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// Instance Prisma avec gestion d'erreur améliorée
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
}).$extends(withAccelerate());

const handler = NextAuth({
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
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email et mot de passe requis');
          }

          // Vérification de la connexion Prisma
          try {
            await prisma.$connect();
          } catch (connectError) {
            console.warn('Reconnexion Prisma nécessaire dans NextAuth:', connectError);
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) {
            throw new Error('Identifiants invalides');
          }

          const isValid = await bcrypt.compare(credentials.password as string, user.password);

          if (!isValid) {
            throw new Error('Mot de passe incorrect');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Erreur lors de l\'autorisation:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      try {
        if (token) {
          (session.user as any).id = token.id as string;
          (session.user as any).role = token.role as string;
        }
        return session;
      } catch (error) {
        console.error('Erreur lors de la session callback:', error);
        return session;
      }
    },
    async jwt({ token, user }) {
      try {
        if (user) {
          token.id = user.id;
          (token as any).role = (user as any).role;
        }
        return token;
      } catch (error) {
        console.error('Erreur lors du JWT callback:', error);
        return token;
      }
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
})

export { handler as GET, handler as POST }