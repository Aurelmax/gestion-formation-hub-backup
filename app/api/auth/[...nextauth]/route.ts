import NextAuth from "next-auth"
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from "@/lib/prisma";
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

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
          session.user.id = token.id;
          session.user.role = token.role;
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
          token.role = user.role;
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