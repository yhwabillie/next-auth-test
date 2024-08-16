import { useCartlistStore } from '@/lib/stores/cartlistStore'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const useCartlistInfo = (userIdx: string) => {
  const { update } = useSession()
  const {
    setSessionUpdate,
    setUserIdx,
    fetchCartAndAddressData,
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
    submitOrder,
  } = useCartlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    setSessionUpdate(update)
    fetchCartAndAddressData()
  }, [activeTabId, userIdx, setSessionUpdate, update, fetchCartAndAddressData])

  const checkedItemsInfo = useCartlistStore((state) => state.getSelectedCartItems())
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
    submitOrder,
    checkedItemsInfo,
    totalQuantity,
    totalPrice,
    totalPriceWithShippingCost,
  }
}
