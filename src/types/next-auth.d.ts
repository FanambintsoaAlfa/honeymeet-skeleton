import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      userType: string
      isPremium: boolean
    } & DefaultSession["user"]
  }
  interface User {
    userType: string
    isPremium: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    userType: string
    isPremium: boolean
  }
}
