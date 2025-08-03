import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Public routes
  if (
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // Protected routes
  if (!token) {
    const url = new URL("/auth/signin", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // Role-based and subscription-based access control
  // if (pathname.startsWith("/dashboard")) {
  //   const role = token.role || "guest";
  //   const subscription = token.subscription || "no";

<<<<<<< HEAD
    // Determine the target dashboard based on role and subscription
    let targetDashboard = "/dashboard/guest"; // Default to guest
    if (role === "admin") {
      targetDashboard = "/dashboard/admin";
    } else if (role === "student" && subscription === "yes") {
      targetDashboard = "/dashboard/student";
    }
=======
  //   // Determine the target dashboard based on role and subscription
  //   let targetDashboard = "/dashboard/guest"; // Default to guest
  //   if (role === "admin") {
  //     targetDashboard = "/dashboard/admin";
  //   } else if (subscription === "yes") {
  //     targetDashboard = "/dashboard/student";
  //   }
>>>>>>> 9db8d3de2e2e2b9e06eab4aa12159df64ba9d441

  //   // Redirect to role-specific or subscription-specific dashboard if accessing generic /dashboard
  //   if (pathname === "/dashboard") {
  //     const dashboardUrl = new URL(targetDashboard, request.url);
  //     return NextResponse.redirect(dashboardUrl);
  //   }

  //   // Restrict access to specific dashboards based on role or subscription
  //   if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
  //     return NextResponse.redirect(new URL("/unauthorized", request.url));
  //   }

    if (
      pathname.startsWith("/dashboard/student") &&
      (role !== "student" || subscription !== "yes")
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

  //   if (pathname.startsWith("/dashboard/guest") && role !== "guest") {
  //     return NextResponse.redirect(new URL("/unauthorized", request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};