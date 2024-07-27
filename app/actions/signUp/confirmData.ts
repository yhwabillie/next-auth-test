'use server'
import prisma from '@/lib/prisma'

interface confirmEmailParams {
  field_name: string
  new_value: string
}

export const confirmDuplicateData = async ({ field_name, new_value }: confirmEmailParams) => {
  if (field_name === 'id') {
    try {
      const userID = await prisma.user.findUnique({
        where: {
          id: new_value,
        },
      })

      if (userID) {
        return { field_name: 'id', success: false }
      } else if (!userID) {
        return { field_name: 'id', success: true }
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (field_name === 'email') {
    try {
      const userEmail = await prisma.user.findUnique({
        where: {
          email: new_value,
        },
      })

      if (userEmail) {
        return { field_name: 'email', success: false }
      } else if (!userEmail) {
        return { field_name: 'email', success: true }
      }
    } catch (error) {
      console.log(error)
    }
  }
}
