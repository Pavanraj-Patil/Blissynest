import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/password";

// Kept separate from src/auth.ts as the shared provider/callback config,
// with the Prisma adapter added only in auth.ts — a clean separation
// between "config" and "the instance with a database attached."
//
// Deliberately just two providers: Google OAuth and email+password. No
// magic-link, no mobile OTP — see BACKEND_HANDOFF.md Section 32, Open
// Question #1, resolved in favor of the two methods the frontend's
// AccountAuthModal actually needs to support.

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

export default {
  providers: [
    // Only offered when real OAuth credentials are configured — otherwise
    // the button would be shown but 500 on click.
    ...(googleClientId && googleClientSecret
      ? [Google({ clientId: googleClientId, clientSecret: googleClientSecret })]
      : []),
    Credentials({
      id: "password",
      name: "Email and Password",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email.toLowerCase() : undefined;
        const password = typeof credentials?.password === "string" ? credentials.password : undefined;
        if (!email || !password) return null;

        const user = await db.user.findUnique({ where: { email } });
        if (!user?.passwordHash) return null; // no password ever set (e.g. Google-only account)

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          twoFactorEnabled: user.twoFactorEnabled,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/account",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // `user` is only present on the initial sign-in (adapter-loaded row).
      if (user) {
        const dbUser = user as unknown as {
          role: "CUSTOMER" | "ADMIN";
          twoFactorEnabled: boolean;
        };
        token.role = dbUser.role;
        token.twoFactorEnabled = dbUser.twoFactorEnabled;
        // Customers don't need a 2FA step-up; admins start unverified for
        // this session until they clear the TOTP challenge (once that
        // admin-side flow is built — the schema field exists, the flow
        // doesn't yet, see BACKEND_TODO/roadmap).
        token.twoFactorVerified = dbUser.role === "CUSTOMER";
      }

      if (trigger === "update" && session) {
        const update = session as Partial<{
          twoFactorEnabled: boolean;
          twoFactorVerified: boolean;
        }>;
        if (typeof update.twoFactorEnabled === "boolean") {
          token.twoFactorEnabled = update.twoFactorEnabled;
        }
        if (typeof update.twoFactorVerified === "boolean") {
          token.twoFactorVerified = update.twoFactorVerified;
        }
      }

      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role ?? "CUSTOMER";
      session.user.twoFactorEnabled = token.twoFactorEnabled ?? false;
      session.user.twoFactorVerified = token.twoFactorVerified ?? false;
      return session;
    },
  },
} satisfies NextAuthConfig;
