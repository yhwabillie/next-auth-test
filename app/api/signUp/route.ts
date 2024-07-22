import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const { user_type, name, id, email, password } = await request.json()

  const new_user = await prisma.user.create({
    data: {
      provider: 'credential',
      user_type: user_type,
      name: name,
      id: id,
      email: email,
      password: password,
    },
  })

  return NextResponse.json(new_user)
}
