import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/lib/auth.config"

// Le middleware tourne sur le runtime Edge : on utilise uniquement la config
// légère (sans Prisma). La vérification du JWT suffit pour protéger les pages.
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register")

  if (!isLoggedIn && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }
  return NextResponse.next()
})

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/search/:path*",
    "/matches/:path*",
    "/messages/:path*",
    "/subscription/:path*",
    "/login",
    "/register",
  ],
}
