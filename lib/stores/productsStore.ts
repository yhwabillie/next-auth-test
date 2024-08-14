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
        console.error('Failed to fetch products')
        return
      }

      set({
        data: fetchedProducts.products,
        isEmpty: fetchedProducts.products.length === 0,
      })
    } catch (error) {
      console.log(error)
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

  //handleClick
  toggleWishStatus: async (productIdx: string, page: number, pagesize: number) => {
    const { userIdx, fetchData } = get()
    set({ loading: true })

    try {
      const response = await toggleWishStatus(userIdx, productIdx)

      if (response.success) {
        await fetchData(page, pagesize)

        if (response.toggleStatus) {
          toast.success('위시리스트에 추가 했습니다.')
        } else {
          toast.success('위시리스트에서 제거 했습니다.')
        }
      } else {
        toast.error('위시리스트 넣기에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Error toggling wish status:', error)
      alert('An error occurred while updating the wish.')
    } finally {
      set({ loading: false })
    }
  },
  toggleCartStatus: async (productIdx: string, page: number, pagesize: number) => {
    const { userIdx, fetchData, sessionUpdate } = get()
    set({ loading: true })

    try {
      const response = await toggleProductToCart(userIdx, productIdx)

      if (response.success) {
        if (sessionUpdate) {
          sessionUpdate({ cartlist_length: response.cartlistCount })
        }

        await fetchData(page, pagesize)

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
}))
