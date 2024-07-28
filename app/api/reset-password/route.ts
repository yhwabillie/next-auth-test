import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.JWT_SECRET

if (!SECRET_KEY) {
  throw new Error('Missing JWT_SECRET environment variable')
}

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json()

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
  }

  try {
    // 토큰 검증
    const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY))
    const email = payload.email as string

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 여기에 사용자 비밀번호 업데이트 로직을 추가하세요.
    // 예: await updateUserPassword(email, hashedPassword);

    return NextResponse.json({ message: 'Password has been reset' })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }
}
