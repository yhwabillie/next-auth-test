import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.EMAIL_JMT

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req })
  const isAuthenticated = !!token

  if (isAuthenticated) {
    if (req.nextUrl.pathname.startsWith(`/signIn`) || req.nextUrl.pathname.startsWith(`/signUp`) || req.nextUrl.pathname.startsWith(`/forgotPw`)) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  if (!isAuthenticated) {
    if (req.nextUrl.pathname.startsWith(`/profile`)) {
      return NextResponse.redirect(new URL('/signIn', req.url))
    }
  }

  if (!SECRET_KEY) {
    throw new Error('Missing JWT_SECRET environment variable')
  }

  // reset-password url이 토큰이 없거나 유효하지 않으면 리다이렉트
  if (req.nextUrl.pathname.startsWith(`/reset-password`)) {
    try {
      const url = new URL(req.url)
      const pwToken = url.searchParams.get('token') // 현재 URL을 파싱하고 쿼리 파라미터를 가져옴
      console.log('쿼리 파라미터pwToken============>', pwToken)

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
  matcher: '/reset-password/:path*',
}
