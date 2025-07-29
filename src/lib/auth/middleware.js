import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions"; 

export async function middleware(request) {
  const session = await getServerSession(authOptions);

  const { pathname } = request.nextUrl;

  // ✅ Publicly accessible paths
  const isPublic =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api/auth");

  if (isPublic) {
    return NextResponse.next();
  }

  // ✅ If not logged in, redirect to signin
  if (!session || !session.user) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // ✅ Role-based route protection
  const role = session.user.role;

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (pathname.startsWith("/dashboard/student") && role !== "student") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // 👉 Add more roles here if needed
  // if (pathname.startsWith("/dashboard/teacher") && role !== "teacher") {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)", // Protect all except static
  ],
};
