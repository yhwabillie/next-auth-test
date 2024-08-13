'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { ProductType } from '../products/actions'

export interface UserWishType {
  product: ProductType
}

/**
 * 사용자 위시리스트 READ 함수.
 *
 * 주어진 사용자 ID(userIdx)를 기준으로 해당 사용자의 위시리스트를 가져옵니다.
 * 각 위시리스트 항목에는 제품(product)의 기본 정보가 포함되어 있습니다.
 *
 * @param userIdx - 위시리스트를 가져올 사용자의 고유 ID
 * @returns {Promise<UserWishType[]>} - 사용자의 위시리스트를 나타내는 객체 배열
 * @throws {Error}
 */
export const fetchWishlist = async (userIdx: string): Promise<UserWishType[]> => {
  try {
    let wishlist = await prisma.wishlist.findMany({
      where: {
        userIdx,
      },
      select: {
        product: {
          select: {
            idx: true,
            name: true,
            category: true,
            original_price: true,
            discount_rate: true,
            imageUrl: true,
          },
        },
      },
    })

    // 각 위시리스트 항목에 대해 장바구니에 있는지 확인
    const wishlistWithCartStatus = await Promise.all(
      wishlist.map(async (item) => {
        const isInCart = await prisma.cartList.findUnique({
          where: {
            userIdx_productIdx: {
              userIdx: userIdx,
              productIdx: item.product.idx,
            },
          },
        })
        return {
          ...item,
          product: {
            ...item.product,
            isInCart: !!isInCart,
          },
        }
      }),
    )

    return wishlistWithCartStatus
  } catch (error) {
    console.error(`Failed to fetch wishlist for user ${userIdx} at ${new Date().toISOString()}:`, error)
    if (error instanceof Error) {
      throw new Error('Failed to fetch wishlist: ' + error.message)
    }
    throw new Error('Failed to fetch wishlist due to an unknown error')
  }
}

/**
 * 위시리스트에 있는 제품을 장바구니에 추가하거나 제거하는 UPDATE 함수.
 *
 * 주어진 사용자 ID(userIdx)와 제품 ID(productIdx)를 기반으로,
 * 제품이 위시리스트에 있는지 확인한 후, 장바구니에 제품을 추가하거나 제거합니다.
 * 이후, 장바구니에 남아있는 제품의 총 수량을 반환합니다.
 *
 * @param {string} userIdx - 사용자의 고유 ID
 * @param {string} productIdx - 제품의 고유 ID
 * @returns {Promise<{ success: boolean, cartlistCount: number, toggleStatus: boolean }>}
 *  - success: 작업 성공 여부
 *  - cartlistCount: 장바구니에 남아있는 제품의 총 수량
 *  - toggleStatus: 제품이 장바구니에 추가되었는지 여부 (true: 추가됨, false: 제거됨)
 * @throws {Error}
 */
export const toggleWishlistToCart = async (
  userIdx: string,
  productIdx: string,
): Promise<{ success: boolean; cartlistCount: number; toggleStatus: boolean }> => {
  try {
    // 트랜잭션 시작
    return await prisma.$transaction(async (prisma) => {
      // 위시리스트에서 해당 제품을 찾음
      const targetWishItem = await prisma.wishlist.findUnique({
        where: {
          userIdx_productIdx: {
            userIdx,
            productIdx,
          },
        },
      })

      if (!targetWishItem) throw new Error('Product not found in wishlist')

      // 장바구니에서 해당 제품이 있는지 확인
      const cartItem = await prisma.cartList.findUnique({
        where: {
          userIdx_productIdx: {
            userIdx,
            productIdx,
          },
        },
      })

      let toggleStatus: boolean

      if (cartItem) {
        // 장바구니에서 제거
        await prisma.cartList.delete({
          where: {
            userIdx_productIdx: {
              userIdx,
              productIdx,
            },
          },
        })
        toggleStatus = false // 장바구니에서 제거됨
      } else {
        // 장바구니에 추가
        await prisma.cartList.create({
          data: {
            userIdx,
            productIdx,
            quantity: 1,
          },
        })
        toggleStatus = true // 장바구니에 추가됨
      }

      // 장바구니 항목 갯수 조회
      const cartlistCount = await prisma.cartList.count({
        where: {
          userIdx: userIdx,
        },
      })

      return {
        success: true,
        cartlistCount,
        toggleStatus,
      }
    })
  } catch (error) {
    console.error(`Failed to toggle product in cart for user ${userIdx}:`, error)
    throw new Error('Failed to toggle product in cart')
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
    return { success: true }
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    throw new Error('Failed to remove from wishlist')
  }
}

//product list
export const fetchWishlistIdx = async (userIdx: string) => {
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
