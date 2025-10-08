import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/user-info", "/real-estate-generator"];
const authRoutes = ["/sign-in", "/sign-up", "/login", "/register"];

const isAuthRoute = (pathname: string) =>
  authRoutes.some((route) => pathname.startsWith(route));

const isProtectedRoute = (pathname: string) =>
  protectedRoutes.some((route) => pathname.startsWith(route));

export async function middleware(request: NextRequest) {
  console.log('secret', !!process.env.NEXTAUTH_SECRET)
  const { pathname } = request.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  const token = await getToken({ req: request, secret });
  const isAuthenticated = Boolean(token);

  // Dacă e logat și încearcă să intre pe pagini de auth -> du-l acasă
  if (isAuthenticated && isAuthRoute(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Dacă NU e logat și încearcă rute protejate -> redirect la sign-in cu callbackUrl
  if (!isAuthenticated && isProtectedRoute(pathname)) {
    const signInUrl = new URL("/sign-in", request.url);
    const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search || ""}`;
    signInUrl.searchParams.set("callbackUrl", callbackUrl);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // exclude API, assets Next, favicon, sitemap, robots, și _next/data
    "/((?!api|_next/static|_next/image|_next/data|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};



// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";

// const protectedRoutes = ["/user-info", "/real-estate-generator"];
// const authRoutes = ["/sign-in", "/sign-up", "/login", "/register"];

// const isAuthRoute = (pathname: string) => authRoutes.includes(pathname);
// const isProtectedRoute = (pathname: string) =>
//   protectedRoutes.some((route) => pathname.startsWith(route));

// export async function middleware(request: NextRequest) {
//   const { pathname, search } = request.nextUrl;
//   const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
//   const token = await getToken({ req: request, secret });
//   const isAuthenticated = Boolean(token);

//   if (isAuthenticated && isAuthRoute(pathname)) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   if (!isAuthenticated && isProtectedRoute(pathname)) {
//     const signInUrl = new URL("/sign-in", request.url);
//     const callbackUrl = `${pathname}${search ?? ""}`;
//     signInUrl.searchParams.set("callbackUrl", callbackUrl);
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
