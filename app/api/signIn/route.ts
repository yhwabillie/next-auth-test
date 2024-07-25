import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const requestBody = await request.json()
  const user = await prisma.user.findUnique({
    where: {
      id: requestBody.id,
    },
  })

  // 사용자 ID 검증
  if (!user) {
    throw new Error('==========================> i dont have this id')
  }

  // 비밀번호 검증
  const isPasswordCorrect = await bcrypt.compare(requestBody.password, user.password)
  if (!isPasswordCorrect) {
    throw new Error('==========================> wrong pw')
  }

  // 사용자 인증 성공
  return NextResponse.json(user)
}
