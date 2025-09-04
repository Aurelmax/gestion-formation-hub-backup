import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import * as bcrypt from 'bcryptjs';
import type { AuthOptions } from "next-auth/core/types";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // 24h
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'user',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const customUser = user as any; // Assertion temporaire pour les propriétés personnalisées
        token.id = customUser.id;
        token.role = customUser.role || 'user';
        token.email = customUser.email;
        token.name = customUser.name;
        token.prenom = customUser.prenom;
        token.nom = customUser.nom;
        token.phone = customUser.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const customUser = session.user as any; // Assertion temporaire pour les propriétés personnalisées
        customUser.id = token.id as string;
        customUser.role = token.role as string;
        customUser.email = token.email;
        customUser.name = token.name;
        customUser.prenom = token.prenom;
        customUser.nom = token.nom;
        customUser.phone = token.phone;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
