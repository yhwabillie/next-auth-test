'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'
import { NextRequest } from 'next/server'

export const fetchProfileData = async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('User not authenticated')
    }

    const user = await prisma.user.findUnique({
      where: { idx: session.user.idx! },
      select: {
        idx: true,
        user_type: true,
        id: true,
        email: true,
        name: true,
        password: true,
        profile_img: true,
        agreements: {
          select: {
            id: true,
            agreed: true,
            createdAt: true,
            updatedAt: true,
            type: true,
          },
        },
      },
    })

    if (!user) {
      throw new Error('User not found')
    }

    return user
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw new Error('Failed to fetch user data')
  }

  // try {
  //   const response = await fetch(`${process.env.NEXTAUTH_URL}/api/profile`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   })
  //   if (!response.ok) {
  //     throw new Error('Failed to fetch user profile information')
  //   }
  //   return await response.json()
  // } catch (error) {
  //   console.error('Error fetching user profile information:', error)
  //   return null
  // }
}
