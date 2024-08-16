import { useWishlistStore } from '@/lib/stores/wishlistStore'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const useWishlistInfo = (userIdx: string) => {
  const { update } = useSession()
  const { setUserIdx, fetchWishlist, data, isEmpty, loading, toggleCartStatus, deleteWishItem, setSessionUpdate } = useWishlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchWishlist()
    setSessionUpdate(update)
  }, [userIdx])

  return {
    data,
    isEmpty,
    loading,
    toggleCartStatus,
    deleteWishItem,
  }
}
