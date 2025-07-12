import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // ถ้าไม่ได้ login และเข้าหน้าที่ต้อง authentication
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/customizer') || pathname.startsWith('/collections') || pathname.startsWith('/model-configs'))) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // ถ้าเป็น admin route แต่ไม่ใช่ admin
    if ((pathname.startsWith('/admin') || pathname.startsWith('/model-configs')) && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // อนุญาตให้เข้าหน้า public ได้
        if (req.nextUrl.pathname.startsWith('/login') || 
            req.nextUrl.pathname.startsWith('/api/auth') ||
            req.nextUrl.pathname === '/') {
          return true
        }
        // สำหรับหน้าอื่นๆ ต้องมี token
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/customizer/:path*',
    '/collections/:path*',
    '/admin/:path*',
    '/model-configs/:path*',
    '/api/collections/:path*'
  ]
}
