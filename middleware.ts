import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/user-info", "/real-estate-generator"];
const authRoutes = ["/sign-in", "/sign-up", "/login", "/register"];

const isAuthRoute = (pathname: string) => authRoutes.includes(pathname);
const isProtectedRoute = (pathname: string) =>
  protectedRoutes.some((route) => pathname.startsWith(route));

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const isAuthenticated = Boolean(token);

  if (isAuthenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!isAuthenticated && isProtectedRoute(pathname)) {
    const signInUrl = new URL("/sign-in", request.url);
    const callbackUrl = `${pathname}${search ?? ""}`;
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
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
