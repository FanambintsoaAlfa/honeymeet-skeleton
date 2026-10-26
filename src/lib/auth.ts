import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        emailOrPhone: { label: "Email ou Téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrPhone || !credentials?.password) return null

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.emailOrPhone },
              { phone: credentials.emailOrPhone },
            ],
          },
        })

        if (!user || !user.passwordHash) return null

        const isValid = await bcrypt.compare(credentials.password as string, user.passwordHash)
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          phone: user.phoneNumber,
          userType: user.userType,
          isPremium: false,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.userType = (user as any).userType
        token.isPremium = (user as any).isPremium
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        const sessionUser = session.user as typeof session.user & {
          id?: string
          userType?: string
          isPremium?: boolean
        }

        sessionUser.id = token.id as string
        sessionUser.userType = token.userType as string
        sessionUser.isPremium = token.isPremium as boolean
        session.user = sessionUser
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
})
