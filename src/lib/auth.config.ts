import type { NextAuthConfig } from "next-auth"

/**
 * Configuration NextAuth "légère", compatible avec le runtime Edge du middleware.
 * Elle ne doit JAMAIS importer Prisma ni bcrypt (indisponibles sur Edge).
 * La configuration complète (providers + base de données) est dans auth.ts.
 */
export const authConfig = {
  secret: process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim(),
  providers: [],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.userType = user.userType
        token.isPremium = user.isPremium
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.userType = token.userType as string
        session.user.isPremium = token.isPremium as boolean
      }
      return session
    },
  },
} satisfies NextAuthConfig
