import { useWishlistStore } from '@/lib/stores/wishlistStore'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'

export const useWishlistInfo = (userIdx: string) => {
  const { update } = useSession()
  const { setUserIdx, fetchData, data, isEmpty, loading, handleToggleCartStatus, handleDeleteWishItem, setSessionUpdate } = useWishlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchData()
    setSessionUpdate(update)
  }, [userIdx])

  return {
    data,
    isEmpty,
    loading,
    handleToggleCartStatus,
    handleDeleteWishItem,
  }
}
