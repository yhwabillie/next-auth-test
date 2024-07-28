import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

declare module 'next-auth' {
  interface Session {
    user?: {
      idx?: string | undefined | null
      id?: string | undefined | null
      name?: string | undefined | null
      email?: string | undefined | null
      profile_img?: string | undefined | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: {
      idx?: string | undefined | null
      name?: string | undefined | null
      user_type?: string | undefined | null
      profile_img?: string | undefined | null
    }
  }
}
