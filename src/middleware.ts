import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/admin/login')

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/admin', req.url))
      }
      return null
    }

    // Check if user has admin or staff role
    if (token && token.role !== 'ADMIN' && token.role !== 'STAFF') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }

    return null
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to login page without auth
        if (req.nextUrl.pathname.startsWith('/admin/login')) {
          return true
        }
        // Require auth for all other admin pages
        return !!token
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
