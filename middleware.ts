import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
export { default } from 'next-auth/middleware'

// export async function middleware(request: NextRequest) {
//   const accessToken = cookies().get('next-auth.session-token')

//   if (!accessToken) {
//     if (request.nextUrl.pathname.startsWith('/profile')) {
//       return NextResponse.redirect(new URL('/signIn', request.url))
//     }
//   }

//   if (accessToken) {
//     if (request.nextUrl.pathname.startsWith('/signIn') || request.nextUrl.pathname.startsWith('/signUp')) {
//       return NextResponse.redirect(new URL('/', request.url))
//     }
//   }
// }

export const config = {
  matcher: ['/profile/:path*'],
}
