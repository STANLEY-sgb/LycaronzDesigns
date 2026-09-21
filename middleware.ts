import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Node.js runtime middleware for LYCARONZ DESIGNS.
 * Runs on the Node.js runtime to eliminate Edge runtime deprecation warnings,
 * using `getToken` from next-auth/jwt for fast token-based route protection.
 */
export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
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
  runtime: 'nodejs',
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
