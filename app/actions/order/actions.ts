'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { UserAddressType } from '../address/actions'

/**
 * 선택 주문 배송지 업데이트
 */
export const updateOrderAddress = async (orderIdx: string, newAddressIdx: string) => {
  try {
    // 업데이트하려는 주소의 유효성 확인
    const addressExists = await prisma.address.findUnique({
      where: {
        idx: newAddressIdx,
      },
    })

    if (!addressExists) {
      throw new Error('업데이트하려는 주소 데이터가 존재하지 않습니다.')
    }

    // 주문의 주소 업데이트
    const updatedOrder = await prisma.order.update({
      where: {
        idx: orderIdx,
      },
      data: {
        addressIdx: newAddressIdx,
      },
      include: {
        address: true,
      },
    })

    return updatedOrder
  } catch (error: any) {
    console.error('주문 주소 업데이트 중 오류 발생:', error)
    throw new Error('주문 주소 업데이트에 실패했습니다. 다시 시도해주세요.')
  }
}

/**
 * 선택 주문 삭제
 */
export const removeOrder = async (orderIdx: string) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('You must be logged in to create an order')
    }

    // 먼저 삭제할 주문이 존재하는지 확인
    const search_order = await prisma.order.findUnique({
      where: {
        idx: orderIdx,
      },
    })

    if (!search_order) {
      throw new Error('삭제하려는 주문 없음')
    }

    const response = await prisma.order.delete({
      where: {
        idx: orderIdx,
      },
    })

    if (!response) {
      throw new Error('삭제 실패')
    }

    return { success: true }
  } catch (error: any) {
    throw new Error(error)
  }
}

export type OrderItemsType = {
  quantity: number
  unit_price: number
  product: {
    name: string
    imageUrl: string
    original_price: number
    discount_rate: number
  }
}

export type OrderlistType = {
  idx: string
  status: string
  payment: string
  address: UserAddressType
  orderItems: OrderItemsType[]
  createdAt: Date
}

/**
 * 사용자의 주문 내역을 데이터베이스에서 가져옵니다.
 *
 * @param {string} userIdx - 사용자의 고유 식별자 (user index).
 * @returns {Promise<OrderlistType[]>} - 사용자의 주문 내역을 포함한 배열을 반환합니다.
 * @throws {Error}
 */
export const fetchOrderlist = async (userIdx: string): Promise<OrderlistType[]> => {
  try {
    const orderlist = await prisma.order.findMany({
      where: {
        userIdx,
      },
      select: {
        idx: true,
        status: true,
        payment: true,
        address: {
          select: {
            idx: true,
            addressName: true,
            addressLine1: true,
            addressLine2: true,
            deliveryNote: true,
            isDefault: true,
            phoneNumber: true,
            postcode: true,
            recipientName: true,
          },
        },
        orderItems: {
          select: {
            quantity: true,
            unit_price: true,
            product: {
              select: {
                name: true,
                imageUrl: true,
                original_price: true,
                discount_rate: true,
              },
            },
          },
        },
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    if (!orderlist) {
      throw new Error('주문 내역이 존재하지 않습니다.')
    }

    return orderlist as OrderlistType[]
  } catch (error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error(`Prisma error code: ${error.code}, message: ${error.message}`)
      throw new Error(`Database error: ${error.message}`)
    } else {
      console.error(`Unexpected error: ${error.message}`)
      throw new Error(`Unexpected error: ${error.message}`)
    }
  }
}

/**
 * 주문/배송 등록
 * @param inputOrder
 * @returns
 */
export const addNewOrder = async (userIdx: string, inputOrder: any) => {
  console.log('backend ==> ', inputOrder)
  try {
    const newOrder = await prisma.order.create({
      data: {
        userIdx,
        addressIdx: inputOrder.addressIdx,
        total_amount: inputOrder.total_amount,
        payment: inputOrder.payment,
        orderItems: {
          create: inputOrder.orderItems.map((item: any) => ({
            productIdx: item.productIdx,
            quantity: item.quantity,
            unit_price: item.unit_price,
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

    return { success: true }
  } catch (error: any) {
    throw new Error(error)
  }
}
