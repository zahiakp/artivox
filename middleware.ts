import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { brandName } from "./app/data/branding";

const COOKIE_NAME = `${brandName}-access`;

const protectedRoutes: Record<string, string[]> = {
  "/campus": ["admin"],
  "/judgment": ["admin", "judge"],
  "/topics": ["admin", "judge"],
  "/judge": ["admin", "judge"],
  "/results": ["admin", "announce"],
  "/announcement": ["admin", "announce"],
  "/students": ["campus"],
  "/registration": ["admin", "report"],
  "/award": ["admin", "award", "result"],
  "/programs": ["admin", "campus"],
};

const unauthorizedRedirect = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/unauthorized", request.url));
};

const loginRedirect = (request: NextRequest) => {
  return NextResponse.redirect(new URL("/login", request.url));
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const pathname = url.pathname;
  const access = request.cookies.has(COOKIE_NAME);
  const cookie = request.cookies.get(COOKIE_NAME);

  let role: string | undefined = undefined;

  if (cookie) {
    try {
      role = JSON.parse(cookie.value).role;
    } catch (e) {
      console.error("Failed to parse role cookie:", e);

      const response = loginRedirect(request);
      response.cookies.delete(COOKIE_NAME);
      return response;
    }
  }

  if (access && role) {
    if (pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const matchingRoute = Object.keys(protectedRoutes).find((prefix) =>
      pathname.startsWith(prefix)
    );

    if (matchingRoute) {
      const allowedRoles = protectedRoutes[matchingRoute];

      if (!allowedRoles.includes(role)) {
        return unauthorizedRedirect(request);
      }
    }

    return NextResponse.next();
  }

  if (pathname.startsWith("/login") || pathname.startsWith("/unauthorized")) {
    return NextResponse.next();
  }

  return loginRedirect(request);
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/unauthorized",
    "/campus/:path*",
    "/results/:path*",
    "/programs/:path*",
    "/students/:path*",
    "/registration/:path*",
    "/judge/:path*",
    "/announcement/:path*",
    "/topics/:path*",
    "/judgment/:path*",
    "/award/:path*",
  ],
};
