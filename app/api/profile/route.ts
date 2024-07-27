import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import authOptions from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) throw new Error('세션이 존재하지 않습니다.')

  try {
    const users = await prisma.user.findUnique({
      where: {
        idx: session.user?.idx!,
      },
    })

    if (!users) throw new Error('사용자 프로필 정보 조회에 실패했습니다.')

    return NextResponse.json(users)
  } catch (error) {
    throw new Error(`Profile Error: ${error}`)
  }
}
