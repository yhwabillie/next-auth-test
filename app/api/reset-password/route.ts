import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
// export const maxDuration = 300
export const dynamic = 'force-dynamic'

const SECRET_KEY = process.env.RESET_PW_JWT

// if (!SECRET_KEY) {
//   throw new Error('환경변수 RESET_PW_JWT 누락')
// }

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('req body =======>', body)

  if (!body.reset_token || !body.new_input_pw) {
    return NextResponse.json({ status: 'fail', message: '비밀번호 갱신 토큰 혹은 전송된 신규 비밀번호가 누락되었습니다.' })
  }

  //토큰 검증 및 신규 비밀번호 암호화 해싱후 DB 저장
  try {
    const { payload } = await jwtVerify(body.reset_token, new TextEncoder().encode(SECRET_KEY))
    const input_email = payload.input_email as string
    const hashedPassword = await bcrypt.hash(body.new_input_pw, 10) //신규 비밀번호 해싱 암호화
    console.log('input_email =======>', input_email)
    console.log('Hashed New PW =======>', hashedPassword)

    const user = await prisma.user.update({
      where: {
        email: input_email,
      },
      data: {
        password: hashedPassword,
      },
    })

    if (!user) {
      return NextResponse.json({ status: 'fail', message: '해당 이메일에 대한 정보 없음, 비밀번호 갱신 실패' })
    }

    return NextResponse.json({ status: 'success', message: '비밀번호가 갱신되었습니다. 다시 로그인해주세요.' })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ status: 'fail', message: '유효기한이 만료된 토큰 링크입니다. 다시 시도해주세요.' })
  }
}
