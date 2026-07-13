import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/orders", "/profile", "/checkout", "/wishlist"];
const AUTH_PATHS = ["/auth", "/signup", "/register"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public files, api, and next internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  const token = req.cookies.get("token")?.value;
  console.log(
    "pathname:",
    pathname,
    "token:",
    token,
    "isProtected:",
    isProtected,
  );

  if (
    AUTH_PATHS.some(
      (path) => pathname === path || pathname.startsWith(path + "/"),
    )
  ) {
    if (token) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!isProtected) return NextResponse.next();

  if (!token) {
    const url = new URL("/auth", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/orders/:path*", "/profile/:path*", "/checkout/:path*"],
};
