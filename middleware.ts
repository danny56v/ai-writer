import { getToken } from "next-auth/jwt";

import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/user-info", "/real-estate-generator"];
const authRoutes = ["/sign-in", "/sign-up", "/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    // Use getToken, which works inside the Edge Runtime
    const token = await getToken({ 
      req: request,
      secret: process.env.AUTH_SECRET 
    });

    // Check if the user is authenticated
    const isAuthenticated = !!token;

    // If an authenticated user tries to reach auth pages, send them home
    if (isAuthenticated && authRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Redirect unauthenticated users away from protected routes
    if (!isAuthenticated && protectedRoutes.some((route) => pathname.startsWith(route))) {
      const signInUrl = new URL("/sign-in", request.url);
      const search = request.nextUrl.search.length > 0 ? request.nextUrl.search : "";
      const callbackUrl = `${pathname}${search}`;
      signInUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // In case of an unexpected error, allow the request (fallback)
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
