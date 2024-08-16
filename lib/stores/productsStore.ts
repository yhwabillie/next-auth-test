import { create } from 'zustand'
import { toast } from 'sonner'
import { fetchProducts, ProductType, toggleProductToCart, toggleWishStatus } from '@/app/actions/products/actions'

interface ProductsStore {
  //data idx
  userIdx: string
  setUserIdx: (userIdx: string) => void

  //session update
  sessionUpdate: ((data: any) => void) | null
  setSessionUpdate: (updateMethod: (data: any) => void) => void

  //fetch data status
  fetchData: (page: number, pageSize: number) => Promise<void>
  data: ProductType[]
  loading: boolean
  isEmpty: boolean

  //modal status
  modals: {
    alert: boolean
  }
  showModal: (modalName: keyof ProductsStore['modals']) => void
  hideModal: (modalName: keyof ProductsStore['modals']) => void

  //handleClick
  toggleWishStatus: (productIdx: string, page: number, pageSize: number) => void
  toggleCartStatus: (productIdx: string, page: number, pageSize: number) => void
}

export const useProductsStore = create<ProductsStore>((set, get) => ({
  //data idx
  userIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),

  //session update
  sessionUpdate: null,
  setSessionUpdate: (updateMethod) => set({ sessionUpdate: updateMethod }),

  fetchData: async (page: number, pageSize: number): Promise<void> => {
    const { userIdx } = get()

    set({ loading: true })

    try {
      const fetchedProducts = await fetchProducts({ userIdx, page, pageSize })

      if (!fetchedProducts) {
        throw new Error('Failed to fetch products')
      }

      set({
        data: fetchedProducts.products,
        isEmpty: fetchedProducts.products.length === 0,
      })
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('상품 데이터를 가져오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  },

  data: [],
  loading: false,
  isEmpty: false,

  //modal types
  modals: {
    alert: false,
  },
  showModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: true,
      },
    })),
  hideModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: false,
      },
    })),

  //toggle wish, cart
  toggleWishStatus: async (productIdx: string, page: number, pageSize: number) => {
    const { userIdx, fetchData } = get()
    set({ loading: true })

    try {
      const response = await toggleWishStatus(userIdx, productIdx)

      if (!response.success) {
        throw new Error('Failed to update wish status')
      }

      await fetchData(page, pageSize)

      toast.success(response.toggleStatus ? '위시리스트에 추가했습니다.' : '위시리스트에서 제거했습니다.')
    } catch (error: unknown) {
      //에러 메시지 처리
      if (error instanceof Error) {
        console.error('Error toggling wishlist status:', error.message)
        toast.error('위시리스트 업데이트에 실패했습니다. 다시 시도해주세요.')
      } else {
        console.error('Unexpected error:', error)
        toast.error('예기치 않은 오류가 발생했습니다.')
      }
    } finally {
      set({ loading: false })
    }
  },
  toggleCartStatus: async (productIdx: string, page: number, pageSize: number) => {
    const { userIdx, fetchData, sessionUpdate } = get()
    set({ loading: true })

    try {
      const response = await toggleProductToCart(userIdx, productIdx)

      if (!response.success) {
        throw new Error('Failed to update cart status')
      }

      if (sessionUpdate) {
        sessionUpdate({ cartlist_length: response.cartlistCount })
      }

      await fetchData(page, pageSize)

      toast.success(response.toggleStatus ? '장바구니에 추가했습니다.' : '장바구니에서 제거했습니다.')
    } catch (error: unknown) {
      //에러 메시지 처리
      if (error instanceof Error) {
        console.error('Error toggling cart status:', error.message)
        toast.error('장바구니 업데이트에 실패했습니다. 다시 시도해주세요.')
      } else {
        console.error('Unexpected error:', error)
        toast.error('예기치 않은 오류가 발생했습니다.')
      }
    } finally {
      set({ loading: false })
    }
  },
}))
