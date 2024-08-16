import { UserAddressType } from '@/app/actions/address/actions'
import { fetchOrderlist, OrderlistType, removeOrder, updateOrderAddress } from '@/app/actions/order/actions'

//비즈니스 로직

export const getOrderList = async (userIdx: string): Promise<OrderlistType[]> => {
  return fetchOrderlist(userIdx)
}

export const changeOrderAddress = async (orderIdx: string, newAddressIdx: string): Promise<{ address: UserAddressType }> => {
  return updateOrderAddress(orderIdx, newAddressIdx)
}

export const deleteOrder = async (
  addressIdx: string,
): Promise<{
  success: boolean
}> => {
  return removeOrder(addressIdx)
}
