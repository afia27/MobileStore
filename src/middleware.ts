import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: Request) {
  const url = new URL(req.url);
  const pathname = url.pathname;

  // Public paths always allowed
  const publicPaths = ["/", "/api", "/_next", "/favicon.ico", "/user/signin", "/user/signup", "/admin/signin"];
  if (publicPaths.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });

  // Protect admin
  if (pathname.startsWith("/admin")) {
    if (!token || (token as any).role !== "admin") {
      url.pathname = "/admin/signin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // Protect user pages (products, cart, success, user transactions, dynamic user transactions)
  const protectedUserPrefixes = ["/products", "/cart", "/success", "/users/transactions"]; // dynamic handled below
  if (protectedUserPrefixes.some((p) => pathname.startsWith(p))) {
    if (!token) {
      url.pathname = "/user/signin";
      return NextResponse.redirect(url);
    }
  }
  // Dynamic /[user_id]/transactions
  const dynMatch = pathname.match(/^\/(.+)\/transactions\/?$/);
  if (dynMatch) {
    if (!token) {
      url.pathname = "/user/signin";
      return NextResponse.redirect(url);
    }
    const userId = dynMatch[1];
    if ((token as any).userId !== userId) {
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/:path*"] };


