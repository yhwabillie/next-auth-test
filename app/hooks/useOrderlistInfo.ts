import { useOrderlistStore } from '@/lib/stores/orderlistStore'
import { useEffect } from 'react'

export const useOrderlistInfo = (userIdx: string) => {
  const { fetchOrderList, data, setUserIdx, setOrderIdx, totalPriceWithShippingCost, showModal, loading, removeOrder, isOrderListEmpty, totalPrice } =
    useOrderlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchOrderList()
  }, [])

  return {
    data,
    setOrderIdx,
    totalPriceWithShippingCost,
    showModal,
    loading,
    removeOrder,
    isOrderListEmpty,
    totalPrice,
  }
}
