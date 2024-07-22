import { withAuth } from 'next-auth/middleware'

export default withAuth({
  pages: {
    signIn: '/signIn', // 인증되지 않은 사용자가 리디렉션될 페이지
  },
})

export const config = {
  matcher: ['/profile/:path'],
}
