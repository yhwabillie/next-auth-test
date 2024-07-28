'user server'

// app/api/reset-password/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.EMAIL_JMT

if (!SECRET_KEY) {
  throw new Error('Missing JWT_SECRET environment variable')
}

// 사용자 정의 페이로드 타입 정의
interface CustomJwtPayload extends JwtPayload {
  email: string
}

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json()

  if (!token || !newPassword) {
    return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 })
  }

  try {
    // 'unknown'으로 캐스팅한 후, 기대하는 타입으로 다시 캐스팅
    const decoded = jwt.verify(token, SECRET_KEY!) as unknown as CustomJwtPayload

    if (!decoded.email) {
      throw new Error('Token does not contain email')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 여기에 사용자 비밀번호 업데이트 로직을 추가하세요.
    // 예: await updateUserPassword(decoded.email, hashedPassword);

    return NextResponse.json({ message: 'Password has been reset' })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
  }
}
