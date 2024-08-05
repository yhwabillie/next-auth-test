'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export const fetchWishlist = async (userIdx: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('User not authenticated')
    }

    const wishlist = await prisma.wishlist.findMany({
      where: {
        userIdx,
      },
      select: {
        productIdx: true,
      },
    })

    return wishlist
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw new Error('Failed to add to wishlist')
  }
}

export const addToWishlist = async (userIdx: string, productIdx: string) => {
  try {
    const wishlistItem = await prisma.wishlist.create({
      data: {
        userIdx: userIdx,
        productIdx: productIdx,
      },
    })

    return wishlistItem
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    throw new Error('Failed to add to wishlist')
  }
}

export const removeFromWishlist = async (userIdx: string, productIdx: string) => {
  try {
    await prisma.wishlist.delete({
      where: {
        userIdx_productIdx: {
          userIdx: userIdx,
          productIdx: productIdx,
        },
      },
    })
    return { message: 'Removed from wishlist' }
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw new Error('Failed to remove from wishlist')
  }
}
