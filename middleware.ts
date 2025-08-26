import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("session")
  const isAuthPage = request.nextUrl.pathname.startsWith("/login") || request.nextUrl.pathname.startsWith("/register")
  const isProtectedPage = request.nextUrl.pathname.startsWith("/brief") || request.nextUrl.pathname.startsWith("/admin")

  // Redirect to login if accessing protected pages without session
  if (isProtectedPage && !sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect to brief if accessing auth pages with session
  if (isAuthPage && sessionCookie) {
    return NextResponse.redirect(new URL("/brief", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/brief/:path*", "/admin/:path*", "/login", "/register"],
}
