import { getAccountByUserId } from "@/data-access/account";
import {
  deleteTwoFactorConfirmationByToken,
  getTwoFactorConirmationByUserId,
} from "@/data-access/two-factor-confirmation";
import {
  getUserByEmail,
  getUserById,
  verifyPassword,
} from "@/data-access/user";
import { db } from "@/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { z } from "zod";

export const authConfig = {
  providers: [
    Google,
    GitHub,
    Credentials({
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const validatedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string(),
          })
          .safeParse(credentials);

        if (!validatedCredentials.success) return null;

        const { email, password } = validatedCredentials.data;

        const user = await getUserByEmail(email);

        if (!user || !user.salt || !user.password) return null;

        const passwordsMatch = await verifyPassword(
          password,
          user?.salt,
          user?.password,
        );

        if (passwordsMatch) {
          return user;
        }

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/login",
    error: "/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.id) return false;

      //Allow OAuth without email verification
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id);

      if (!existingUser) return false;

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConirmationByUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        await deleteTwoFactorConfirmationByToken(twoFactorConfirmation.token);
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) {
        return token;
      }
      const user = await getUserById(token.sub);

      if (!user) return token;

      const existingAccount = await getAccountByUserId(user.id);

      token.isOAuth = !!existingAccount;
      token.name = user.name;
      token.email = user.email;
      token.role = user.role;
      token.isTwoFactorEnabled = user.isTwoFactorEnabled;

      return token;
    },
    //@ts-ignore
    async session({ token, session }) {
      if (session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role ?? ("USER" as any);
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      return session;
    },
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
