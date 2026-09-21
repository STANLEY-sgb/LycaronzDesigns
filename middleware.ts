import { auth } from "@/auth"

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin")
  const isLoginPage = req.nextUrl.pathname === "/admin/login"

  if (isAdminRoute && !isLoggedIn && !isLoginPage) {
    return Response.redirect(new URL("/admin/login", req.nextUrl))
  }

  if (isLoginPage && isLoggedIn) {
    return Response.redirect(new URL("/admin/dashboard", req.nextUrl))
  }

  return null
})

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
