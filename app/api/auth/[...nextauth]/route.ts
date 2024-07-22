import NextAuth, { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
require('dotenv').config()

//로그인 API 로직을 NextAuth에 적용

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

        //signIn API에서 저장한 데이터를 다시 user 객체로 리턴
        //nextAuth는 이 객체에 내용이 있으면 로그인 했다고 인식
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
  session: {},
  callbacks: {
    async session({ session }) {
      const userInfo = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          idx: true,
        },
      })

      session.user.idx = userInfo?.idx!

      return session
    },
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
