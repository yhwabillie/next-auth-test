import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
require('dotenv').config()

// auth 옵션 객체
const authOptions: NextAuthOptions = {
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
      // authorize callback으로 리턴받은 user 객체
      // 기본 제공 키값중 email을 이용하여 필요한 로그인 사용사 DB 정보 추출
      // user 객체에 다시 재정제 및 정제 데이터를 token으로 다시 리턴
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

    session: async ({ session, token }) => {
      //리턴된 token 정보를 session 내부에 추가
      // session 리턴
      session.user = token.user

      return session
    },
  },
}

export default authOptions
