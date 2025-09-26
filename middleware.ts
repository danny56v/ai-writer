import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/user-info", "/article-writer"];
const authRoutes = ["/sign-in", "/sign-up", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Folosește getToken care funcționează în Edge Runtime
    const token = await getToken({ 
      req: request,
      secret: process.env.AUTH_SECRET 
    });

    // Verifică dacă utilizatorul este autentificat
    const isAuthenticated = !!token;

    // Dacă utilizatorul este autentificat și încearcă să acceseze pagini de auth
    if (isAuthenticated && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Dacă utilizatorul nu este autentificat și încearcă să acceseze rute protejate
    if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // În caz de eroare, permite accesul (fallback)
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
