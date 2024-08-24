import { NextResponse } from "next/server";

export default function middleware(request) {
  const cookies = request.cookies;
  const usertoken = cookies.get("next-auth.session-token"); // Use the correct cookie name
  const url = request.nextUrl.clone();

  // Skip redirection for static files and API routes
  if (url.pathname.startsWith("/_next") || url.pathname.startsWith("/api") || url.pathname.startsWith("/static")) {
    return NextResponse.next();
  }

  // Redirect authenticated users away from the login or signup page to the dashboard
  if (usertoken && (url.pathname === "/login/" || url.pathname === "/signup/")) {
    url.pathname = '/dashboard/';
    return NextResponse.redirect(url);
  }

  // Redirect unauthenticated users to the login page if they try to access any other route
  if (!usertoken && url.pathname !== "/login/" && url.pathname !== "/signup/") {
    url.pathname = '/login/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/:path*'] // Apply the middleware to all routes
};
