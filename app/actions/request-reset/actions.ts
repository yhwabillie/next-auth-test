// app/request-reset/actions.ts
'use server'

import jwt from 'jsonwebtoken'
import nodemailer from 'nodemailer'
import prisma from '@/lib/prisma'

const SECRET_KEY = process.env.EMAIL_JMT

if (!SECRET_KEY) {
  throw new Error('Missing JWT_SECRET environment variable')
}

export async function sendPasswordResetEmail(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  })

  if (!user) {
    throw new Error('Email is required')
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

  await transporter.sendMail({
    from: `"Your App" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: 'Password Reset Request',
    text: `To reset your password, click on the following link: ${resetLink}`,
    html: `<p>To reset your password, click on the following link:</p><a href="${resetLink}">Reset Password</a>`,
  })

  return { message: 'Password reset link sent' }
}
