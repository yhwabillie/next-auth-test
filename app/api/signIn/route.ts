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

  if (!user) {
    return NextResponse.json({ error: 'DB dont have this ID' }, { status: 400 })
  }

  if (!(await bcrypt.compare(requestBody.password, user.password))) {
    return NextResponse.json({ error: 'Wrong PW' }, { status: 400 })
  }

  if (user && (await bcrypt.compare(requestBody.password, user.password))) {
    const { password, ...infoWithoutPW } = user

    return NextResponse.json(infoWithoutPW)
  } else {
    return NextResponse.json(null)
  }
}
