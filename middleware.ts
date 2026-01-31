import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionFromCookie, verifySessionEdge } from "@/lib/admin/session-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rotas /admin/* exceto /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const cookieHeader = request.headers.get("cookie");
    const token = getSessionFromCookie(cookieHeader);

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    // Verificar sessão usando Web Crypto API (compatível com Edge)
    const secret = process.env.ADMIN_COOKIE_SECRET;
    if (!secret) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    const session = await verifySessionEdge(token, secret);
    if (!session) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
