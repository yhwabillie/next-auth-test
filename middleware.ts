import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.RESET_PW_JWT

if (!SECRET_KEY) {
  throw new Error('Missing JWT_SECRET environment variable')
}

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token
  const isIndivisual = token?.user?.user_type === 'indivisual'
  const isAdmin = token?.user?.user_type === 'admin'

  if (isAuthenticated) {
    if (
      req.nextUrl.pathname.startsWith(`/signIn`) ||
      req.nextUrl.pathname.startsWith(`/signUp`) ||
      req.nextUrl.pathname.startsWith(`/request-reset`) ||
      req.nextUrl.pathname.startsWith(`/reset-password`)
    ) {
      return NextResponse.redirect(new URL('/not-authorized', req.url))
    }

    //일반 회원
    if (isIndivisual) {
      if (req.nextUrl.pathname.startsWith(`/add-product`)) {
        return NextResponse.redirect(new URL('/not-authorized', req.url))
      }
    }

    //관리자 회원
    if (isAdmin) {
      if (req.nextUrl.pathname.startsWith(`/my-shopping`)) {
        return NextResponse.redirect(new URL('/not-authorized', req.url))
      }
    }
  }

  if (!isAuthenticated) {
    if (
      req.nextUrl.pathname.startsWith(`/profile`) ||
      req.nextUrl.pathname.startsWith(`/my-shopping`) ||
      req.nextUrl.pathname.startsWith(`/add-product`)
    ) {
      return NextResponse.redirect(new URL('/signIn', req.url))
    }
  }

  // reset-password url이 토큰이 없거나 유효하지 않으면 리디렉트
  if (req.nextUrl.pathname.startsWith(`/reset-password`)) {
    try {
      const url = new URL(req.url)
      const pwToken = url.searchParams.get('token') // 현재 URL을 파싱하여 token 쿼리 파라미터를 가져옴

      if (!pwToken) {
        return NextResponse.redirect(new URL('/error?message=Token%20is%20required', req.url))
      }

      const decoded = await jwtVerify(pwToken, new TextEncoder().encode(SECRET_KEY))
      console.log('decode========>', decoded) // 유효한 경우, 디코딩된 페이로드 객체 출력

      return NextResponse.next()
    } catch (err) {
      console.log('err===============>', err)
      return NextResponse.redirect(new URL('/error?message=Invalid%20or%20expired%20token', req.url))
    }
  }
}

export const config = {
  matcher: [
    '/reset-password/:path*',
    '/profile/:path*',
    '/my-shopping/:path*',
    '/add-product/:path*',
    '/signIn/:path*',
    '/signUp/:path*',
    '/request-reset/:path*',
  ],
}
