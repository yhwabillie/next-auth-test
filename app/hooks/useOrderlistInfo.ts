import { useOrderlistStore } from '@/lib/stores/orderlistStore'
import { useEffect } from 'react'

export const useOrderlistInfo = (userIdx: string) => {
  const {
    fetchData,
    data,
    setUserIdx,
    setOrderIdx,
    totalPriceWithShippingCost,
    showModal,
    loading,
    setIsShippingCost,
    handleRemoveOrderData,
    isEmpty,
    totalPrice,
  } = useOrderlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchData()
  }, [])

  return {
    data,
    setOrderIdx,
    totalPriceWithShippingCost,
    showModal,
    loading,
    setIsShippingCost,
    handleRemoveOrderData,
    isEmpty,
    totalPrice,
  }
}
