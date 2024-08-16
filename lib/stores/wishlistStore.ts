import { create } from 'zustand'
import { toast } from 'sonner'
import { fetchWishlist, removeFromWishlist, toggleWishlistToCart, UserWishType } from '@/app/actions/wishlist/actions'

interface WishlistStore {
  //data idx
  userIdx: string
  setUserIdx: (userIdx: string) => void

  //fetch data status
  fetchWishlist: () => Promise<void>
  data: UserWishType[]
  loading: boolean
  isEmpty: boolean

  //session update
  sessionUpdate: ((data: any) => void) | null
  setSessionUpdate: (updateMethod: (data: any) => void) => void

  //handleClick
  toggleCartStatus: (productIdx: string) => void
  deleteWishItem: (productIdx: string) => void
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  //data idx
  userIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),

  //session update
  sessionUpdate: null,
  setSessionUpdate: (updateMethod) => set({ sessionUpdate: updateMethod }),

  fetchWishlist: async (): Promise<void> => {
    const { userIdx } = get()

    set({ loading: true })

    try {
      const fetchedWishList = await fetchWishlist(userIdx)

      if (!fetchedWishList) {
        console.error('Failed to fetch wishlist')
        return
      }

      set({
        data: fetchedWishList,
        isEmpty: fetchedWishList.length === 0,
      })
    } catch (error) {
      console.error('Error fetching wish list:', error)
    } finally {
      set({ loading: false })
    }
  },
  data: [],
  loading: false,
  isEmpty: false,

  toggleCartStatus: async (productIdx: string): Promise<void> => {
    const { userIdx, fetchWishlist, sessionUpdate } = get()
    set({ loading: true })

    try {
      const response = await toggleWishlistToCart(userIdx, productIdx)

      if (response.success) {
        if (sessionUpdate) {
          sessionUpdate({ cartlist_length: response.cartlistCount })
        }

        await fetchWishlist()

        if (response.toggleStatus) {
          toast.success('장바구니에서 추가 했습니다.')
        } else {
          toast.success('장바구니에 제거 했습니다.')
        }
      } else {
        toast.error('장바구니 넣기에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Error toggling cart status:', error)
      alert('An error occurred while updating the cart.')
    } finally {
      set({ loading: false })
    }
  },

  deleteWishItem: async (productIdx: string): Promise<{ success: boolean }> => {
    const { userIdx, fetchWishlist } = get()
    set({ loading: true })

    try {
      const response = await removeFromWishlist(userIdx, productIdx)

      if (!response.success) throw new Error('Failed to remove item from wishlist')

      await fetchWishlist()

      return { success: true }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw new Error('Failed to remove from wishlist')
    } finally {
      set({ loading: false })
    }
  },
}))
