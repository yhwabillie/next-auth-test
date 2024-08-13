import { create } from 'zustand'
import { toast } from 'sonner'
import { fetchWishlist, removeFromWishlist, toggleWishlistToCart, UserWishType } from '@/app/actions/wishlist/actions'

interface WishlistStore {
  //data idx
  userIdx: string
  setUserIdx: (userIdx: string) => void

  //fetch data status
  fetchData: () => Promise<void>
  data: UserWishType[]
  loading: boolean
  isEmpty: boolean

  //session update
  sessionUpdate: ((data: any) => void) | null
  setSessionUpdate: (updateMethod: (data: any) => void) => void

  //handleClick
  handleToggleCartStatus: (productIdx: string) => void
  handleDeleteWishItem: (productIdx: string) => void
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  //data idx
  userIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),

  //session update
  sessionUpdate: null,
  setSessionUpdate: (updateMethod) => set({ sessionUpdate: updateMethod }),

  /**
   * 사용자의 위시리스트 데이터를 서버에서 가져와 상태를 업데이트하는 함수.
   *
   * 주어진 사용자 ID(userIdx)를 기반으로 위시리스트 데이터를 서버에서 비동기적으로 가져옵니다.
   * 데이터를 가져오는 동안 로딩 상태를 true로 설정하고, 데이터 가져오기가 완료되면 로딩 상태를 false로 설정합니다.
   * 위시리스트 데이터를 가져와 상태에 저장하고, 위시리스트가 비어 있는지를 판단하여 isEmpty 상태를 업데이트합니다.
   *
   * @returns {Promise<void>}
   * @throws {Error}
   */
  fetchData: async (): Promise<void> => {
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

  /**
   * 장바구니 상태를 토글하는 함수.
   *
   * 주어진 제품 ID(productIdx)에 대해 사용자의 위시리스트에서 장바구니로 제품을 추가하거나 제거합니다.
   * 또한, 장바구니의 총 항목 수를 업데이트하고, 해당 변경 사항을 세션에 반영합니다.
   *
   * @param {string} productIdx - 장바구니 상태를 토글할 제품의 고유 ID.
   * @returns {Promise<void>} - 함수가 성공적으로 완료되면 아무것도 반환하지 않음.
   * @throws {Error}
   */
  handleToggleCartStatus: async (productIdx: string): Promise<void> => {
    const { userIdx, fetchData, sessionUpdate } = get()
    set({ loading: true })

    try {
      const response = await toggleWishlistToCart(userIdx, productIdx)

      if (response.success) {
        if (sessionUpdate) {
          sessionUpdate({ cartlist_length: response.cartlistCount })
        }

        await fetchData()

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

  /**
   * 위시리스트에서 특정 항목을 제거하는 함수.
   *
   * 주어진 제품 ID(productIdx)에 대해 사용자의 위시리스트에서 해당 항목을 제거하고,
   * 이후 위시리스트 데이터를 새로고침하여 UI를 갱신합니다.
   * 이 과정에서 로딩 상태를 관리하며, 성공 여부에 따라 적절한 처리를 수행합니다.
   *
   * @param {string} productIdx - 제거할 제품의 고유 ID.
   * @returns {Promise<{ success: boolean }>}
   * @throws {Error}
   */
  handleDeleteWishItem: async (productIdx: string): Promise<{ success: boolean }> => {
    const { userIdx, fetchData } = get()
    set({ loading: true })

    try {
      const response = await removeFromWishlist(userIdx, productIdx)

      if (!response.success) throw new Error('Failed to remove item from wishlist')

      await fetchData()

      return { success: true }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      throw new Error('Failed to remove from wishlist')
    } finally {
      set({ loading: false })
    }
  },
}))
