'use server'

// app/api/generate-reset-token/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'

const SECRET_KEY = process.env.EMAIL_JMT

if (!SECRET_KEY) {
  throw new Error('Missing JWT_SECRET environment variable')
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // JWT 토큰 생성
  const token = jwt.sign({ email }, SECRET_KEY!, { expiresIn: '15m' })

  // 비밀번호 재설정 링크
  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`

  // Nodemailer 설정 및 이메일 전송
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      text: `To reset your password, click on the following link: ${resetLink}`,
      html: `<p>To reset your password, click on the following link:</p><a href="${resetLink}">Reset Password</a>`,
    })

    return NextResponse.json({ message: 'Password reset link sent' })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 })
  }
}
