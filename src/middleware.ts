import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register")
  const isProtected =
    req.nextUrl.pathname.startsWith("/dashboard") ||
    req.nextUrl.pathname.startsWith("/profile") ||
    req.nextUrl.pathname.startsWith("/search") ||
    req.nextUrl.pathname.startsWith("/matches") ||
    req.nextUrl.pathname.startsWith("/messages") ||
    req.nextUrl.pathname.startsWith("/subscription")

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl))
  }
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/search/:path*", "/matches/:path*", "/messages/:path*", "/subscription/:path*", "/login", "/register"],
}

