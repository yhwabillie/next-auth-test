'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export const fetchCartList = async (userIdx: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('User not authenticated')
    }

    const cartlist = await prisma.cartList.findMany({
      where: {
        userIdx: session.user.idx,
      },
      select: {
        product: {
          select: {
            category: true,
            discount_rate: true,
            idx: true,
            name: true,
            imageUrl: true,
            original_price: true,
          },
        },
        quantity: true,
      },
    })
    return cartlist
  } catch (error) {
    console.error('Error adding to cartlist:', error)
    throw new Error('Failed to add to cartlist')
  }
}

export const fetchCartlistIdx = async (userIdx: string) => {
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

    // 장바구니 항목 갯수 조회
    const cartlistCount = await prisma.cartList.count({
      where: {
        userIdx: userIdx,
      },
    })

    return cartlistCount
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

    // 장바구니 항목 갯수 조회
    const cartlistCount = await prisma.cartList.count({
      where: {
        userIdx: userIdx,
      },
    })

    return cartlistCount
  } catch (error) {
    console.error('Error removing from cartlist:', error)
    throw new Error('Failed to remove from cartlist')
  }
}
