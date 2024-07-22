import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      idx: string
      id: string
      name: string
      email: string
    }
  }
}
