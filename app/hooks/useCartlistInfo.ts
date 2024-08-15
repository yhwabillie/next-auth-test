import { useCartlistStore } from '@/lib/stores/cartlistStore'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const useCartlistInfo = (userIdx: string) => {
  const { update } = useSession()
  const {
    setSessionUpdate,
    setUserIdx,
    fetchData,
    data,
    setQuantity,
    deleteCartItem,
    increaseQuantity,
    decreaseQuantity,
    loading,
    isCartlistEmpty,
    isAddressEmpty,
    checkedItems,
    setCheckedItems,
    setActiveTab,
    activeTabId,
    addressActiveTabId,
    setAddressActiveTabId,
    SubmitOrder,
  } = useCartlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    setSessionUpdate(update)
    fetchData()
  }, [activeTabId, userIdx, setSessionUpdate, update, fetchData])

  const checkedItemsInfo = useCartlistStore((state) => state.checkedItemsInfo())
  const totalQuantity = useCartlistStore((state) => state.totalQuantity())
  const totalPrice = useCartlistStore((state) => state.totalPrice())
  const totalPriceWithShippingCost = useCartlistStore((state) => state.totalPriceWithShippingCost())

  return {
    data,
    setQuantity,
    deleteCartItem,
    increaseQuantity,
    decreaseQuantity,
    loading,
    isCartlistEmpty,
    isAddressEmpty,
    checkedItems,
    setCheckedItems,
    setActiveTab,
    addressActiveTabId,
    setAddressActiveTabId,
    SubmitOrder,
    checkedItemsInfo,
    totalQuantity,
    totalPrice,
    totalPriceWithShippingCost,
  }
}
