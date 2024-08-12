'use server'
import prisma from '@/lib/prisma'

export interface UpdateAddressType {
  recipientName: string
  phoneNumber: string
  addressName: string
  addressLine1: string
  addressLine2: string
  deliveryNote: string
  postcode: string
}

export interface NewAddressType {
  recipientName: string
  phoneNumber: string
  addressName: string
  new_postcode: string
  new_addressLine1: string
  addressLine2: string
  deliveryNote: string
}

/**
 * 사용자 배송지 리스트 READ 함수
 *
 * 주어진 사용자 ID(userIdx)를 기준으로 사용자의 배송지 리스트를 데이터베이스에서 조회하여 반환합니다.
 * 기본 배송지(isDefault: true)가 가장 먼저 오도록 내림차순으로 정렬하여 반환합니다.
 *
 * 이 함수는 비동기 함수로, 주소 목록을 가져오는 중 에러가 발생할 경우 적절한 에러 메시지를
 * 로그에 기록하고, 호출자에게 에러를 던집니다.
 *
 * @param userIdx - 배송지 리스트를 조회할 사용자의 고유 ID
 * @returns {Promise<UserAddressType[]>} - 조회된 사용자 배송지 리스트
 * @throws {Error} - 주소 목록을 가져오는 중에 발생한 오류를 나타냅니다.
 */
export interface UserAddressType {
  idx: string
  recipientName: string
  phoneNumber: string
  addressName: string
  addressLine1: string
  addressLine2: string
  isDefault: boolean
  deliveryNote: string
  postcode: string
}

export const fetchAddressList = async (userIdx: string): Promise<UserAddressType[]> => {
  try {
    const addressList = await prisma.address.findMany({
      where: {
        userIdx,
      },
      orderBy: {
        isDefault: 'desc',
      },
      select: {
        idx: true,
        isDefault: true,
        addressName: true,
        recipientName: true,
        phoneNumber: true,
        postcode: true,
        addressLine1: true,
        addressLine2: true,
        deliveryNote: true,
      },
    })

    return addressList
  } catch (error) {
    // 에러 발생 시 로그에 기록, 요청 시간 포함
    console.error(`Failed to fetch address list for user ${userIdx} at ${new Date().toISOString()}:`, error)
    if (error instanceof Error) {
      // 구체적인 에러 메시지를 포함하여 에러 던짐
      throw new Error('Failed to fetch address list: ' + error.message)
    }
    // 알 수 없는 에러 처리
    throw new Error('Failed to fetch address list due to an unknown error')
  }
}

/**
 * 새로운 주소 CREATE 함수
 *
 * 주어진 사용자 ID(userIdx)와 주소 데이터(addressData)를 사용하여 새로운 주소를 생성합니다.
 * 만약 새로 생성된 주소가 기본 주소로 설정될 경우, 기존의 모든 기본 주소 설정을 해제합니다.
 *
 * @param userIdx - 주소를 추가할 사용자의 고유 ID
 * @param addressData - 새로운 주소의 데이터 객체
 * @param isDefault - 생성된 주소를 기본 주소로 설정할지 여부
 * @returns {Promise<{ success: boolean }>}
 * @throws {Error}
 */
export const createNewAddress = async (userIdx: string, addressData: NewAddressType, isDefault: boolean): Promise<{ success: boolean }> => {
  try {
    // 기본 주소 설정이 true인 경우, 기존의 기본 주소를 해제합니다.
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

    return { success: true }
  } catch (error: unknown) {
    console.error(`Failed to add Address for user ${userIdx} at ${new Date().toISOString()}:`, error)
    if (error instanceof Error) {
      throw new Error('Failed to add Address: ' + error.message)
    }
    // 알 수 없는 에러 처리
    throw new Error('Failed to add Address due to an unknown error')
  }
}

/**
 * 사용자 주소 UPDATE 함수
 *
 * 주어진 사용자 ID(userIdx)와 주소 ID(addressIdx)를 기반으로 해당 주소의 정보를 업데이트합니다.
 * 이 함수는 특정 사용자와 주소에 대해 제공된 새 데이터를 사용하여 주소를 업데이트합니다.
 *
 * @param userIdx - 주소를 업데이트할 사용자의 고유 ID
 * @param addressIdx - 업데이트할 주소의 고유 ID
 * @param addressData - 업데이트할 주소의 데이터 객체
 * @returns {Promise<{ success: boolean }>}
 * @throws {Error}
 */
