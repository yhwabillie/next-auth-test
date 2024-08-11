'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

/**
 * 선택 주문 배송지 업데이트
 */
export const updateOrderAddress = async (orderIdx: string, newAddressIdx: string) => {
  const session = await getServerSession(authOptions)

  if (!session || !session.user) {
    throw new Error('You must be logged in to create an order')
  }

  try {
    const order = await prisma.order.findUnique({
      where: {
        idx: orderIdx,
      },
    })

    if (!order) {
      throw new Error('업데이트하려는 주문 데이터 없음')
    }

    const address = await prisma.address.findUnique({
      where: {
        idx: newAddressIdx,
      },
    })

    if (!address) {
      throw new Error('업데이트하려는 주소 데이터 없음')
    }

    const response = await prisma.order.update({
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

    if (!response) {
      throw new Error('업데이트하려는 주문 없음')
    }

    return response
  } catch (error: any) {
    throw new Error(error)
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

/**
 * 주문/배송 리스트 fetch
 */
export const fetchOrderlist = async () => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('You must be logged in to create an order')
    }

    const orderlist = await prisma.order.findMany({
      where: {
        userIdx: session.user.idx!,
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
      throw new Error('해당 데이터가 없습니다.')
    }

    return orderlist
  } catch (error: any) {
    throw new Error(error)
  }
}

/**
 * 주문/배송 등록
 * @param inputOrder
 * @returns
 */
export const addNewOrder = async (inputOrder: any) => {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      throw new Error('You must be logged in to create an order')
    }

    console.log('세션 idx==>', session.user.idx)
    console.log('받은 데이터', inputOrder)

    const newOrder = await prisma.order.create({
      data: {
        userIdx: session.user.idx!,
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
