'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export const fetchCartlist = async (userIdx: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('User not authenticated')
    }

    const cartlist = await prisma.cartList.findMany({
      where: {
        userIdx,
      },
      select: {
        productIdx: true,
      },
    })

    return cartlist
  } catch (error) {
    console.error('Error adding to cartlist:', error)
    throw new Error('Failed to add to cartlist')
  }
}

export const addToCartlist = async (userIdx: string, productIdx: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('User not authenticated')
    }

    const cartlist = await prisma.cartList.create({
      data: {
        userIdx: userIdx,
        productIdx: productIdx,
        quantity: 1,
      },
    })

    return cartlist
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw new Error('Failed to add to wishlist')
  }
}

export const removeFromCartlist = async (userIdx: string, productIdx: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('User not authenticated')
    }

    await prisma.cartList.delete({
      where: {
        userIdx_productIdx: {
          userIdx: userIdx,
          productIdx: productIdx,
        },
      },
    })
    return { message: 'Removed from cartlist' }
  } catch (error) {
    console.error('Error removing from cartlist:', error)
    throw new Error('Failed to remove from cartlist')
  }
}
