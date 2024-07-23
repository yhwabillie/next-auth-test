import NextAuth, { AuthOptions, Session, Awaitable } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
require('dotenv').config()

// auth 옵션 객체
export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        id: { label: 'Id', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        const response = await fetch(`${process.env.NEXTAUTH_URL}/api/signIn`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: credentials?.id,
            password: credentials?.password,
          }),
        })

        //signIn Routes POST API에서 리턴한 프론트 데이터를 다시 user 객체로 리턴
        //이 객체에 내용이 있으면 로그인 했다고 인식
        const user = await response.json()

        if (response.ok && user) {
          console.log(user, '/// 로그인했어요')
          return user
        }

        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signIn',
  },
  session: {},
  callbacks: {
    jwt: async ({ token, user }) => {
      // authorize callback
      if (user) {
        const info = await prisma.user.findUnique({
          where: {
            email: token.email!,
          },
          select: {
            idx: true,
            name: true,
          },
        })

        token.user = {}
        token.user.idx = info?.idx
        token.user.name = info?.name
      }

      return token
    },

    //기존 세션 데이터 email을 가지고 DB를 검색하여
    //필요한 데이터를 세션에 추가
    session: async ({ session, token }) => {
      session.user = token.user

      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
