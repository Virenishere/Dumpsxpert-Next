import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth/authOptions";

export async function middleware(request) {
  const session = await getServerSession(authOptions);

  const { pathname } = request.nextUrl;

  // const isPublic =
  //   pathname === "/" ||
  //   pathname.startsWith("/auth/signin") ||
  //   pathname.startsWith("/auth/signup") ||
  //   pathname.startsWith("/api/auth");

  if (isPublic) {
    return NextResponse.next();
  }

  // if (!session || !session.user) {
  //   return NextResponse.redirect(new URL("/auth/signin", request.url));
  // }

  const role = session.user.role;

  // if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  // if (pathname.startsWith("/dashboard/student") && role !== "student") {
  //   return NextResponse.redirect(new URL("/unauthorized", request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};