import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard and room routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/room")) {
    // Check for session cookie (BetterAuth uses 'better-auth.session_token' by default)
    // Note: This is a basic check. For full security, validate the token with the server/database.
    // Since middleware runs on edge/node, we can't easily hit the DB directly without an adapter.
    // For this demo, checking the cookie existence is a "good enough" first barrier.
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      const url = request.nextUrl.clone();
      url.pathname = "/api/auth/signin";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/room/:path*"],
};
