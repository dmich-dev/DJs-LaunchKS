import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// Define route protection
const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password", "/verify-email"];
const authRoutes = ["/login", "/signup"];
const adminRoutes = ["/admin"];
const appRoutes = ["/dashboard", "/intake", "/plan", "/onboarding", "/settings", "/progress"];

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal Next.js paths and static assets
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".") // static files
  ) {
    return NextResponse.next();
  }

  try {
    // Get session using Better Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isPublicRoute = publicRoutes.some((route) => pathname === route);
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
    const isAppRoute = appRoutes.some((route) => pathname.startsWith(route));

    // Redirect authenticated users away from auth pages
    if (isAuthRoute && session?.user) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users to login
    if (!session?.user && (isAppRoute || isAdminRoute)) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin access
    if (isAdminRoute && session?.user) {
      // Better Auth user type may not include role by default, check it via type assertion
      const userRole = (session.user as any).role;
      if (userRole !== "admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    // Continue to the route
    return NextResponse.next();
  } catch (error) {
    console.error("Proxy error:", error);
    // On error, allow the request through - auth will be checked at page level
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};