export const updateAddress = async (userIdx: string, addressIdx: string, addressData: UpdateAddressType): Promise<{ success: boolean }> => {
  try {
    const response = await prisma.address.updateMany({
      where: {
        userIdx: userIdx,
        idx: addressIdx,
      },
      data: addressData,
    })

    if (response.count === 0) {
      throw new Error('No address was updated')
    }

    return { success: true }
  } catch (error) {
    console.error(`Failed to update Address for user ${userIdx} at ${new Date().toISOString()}:`, error)
    if (error instanceof Error) {
      throw new Error('Failed to update Address: ' + error.message)
    }
    // 알 수 없는 에러 처리
    throw new Error('Failed to update Address due to an unknown error')
  }
}

/**
 * 사용자 주소 DELETE 함수
 *
 * 주어진 주소 ID(addressIdx)와 사용자 ID(userIdx)를 기반으로 사용자의 주소를 삭제합니다.
 * 만약 삭제된 주소가 기본 배송지인 경우, 남아있는 주소 중 가장 최근에 생성된 주소를
 * 기본 배송지로 설정합니다.
 *
 * @param addressIdx - 삭제할 주소의 고유 ID
 * @param userIdx - 해당 주소가 속한 사용자의 고유 ID
 * @returns {Promise<{ success: boolean }>}
 * @throws {Error}
 */
export const removeAddress = async (addressIdx: string, userIdx: string): Promise<{ success: boolean }> => {
  try {
    // 트랜잭션 시작
    await prisma.$transaction(async (prisma) => {
      // 삭제할 주소를 찾습니다
      const addressToRemove = await prisma.address.findUnique({
        where: { idx: addressIdx },
      })

      // 주소가 존재하지 않는 경우 에러를 던집니다
      if (!addressToRemove) {
        throw new Error('Address not found')
      }

      // 주소를 삭제합니다
      await prisma.address.delete({
        where: { idx: addressIdx },
      })

      // 삭제한 주소가 기본 주소인 경우
      if (addressToRemove.isDefault) {
        const firstRemainingAddress = await prisma.address.findFirst({
          where: { userIdx },
          orderBy: { createdAt: 'desc' },
        })

        // 남은 주소 중 첫 번째 주소를 기본 주소로 설정
        if (firstRemainingAddress) {
          await prisma.address.update({
            where: { idx: firstRemainingAddress.idx },
            data: { isDefault: true },
          })
        }
      }
    })

    return { success: true }
  } catch (error: unknown) {
    // 에러 발생 시 로그에 기록, 요청 시간 포함
    console.error(`Failed to delete address list for user ${userIdx} at ${new Date().toISOString()}:`, error)
    if (error instanceof Error) {
      // 구체적인 에러 메시지를 포함하여 에러 던짐
      throw new Error('Failed to delete address list: ' + error.message)
    }
    // 알 수 없는 에러 처리
    throw new Error('Failed to delete address list due to an unknown error')
  }
}

/**
 * 선택한 배송지를 기본 배송지로 설정하는 UPDATE 함수
 *
 * 이 함수는 주어진 사용자 ID(userIdx)를 기반으로 해당 사용자의 모든 배송지 주소에서
 * `isDefault` 필드를 `false`로 설정하고, 특정 주소(addressIdx)에 대해서는 `isDefault`를
 * `true`로 설정하여 기본 배송지로 지정합니다.
 *
 * @param userIdx - 배송지를 관리할 사용자의 고유 ID
 * @param addressIdx - 기본 배송지로 설정할 주소의 고유 ID
 * @returns {Promise<{ success: boolean }>}
 * @throws {Error}
 */
export const setDefaultAddress = async (userIdx: string, addressIdx: string): Promise<{ success: boolean }> => {
  try {
    // 사용자의 모든 주소의 isDefault를 false로 설정
    const response = await prisma.address.updateMany({
      where: { userIdx: userIdx },
      data: { isDefault: false },
    })

    if (response.count === 0) {
      throw new Error('Failed to update any address records')
    }

    // 클릭한 주소의 isDefault를 true로 설정
    await prisma.address.update({
      where: { idx: addressIdx },
      data: { isDefault: true },
    })

    return {
      success: true,
    }
  } catch (error: unknown) {
    console.error(`Failed to change default Address for user ${userIdx} at ${new Date().toISOString()}:`, error)
    if (error instanceof Error) {
      throw new Error('Failed to change default Address: ' + error.message)
    }
    // 알 수 없는 에러 처리
    throw new Error('Failed to change default Address due to an unknown error')
  }
}
