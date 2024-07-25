import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  const requestBody = await request.json()
  const hashedPassword = bcrypt.hashSync(requestBody.password, 10)

  try {
    const new_user = await prisma.user.create({
      data: {
        provider: 'credential',
        user_type: requestBody.user_type,
        name: requestBody.name,
        id: requestBody.id,
        email: requestBody.email,
        password: hashedPassword,
      },
    })

    const { password, ...infoWithOutPW } = new_user
    return NextResponse.json(infoWithOutPW)
  } catch (error) {
    throw new Error(`==========================> ${error}`)
  }
}
