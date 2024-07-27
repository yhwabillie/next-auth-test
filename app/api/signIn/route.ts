import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const body = await request.json()

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: body.id,
      },
    })

    // 사용자 ID 검증
    if (!user) throw new Error('==========================> 없는 아이디 입니다.')

    // 비밀번호 검증
    const isPasswordCorrect = await bcrypt.compare(body.password, user.password)
    if (!isPasswordCorrect) throw new Error('==========================> 잘못된 비밀번호 입니다.')

    // 사용자 인증 성공
    return NextResponse.json(user)
  } catch (error) {
    throw new Error(`SignIn Error: ${error}`)
  }
}
