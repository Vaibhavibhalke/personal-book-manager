import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, TOKEN_COOKIE } from "@/lib/auth";

const protectedPaths = ["/dashboard"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  const isProtectedPage = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  if (isProtectedPage) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await verifyToken(token);
    if (!session) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete(TOKEN_COOKIE);
      return response;
    }
  }

  if (isAuthPage && token) {
    const session = await verifyToken(token);
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
