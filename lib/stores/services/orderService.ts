import { UserAddressType } from '@/app/actions/address/actions'
import { fetchOrderlist, OrderlistType, removeOrder, updateOrderAddress } from '@/app/actions/order/actions'

// 유효성 검사 헬퍼 함수
const validateId = (id: string, type: 'user' | 'order' | 'address') => {
  if (!id) {
    throw new Error(`Invalid ${type} ID provided`)
  }
}

// 비즈니스 로직
export const getOrderList = async (userIdx: string): Promise<OrderlistType[]> => {
  validateId(userIdx, 'user')

  if (!userIdx) throw new Error('Invalid userIdx provided')
  try {
    return await fetchOrderlist(userIdx)
  } catch (error) {
    console.error('Error fetching order list:', error)
    throw error
  }
}

export const changeOrderAddress = async (orderIdx: string, newAddressIdx: string): Promise<{ address: UserAddressType }> => {
  validateId(orderIdx, 'order')
  validateId(newAddressIdx, 'address')

  if (!orderIdx || !newAddressIdx) throw new Error('Invalid orderIdx or addressIdx provided')

  try {
    return await updateOrderAddress(orderIdx, newAddressIdx)
  } catch (error) {
    console.error('Error updating order address:', error)
    throw error
  }
}

export const deleteOrder = async (addressIdx: string): Promise<{ success: boolean }> => {
  validateId(addressIdx, 'address')

  if (!addressIdx) throw new Error('Invalid addressIdx provided')

  try {
    return await removeOrder(addressIdx)
  } catch (error) {
    console.error('Error deleting order:', error)
    throw error
  }
}
