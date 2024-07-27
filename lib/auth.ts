import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import dotenv from 'dotenv'
dotenv.config()

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
        try {
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

          if (!response.ok) throw new Error('로그인 정보 조회에 실패했습니다.')

          //비밀번호를 제외한 데이터 return
          const user = await response.json()
          const { password, ...withoutPW } = user
          console.log('signin api에서 받은거======================>', withoutPW)
          return withoutPW
        } catch (error) {
          //signin api에서 인풋데이터 검증 중 일으킨 에러를 반환
          console.log('Authorize Error======================>', error)
          //signin api에서 받은 error 결과 프론트로 전달
          throw new Error('ID 혹은 비밀번호가 맞지 않습니다.')
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/signIn',
  },
  session: {},
  callbacks: {
    // signIn: async ({ user, account, profile, email, credentials }) => {
    //   return true
    // },
    jwt: async ({ token, user }) => {
      // authorize callback으로 리턴받은 user 객체
      // 기본 제공 키값중 email을 이용하여 필요한 로그인 사용자 DB 정보 조회
      // user 객체에 다시 재정제 및 정제 데이터를 token으로 다시 리턴
      try {
        if (user) {
          const userInfo = await prisma.user.findUnique({
            where: {
              email: token.email!,
            },
            select: {
              idx: true,
              name: true,
              user_type: true,
              profile_img: true,
            },
          })

          token.user = {}
          token.user.idx = userInfo?.idx
          token.user.name = userInfo?.name
          token.user.user_type = userInfo?.user_type
          token.user.profile_img = userInfo?.profile_img
        }

        return token
      } catch (error) {
        throw new Error(`Token Error======================>: ${error}`)
      }
    },

    session: async ({ session, token }) => {
      //리턴된 token 정보를 session 내부에 추가
      //session 리턴
      try {
        session.user = token.user

        return session
      } catch (error) {
        throw new Error(`Session Error======================>: ${error}`)
      }
    },
  },
}

export default authOptions
