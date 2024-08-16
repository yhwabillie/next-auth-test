import { create } from 'zustand'
import { CartItemType, fetchCartList, removeBulkFromCartlist, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { toast } from 'sonner'
import { fetchAddressList, UserAddressType } from '@/app/actions/address/actions'
import { addNewOrder } from '@/app/actions/order/actions'

export interface CheckedItemType {
  [key: string]: boolean
}

interface FetchedDataType {
  cartList: CartItemType[]
  addresses: UserAddressType[]
}

interface CartlistStore {
  //userIdx
  userIdx: string
  setUserIdx: (userIdx: string) => void

  //session update
  sessionUpdate: ((data: any) => void) | null
  setSessionUpdate: (updateMethod: (data: any) => void) => void

  //fetch data control
  fetchCartAndAddressData: () => Promise<void>
  loading: boolean
  isCartlistEmpty: boolean
  isAddressEmpty: boolean
  data: FetchedDataType
  deleteCartItem: (productIdx: string) => Promise<void>
  setLoading: (loading: boolean) => void
  resetState: () => void

  //modal status
  modals: {
    need_session: boolean
  }
  showModal: (modalName: keyof CartlistStore['modals']) => void
  hideModal: (modalName: keyof CartlistStore['modals']) => void

  //activeTab control
  activeTabId: number
  setActiveTab: (id: number) => void

  //address activeTab control
  addressActiveTabId: string | null
  setAddressActiveTabId: (addressIdx: string) => void

  //checkItems control
  checkedItems: CheckedItemType
  setCheckedItems: (idx: string) => void
  getSelectedCartItems: () => CartItemType[]

  //price control
  totalQuantity: () => number
  totalPrice: () => number
  totalPriceWithShippingCost: () => number

  //quantity control
  minQuantity: number
  maxQuantity: number
  increaseQuantity: (productIdx: string) => void
  decreaseQuantity: (productIdx: string) => void
  setQuantity: (itemIdx: string, quantity: number) => void

  //order control
  isSubmitting: boolean
  setIsSubmitting: (isSubmitting: boolean) => void
  submitOrder: (addressIdx: string, payment: string) => Promise<void>
  clearCartItems: (checkedProductIdxs: string[]) => Promise<number | undefined>
}

export const useCartlistStore = create<CartlistStore>((set, get) => ({
  //userIdx
  userIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),

  //session update
  sessionUpdate: null,
  setSessionUpdate: (updateMethod) => set({ sessionUpdate: updateMethod }),

  data: {
    cartList: [],
    addresses: [],
  },
  loading: false,
  isCartlistEmpty: false,
  isAddressEmpty: false,
  resetState: () =>
    set({
      data: {
        cartList: [],
        addresses: [],
      },
      isCartlistEmpty: true,
      isAddressEmpty: true,
    }),
  setLoading: (loading: boolean) => set({ loading }),

  //modal types
  modals: {
    need_session: false,
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

  //activeTab control
  activeTabId: 1,
  setActiveTab: (id: number) => set({ activeTabId: id }),

  //address activeTab control
  addressActiveTabId: '',
  setAddressActiveTabId: (addressIdx: string) => set({ addressActiveTabId: addressIdx }),

  fetchCartAndAddressData: async (): Promise<void> => {
    const { userIdx, resetState, setLoading } = get()

    setLoading(true)

    try {
      // cartList와 addressList를 동시에 fetch
      const [fetchedCartlist, fetchedAddresslist] = await Promise.all([fetchCartList(userIdx), fetchAddressList(userIdx)])

      // 로드 시 모든 checkbox를 true로 설정
      const initialCheckedState: CheckedItemType = fetchedCartlist.reduce((acc, item) => {
        acc[item.product.idx] = true
        return acc
      }, {} as CheckedItemType)

      // 주소가 존재하지 않을 때의 처리
      const isAddressListEmpty = fetchedAddresslist.length === 0

      set({
        data: {
          cartList: fetchedCartlist,
          addresses: fetchedAddresslist,
        },
        checkedItems: initialCheckedState,
        isCartlistEmpty: fetchedCartlist.length === 0,
        isAddressEmpty: isAddressListEmpty,
        addressActiveTabId: isAddressListEmpty ? null : fetchedAddresslist[0].idx, // 주소가 없을 경우 null로 설정
      })
    } catch (error) {
      console.error(`Error fetching cartlist for user: ${userIdx}. Details:`, error)
      resetState()
    } finally {
      setLoading(false)
    }
  },

  deleteCartItem: async (productIdx: string): Promise<void> => {
    const { userIdx, fetchCartAndAddressData, sessionUpdate, resetState, setLoading } = get()

    setLoading(true)

    try {
      const response = await removeFromCartlist(userIdx, productIdx)

      if (!response.success) {
        console.log('cant remove')
        toast.error('삭제 실패')
        return
      }

      if (sessionUpdate) {
        sessionUpdate({ cartlist_length: response.cartlistCount })
      }

      await fetchCartAndAddressData()
      toast.success('상품이 장바구니에서 삭제되었습니다.')
    } catch (error) {
      console.error(`Error deleting cart item for user: ${userIdx}. Product: ${productIdx}. Details:`, error)
      resetState()
    } finally {
      setLoading(false)
    }
  },

  minQuantity: 1,
  maxQuantity: 10,

  increaseQuantity: (productIdx: string) => {
    const { minQuantity, maxQuantity } = get()

    set((state) => ({
      data: {
        ...state.data,
        cartList: state.data.cartList.map((cartItem) => {
          // 조건: 특정 제품이 minQuantity 이상이고, maxQuantity 이하일 때 수량 증가
          if (cartItem.product.idx === productIdx && cartItem.quantity >= minQuantity && cartItem.quantity < maxQuantity) {
            return { ...cartItem, quantity: cartItem.quantity + 1 }
          }

          return cartItem
        }),
      },
    }))
  },

  decreaseQuantity: (productIdx: string) => {
    const { minQuantity, maxQuantity } = get()

    set((state) => ({
      data: {
        ...state.data,
        cartList: state.data.cartList.map((cartItem) => {
          // 조건: 특정 제품이 minQuantity보다 크고, maxQuantity 이하일 때 수량 감소
          if (cartItem.product.idx === productIdx && cartItem.quantity > minQuantity && cartItem.quantity <= maxQuantity) {
            return { ...cartItem, quantity: cartItem.quantity - 1 }
          }
          return cartItem
        }),
      },
    }))
  },

  setQuantity: (itemIdx: string, quantity: number) => {
    const { minQuantity, maxQuantity } = get()

    // 수량 유효성 검사 함수
    const isValidQuantity = (quantity: number) => {
      return !isNaN(quantity) && quantity >= minQuantity && quantity <= maxQuantity
    }

    if (!isValidQuantity(quantity)) {
      console.warn(`Invalid quantity: ${quantity} for item: ${itemIdx}. Valid range is between ${minQuantity} and ${maxQuantity}.`)
      return
    }

    set((state) => ({
      data: {
        ...state.data,
        cartList: state.data.cartList.map((cartItem) => (cartItem.product.idx === itemIdx ? { ...cartItem, quantity } : cartItem)),
      },
    }))
  },

  checkedItems: {},
  getSelectedCartItems: () => {
    const { data, checkedItems } = get()
    return data.cartList.filter(({ product }) => checkedItems[product.idx])
  },
  totalQuantity: () => {
    const { getSelectedCartItems } = get()
    return getSelectedCartItems().reduce((sum, { quantity }) => sum + quantity, 0)
  },
  totalPrice: () => {
    const getSelectedCartItems = get().getSelectedCartItems()
    return getSelectedCartItems.reduce(
      (sum, { product, quantity }) => sum + (product.original_price - product.original_price * product.discount_rate) * quantity,
      0,
    )
  },
  totalPriceWithShippingCost: () => {
    const totalPrice = get().totalPrice()
    return totalPrice >= 30000 ? totalPrice : totalPrice + 3000
  },

  setCheckedItems: (idx: string) =>
    set((state) => ({
      checkedItems: {
        ...state.checkedItems,
        [idx]: state.checkedItems[idx] !== undefined ? !state.checkedItems[idx] : true,
      },
    })),
  clearCartItems: async (checkedProductIdxs: string[]) => {
    const { setLoading, userIdx } = get()

    setLoading(true)

    try {
      const response = await removeBulkFromCartlist(userIdx, checkedProductIdxs)

      if (!response.success) {
        console.log('fail to reset')
      }

      return response.cartlistCount
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  },
  isSubmitting: false,
  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
  submitOrder: async (addressIdx: string, payment: string) => {
    console.log('front data==>', addressIdx, payment)

    const {
      setLoading,
      fetchCartAndAddressData,
      userIdx,
      isSubmitting,
      setIsSubmitting,
      getSelectedCartItems,
      clearCartItems,
      setActiveTab,
      sessionUpdate,
    } = get()
    const totalPriceWithShippingCost = get().totalPriceWithShippingCost()
    setLoading(true)

    if (isSubmitting) return // 이미 제출 중이면 중단
    setIsSubmitting(true)
    console.log('========> 제출')

    try {
      const checkedItems = getSelectedCartItems().map(({ product, quantity }) => {
        return {
          productIdx: product.idx,
          quantity: quantity,
          unit_price: product.original_price - product.original_price * product.discount_rate,
        }
      })

      console.log('front data checkedItems==>', checkedItems)

      const newOrder = {
        addressIdx: addressIdx,
        payment,
        total_amount: totalPriceWithShippingCost,
        orderItems: checkedItems,
      }

      console.log('front data new order==>', newOrder)

      //상품을 선택하지 않았을 경우
      if (getSelectedCartItems().length <= 0) {
        toast.error('결제할 상품을 선택하세요')
        return
      }

      const response = await addNewOrder(userIdx, newOrder)

      if (!response.success) {
        console.log('cant submit')
        toast.error('submit 실패')
        return
      }

      const checkedProductIdxs = checkedItems.map((item) => item.productIdx)
      const cartlistCount = await clearCartItems(checkedProductIdxs)

      console.log('cartlist count==>', cartlistCount)

      if (sessionUpdate) {
        sessionUpdate({ cartlist_length: cartlistCount })
      }

      fetchCartAndAddressData()
      setActiveTab(4)
      toast.success('주문이 완료되었습니다.')
    } catch (error) {
      console.log('fail to submit')
    } finally {
      setLoading(false)
      setIsSubmitting(false)
    }
  },
}))
