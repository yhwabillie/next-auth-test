'use server'

import prisma from '@/lib/prisma'
import { NextRequest } from 'next/server'

interface UpdateUsernameParams {
  idx: string
  new_name: string
}

export const updateUserName = async ({ idx, new_name }: UpdateUsernameParams) => {
  try {
    const user = await prisma.user.update({
      where: {
        idx: idx,
      },
      data: {
        name: new_name,
      },
    })

    return { success: true, user }
  } catch (error) {
    console.log(error)
    return { success: false, error: 'Failed to update username' }
  }
}
