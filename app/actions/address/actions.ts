'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

/**
 * 선택한 배송지 수정 업데이트
 */
export const updateAddress = async (
  userIdx: string,
  addressIdx: string,
  addressData: {
    recipientName: string
    phoneNumber: string
    addressName: string
    addressLine1: string
    addressLine2: string
    deliveryNote: string
    postcode: string
  },
) => {
  try {
    const response = await prisma.address.updateMany({
      where: {
        userIdx: userIdx,
        idx: addressIdx,
      },
      data: addressData,
    })

    if (!response) throw new Error('error')

    return { success: true }
  } catch (error) {}
}

/**
 * 선택한 배송지를 기본배송지로 변경
 */
export const setDefaultAddress = async (userIdx: string, addressIdx: string) => {
  try {
    console.log('===>', userIdx, addressIdx)
    // 사용자의 모든 주소의 isDefault를 false로 설정
    const setAllFalse = await prisma.address.updateMany({
      where: { userIdx: userIdx },
      data: { isDefault: false },
    })

    if (!setAllFalse) {
      throw new Error('error')
    }

    // 클릭한 주소의 isDefault를 true로 설정
    await prisma.address.update({
      where: { idx: addressIdx },
      data: { isDefault: true },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error('기본 배송지 업데이트 중 오류가 발생했습니다:', error)
  }
}

/**
 * 사용자 배송지 등록
 */
export const createNewAddress = async (
  userIdx: string,
  addressData: {
    recipientName: string
    phoneNumber: string
    addressName: string
    new_postcode: string
    new_addressLine1: string
    addressLine2: string
    deliveryNote: string
  },
  isDefault: boolean,
) => {
  try {
    // isDefault가 true인 경우 기존 기본 배송지를 해제합니다.
    if (isDefault) {
      await prisma.address.updateMany({
        where: {
          userIdx: userIdx,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      })
    }

    // 새로운 주소를 추가합니다.
    const newAddress = await prisma.address.create({
      data: {
        userIdx,
        recipientName: addressData.recipientName,
        phoneNumber: addressData.phoneNumber,
        addressName: addressData.addressName,
        postcode: addressData.new_postcode,
        addressLine1: addressData.new_addressLine1,
        addressLine2: addressData.addressLine2,
        isDefault,
        deliveryNote: addressData.deliveryNote,
      },
    })

    if (!newAddress) {
      throw new Error('Failed to add address')
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to add address:', error)
    throw new Error('Failed to add address')
  }
}

/**
 * 선택 배송지 삭제
 */
export const removeAddress = async (addressIdx: string, userIdx: string) => {
  try {
    // 삭제할 주소를 찾습니다
    const addressToRemove = await prisma.address.findUnique({
      where: { idx: addressIdx },
    })

    if (!addressToRemove) {
      throw new Error('Address not found')
    }

    // 주소를 삭제합니다
    await prisma.address.delete({
      where: { idx: addressIdx },
    })

    // 삭제한 주소가 기본 주소인 경우
    if (addressToRemove.isDefault) {
      const remainingAddresses = await prisma.address.findMany({
        where: { userIdx },
        orderBy: { createdAt: 'desc' },
      })

      // 남은 주소가 있을 경우, 첫 번째 주소를 기본 주소로 설정합니다.
      if (remainingAddresses.length > 0) {
        await prisma.address.update({
          where: { idx: remainingAddresses[0].idx },
          data: { isDefault: true },
        })
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Failed to delete address:', error)
    throw new Error('Failed to delete address')
  }
}

/**
 * 사용자 배송지 리스트 fetch
 */
export const fetchAddressList = async (userIdx: string) => {
  const addressList = await prisma.address.findMany({
    where: {
      userIdx,
    },
    orderBy: {
      isDefault: 'desc', // isDefault가 true인 주소가 먼저 나오도록 내림차순으로 정렬
    },
  })

  return addressList
}

export const hasDefaultAddress = async (userIdx: string) => {
  const defaultAddress = await prisma.address.findMany({
    where: {
      userIdx,
      isDefault: true,
    },
    select: {
      addressLine1: true,
      addressLine2: true,
      addressName: true,
      deliveryNote: true,
      phoneNumber: true,
      recipientName: true,
      postcode: true,
    },
  })

  return defaultAddress
}

export const hasETCAddress = async (userIdx: string) => {
  const ETCAddress = await prisma.address.findMany({
    where: {
      userIdx,
      isDefault: false,
    },
    select: {
      addressLine1: true,
      addressLine2: true,
      addressName: true,
      deliveryNote: true,
      phoneNumber: true,
      recipientName: true,
      postcode: true,
    },
  })

  return ETCAddress
}

export const updateEtcAddress = async (
  userIdx: string,
  addressData: {
    recipientName: string
    phoneNumber: string
    addressName: string
    addressLine1: string
    addressLine2: string
    deliveryNote: string
    postcode: string
  },
) => {
  return await prisma.address.updateMany({
    where: {
      userIdx: userIdx,
      isDefault: false,
    },
    data: addressData,
  })
}

export const updateDefaultAddress = async (
  userIdx: string,
  addressData: {
    recipientName: string
    phoneNumber: string
    addressName: string
    addressLine1: string
    addressLine2: string
    deliveryNote: string
    postcode: string
  },
) => {
  return await prisma.address.updateMany({
    where: {
      userIdx: userIdx,
      isDefault: true,
    },
    data: addressData,
  })
}

export async function saveDefaultAddress(
  userIdx: string,
  addressData: {
    recipientName: string
    phoneNumber: string
    addressName: string
    addressLine1: string
    addressLine2: string
    deliveryNote: string
    postcode: string
  },
) {
  // 기존의 기본 배송지를 해제
  await prisma.address.updateMany({
    where: { userIdx, isDefault: true },
    data: { isDefault: false },
  })

  // 새로운 기본 배송지를 저장
  const newAddress = await prisma.address.create({
    data: {
      ...addressData,
      userIdx,
      isDefault: true,
    },
  })

  return newAddress
}

export async function saveETCAddress(
  userIdx: string,
  addressData: {
    recipientName: string
    phoneNumber: string
    addressName: string
    addressLine1: string
    addressLine2: string
    deliveryNote: string
    postcode: string
  },
) {
  // 새로운 기본 배송지를 저장
  const newAddress = await prisma.address.create({
    data: {
      ...addressData,
      userIdx,
      isDefault: false,
    },
  })

  return newAddress
}
