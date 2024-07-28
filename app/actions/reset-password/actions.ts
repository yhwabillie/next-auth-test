'use server'

import jwt, { JwtPayload } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const SECRET_KEY = process.env.EMAIL_JMT

if (!SECRET_KEY) {
  throw new Error('Missing JWT_SECRET environment variable')
}

// 사용자 정의 타입 정의
interface CustomJwtPayload extends JwtPayload {
  email: string
}

export async function resetPassword(token: string, newPassword: string) {
  if (!token || !newPassword) {
    throw new Error('Token and new password are required')
  }

  try {
    // 'unknown'으로 캐스팅한 후에 기대하는 타입으로 다시 캐스팅
    const decoded = jwt.verify(token, SECRET_KEY!) as unknown as CustomJwtPayload

    if (!decoded.email) {
      throw new Error('Token does not contain email')
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 여기에 사용자 비밀번호 업데이트 로직을 추가하세요.
    // 예: await updateUserPassword(decoded.email, hashedPassword);

    return { message: 'Password has been reset' }
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}
