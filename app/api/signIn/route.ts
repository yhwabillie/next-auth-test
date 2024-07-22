import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const { id, password } = await request.json()
  const existUserInfo = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })

  if (!existUserInfo) {
    return NextResponse.json({ error: 'DB dont have this ID' }, { status: 400 })
  }

  if (!(await bcrypt.compare(password, existUserInfo.password))) {
    return NextResponse.json({ error: 'Wrong PW' }, { status: 400 })
  }

  if (existUserInfo && (await bcrypt.compare(password, existUserInfo.password))) {
    const { password, ...infoWithoutPW } = existUserInfo

    return NextResponse.json(infoWithoutPW)
  }
}
