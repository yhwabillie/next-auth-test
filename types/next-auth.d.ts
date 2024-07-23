import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user?: {
      idx?: string | undefined | null
      id?: string | undefined | null
      name?: string | undefined | null
      email?: string | undefined | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    // 위 코드예시에서 name과 email을 보낸것들에 대한 값에 대해 타입설정을 해준다
    user?: {
      idx?: string | undefined | null
      id?: string | undefined | null
      name?: string | undefined | null
      email?: string | undefined | null
    }
  }
}
