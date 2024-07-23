import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
export { default } from 'next-auth/middleware'

export async function middleware(request: NextRequest) {
  const accessToken = cookies().get('next-auth.session-token')

  if (!accessToken) {
    if (request.nextUrl.pathname.startsWith('https://next-auth-test-sage.vercel.app/profile')) {
      return NextResponse.redirect(new URL('https://next-auth-test-sage.vercel.app/signIn', request.url))
    }
  }

  if (accessToken) {
    if (request.nextUrl.pathname.startsWith('https://next-auth-test-sage.vercel.app/signIn') || request.nextUrl.pathname.startsWith('/signUp')) {
      return NextResponse.redirect(new URL('https://next-auth-test-sage.vercel.app', request.url))
    }
  }
}

export const config = {
  matcher: ['/', '/signIn/:path*', '/signUp/:path*', '/profile/:path*'],
}
