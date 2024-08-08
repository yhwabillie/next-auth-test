'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export const addNewOrder = async (result: any) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      throw new Error('You must be logged in to create an order')
    }

    const newOrder = await prisma.order.create({
      data: {
        userIdx: result.userIdx,
        addressIdx: result.addressIdx,
        total_amount: 13.4,
        orderItems: {
          create: result.orderItems.map((item: any) => ({
            productIdx: item.idx,
            quantity: 123,
            price: 123.4,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    if (!newOrder) {
      throw new Error('error')
    }

    return newOrder
  } catch (error: any) {
    throw new Error(error)
  }
}
