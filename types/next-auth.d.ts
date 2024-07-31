import NextAuth from 'next-auth'
import { JWT } from 'next-auth/jwt'

export type Provider = 'credential'
export type UserType = 'indivisual' | 'admin'

interface User {
  idx?: string
  provider?: Provider
  user_type?: UserType
  name?: string
  profile_img?: string
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User
  }
}

declare module 'next-auth' {
  interface Session {
    user?: User
  }
}
