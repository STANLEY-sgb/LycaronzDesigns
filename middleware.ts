import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Edge-compatible middleware for LYCARONZ DESIGNS.
 * Uses `getToken` from next-auth/jwt for fast JWT-based route protection.
 * Middleware always runs on the Edge runtime in Next.js — no runtime config key is needed.
 */
export async function middleware(req: NextRequest) {
  const useSecureCookies = process.env.NODE_ENV === "production";
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    secureCookie: useSecureCookies,
  });

  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginPage  = pathname === '/admin/login';

  // Redirect unauthenticated users away from protected admin routes
  if (isAdminRoute && !isLoginPage && !token) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  // Redirect already-authenticated users away from the login page
  if (isLoginPage && token) {
    const url = req.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
