import { NextRequest, NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import nodemailer from 'nodemailer'
// export const maxDuration = 300
export const dynamic = 'force-dynamic'

const SECRET_KEY = process.env.RESET_PW_JWT

if (!SECRET_KEY) {
  throw new Error('환경변수 RESET_PW_JWT 누락')
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  console.log('req body =======>', body)

  if (!body.input_email) {
    return NextResponse.json({ status: 'fail', message: '이메일 전송에 실패했습니다. 다시 제출해주세요.' })
  }

  // 비밀번호 재설정 JWT 토큰 생성
  const token = await new SignJWT({ input_email: body.input_email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('10m')
    .sign(new TextEncoder().encode(SECRET_KEY))

  // JWT 토큰이 포함된 비밀번호 재설정 링크
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`
  console.log('resetLink =======>', resetLink)

  // Nodemailer 설정
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  // 비밀번호 재설정 링크 이메일 전송
  try {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `To reset your password, click on the following link: ${resetLink}`,
      html: `<p>To reset your password, click on the following link:</p><a href="${resetLink}">Reset Password</a>`,
    })

    return NextResponse.json({ status: 'success', message: '비밀번호 갱신 이메일이 전송되었습니다.' })
  } catch (error) {
    return NextResponse.json({ status: 'fail', message: '비밀번호 갱신 이메일이 전송에 실패했습니다.' })
  }
}
