import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  if (isAuthenticated) {
    if (req.nextUrl.pathname.startsWith(`/signIn`) || req.nextUrl.pathname.startsWith(`/signUp`)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (!isAuthenticated) {
    if (req.nextUrl.pathname.startsWith(`/profile`)) {
      return NextResponse.redirect(new URL('/signIn', req.url))
    }
  }
}
