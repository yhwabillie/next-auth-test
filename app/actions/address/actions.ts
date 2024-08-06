'use server'
import authOptions from '@/lib/auth'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth'

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
