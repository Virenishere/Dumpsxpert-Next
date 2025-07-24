import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request });

  const { pathname } = request.nextUrl;

  // Allow public routes (e.g., login, register, home)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // Require authentication for protected routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }

    const role = token.role;

    // Redirect users without proper role
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      const url = new URL("/unauthorized", request.url);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/student") && role !== "student") {
      const url = new URL("/unauthorized", request.url);
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/dashboard/faculty") && role !== "faculty") {
      const url = new URL("/unauthorized", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
