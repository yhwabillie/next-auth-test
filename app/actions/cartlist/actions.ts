'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

export interface CartItemType {
  product: {
    category: string
    discount_rate: number
    idx: string
    name: string
    imageUrl: string
    original_price: number
  }
  quantity: number
}

/**
 * 사용자의 장바구니 목록을 조회하는 함수.
 *
 * 주어진 사용자 ID(userIdx)를 기반으로 해당 사용자의 장바구니 목록을 데이터베이스에서 조회하여 반환합니다.
 * 각 장바구니 항목에는 제품 정보와 제품의 수량이 포함됩니다.
 *
 * @param {string} userIdx - 장바구니를 조회할 사용자의 고유 ID.
 * @returns {Promise<CartItemType[]>} - 사용자의 장바구니 항목 배열을 반환합니다.
 * @throws {Error}
 */
export const fetchCartList = async (userIdx: string): Promise<CartItemType[]> => {
  try {
    const cartlist = await prisma.cartList.findMany({
      where: {
        userIdx,
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
    console.error('Error fetching cart list:', error)
    throw new Error('Failed to fetch cart list')
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

/**
 * 사용자의 장바구니에서 특정 제품을 제거하고, 남아있는 장바구니 항목의 수를 반환하는 함수.
 *
 * 이 함수는 주어진 사용자 ID (`userIdx`)와 제품 ID (`productIdx`)를 기반으로
 * 사용자의 장바구니에서 해당 제품을 삭제합니다. 삭제 후, 남아있는 장바구니 항목의 수를 반환합니다.
 *
 * @param {string} userIdx - 장바구니에서 제품을 제거할 사용자의 고유 ID.
 * @param {string} productIdx - 장바구니에서 제거할 제품의 고유 ID.
 * @returns {Promise<{ success: boolean; cartlistCount: number }>}
 *          성공 여부와 남아있는 장바구니 항목의 수를 포함하는 객체를 반환합니다.
 *
 * @throws {Error}
 */
export const removeFromCartlist = async (userIdx: string, productIdx: string): Promise<{ success: boolean; cartlistCount: number }> => {
  try {
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

    return {
      success: true,
      cartlistCount,
    }
  } catch (error) {
    console.error(`Error removing product ${productIdx} from cartlist for user ${userIdx}:`, error)
    throw new Error('Failed to remove item from cartlist. Please try again.')
  }
}

export const removeBulkFromCartlist = async (userIdx: string, productIdxs: string[]) => {
  try {
    // 여러 제품을 장바구니에서 제거
    await prisma.cartList.deleteMany({
      where: {
        userIdx: userIdx,
        productIdx: {
          in: productIdxs,
        },
      },
    })

    // 장바구니 항목 갯수 조회
    const cartlistCount = await prisma.cartList.count({
      where: {
        userIdx: userIdx,
      },
    })

    return {
      success: true,
      cartlistCount,
    }
  } catch (error) {
    console.error(`Error removing products ${productIdxs.join(', ')} from cartlist for user ${userIdx}:`, error)
    throw new Error('Failed to remove items from cartlist. Please try again.')
  }
}
