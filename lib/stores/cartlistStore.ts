import { create } from 'zustand'
import { CartItemType, fetchCartList, removeBulkFromCartlist, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { toast } from 'sonner'
import { fetchAddressList, UserAddressType } from '@/app/actions/address/actions'
import { addNewOrder } from '@/app/actions/order/actions'
import { calculateDiscountedPrice } from '../utils'

interface CheckedItemType {
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
  fetchData: () => Promise<void>
  loading: boolean
  isCartlistEmpty: boolean
  isAddressEmpty: boolean
  data: FetchedDataType
  deleteCartItem: (productIdx: string) => Promise<void>
  setLoading: (loading: boolean) => void
  resetState: () => void

  //activeTab control
  activeTabId: number
  setActiveTab: (id: number) => void

  //address activeTab control
  addressActiveTabId: string
  setAddressActiveTabId: (addressIdx: string) => void

  //checkItems control
  checkedItems: CheckedItemType
  setCheckedItems: (idx: string) => void
  checkedItemsInfo: () => CartItemType[]

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
  SubmitOrder: (addressIdx: string, payment: string) => Promise<void>
  ResetCartlist: (checkedProductIdxs: string[]) => Promise<number | undefined>
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

  //activeTab control
  activeTabId: 1,
  setActiveTab: (id: number) => set({ activeTabId: id }),

  //address activeTab control
  addressActiveTabId: '',
  setAddressActiveTabId: (addressIdx: string) => set({ addressActiveTabId: addressIdx }),

  /**
   * 사용자의 장바구니 데이터를 가져와 상태를 업데이트하는 함수.
   *
   * 이 함수는 사용자 식별자(`userIdx`)를 사용하여 데이터베이스에서 장바구니 항목을 조회하고,
   * 해당 데이터를 상태에 저장합니다. 데이터가 없거나 에러가 발생한 경우에는 상태를 초기화하고
   * 에러 메시지를 콘솔에 기록합니다.
   *
   * @returns {Promise<void>} - 이 함수는 비동기적으로 실행되며, 반환값은 없습니다.
   *
   * @throws {Error}
   */
  fetchData: async (): Promise<void> => {
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

      set({
        data: {
          cartList: fetchedCartlist,
          addresses: fetchedAddresslist,
        },
        checkedItems: initialCheckedState,
        isCartlistEmpty: fetchedCartlist.length === 0,
        isAddressEmpty: fetchedAddresslist.length === 0,
        addressActiveTabId: fetchedAddresslist[0].idx,
      })
    } catch (error) {
      console.error(`Error fetching cartlist for user: ${userIdx}. Details:`, error)
      resetState()
    } finally {
      setLoading(false)
    }
  },

  /**
   * 특정 제품을 사용자의 장바구니에서 삭제하는 함수.
   *
   * 이 함수는 주어진 제품 ID (`productIdx`)를 사용하여 사용자의 장바구니에서 해당 제품을 삭제하고,
   * 장바구니의 상태를 업데이트합니다. 또한, 세션 정보를 업데이트하고, 삭제 성공 여부에 따라 사용자에게
   * 피드백을 제공합니다.
   *
   * @param {string} productIdx - 장바구니에서 삭제할 제품의 고유 ID.
   * @returns {Promise<void>} - 이 함수는 비동기적으로 실행되며 반환값이 없습니다.
   *
   * @throws {Error}
   */
  deleteCartItem: async (productIdx: string): Promise<void> => {
    const { userIdx, fetchData, sessionUpdate, resetState, setLoading } = get()

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

      await fetchData()
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

  /**
   * 장바구니에 있는 특정 제품의 수량을 증가시키는 함수.
   *
   * 이 함수는 주어진 제품 ID (`productIdx`)를 기준으로, 해당 제품이 장바구니에 있을 때
   * 최소 수량(`minQuantity`) 이상이고 최대 수량(`maxQuantity`) 미만인 경우에만 수량을 1 증가시킵니다.
   *
   * @param {string} productIdx - 수량을 증가시킬 장바구니 제품의 고유 ID.
   */
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

  /**
   * 장바구니에 있는 특정 제품의 수량을 감소시키는 함수.
   *
   * 이 함수는 주어진 제품 ID (`productIdx`)를 기준으로, 해당 제품이 장바구니에 있을 때
   * 최소 수량(`minQuantity`)보다 크고 최대 수량(`maxQuantity`) 이하일 경우에만 수량을 1 감소시킵니다.
   *
   * @param {string} productIdx - 수량을 감소시킬 장바구니 제품의 고유 ID.
   */
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

  /**
   * 장바구니에 있는 특정 제품의 수량을 설정하는 함수.
   *
   * 이 함수는 주어진 제품 ID (`itemIdx`)를 기준으로, 해당 제품의 수량을 지정된 값(`quantity`)으로 설정합니다.
   * 수량이 지정된 최소값(`minQuantity`)과 최대값(`maxQuantity`) 범위 내에 있는지 유효성 검사를 수행하며,
   * 유효하지 않은 경우 상태를 업데이트하지 않고 경고 메시지를 출력합니다.
   *
   * @param {string} itemIdx - 수량을 설정할 장바구니 제품의 고유 ID.
   * @param {number} quantity - 설정할 제품의 수량.
   */
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
  checkedItemsInfo: () => {
    const { data, checkedItems } = get()
    return data.cartList.filter(({ product }) => checkedItems[product.idx])
  },
  totalQuantity: () => {
    const { checkedItemsInfo } = get()
    return checkedItemsInfo().reduce((sum, { quantity }) => sum + quantity, 0)
  },
  totalPrice: () => {
    const checkedItemsInfo = get().checkedItemsInfo()
    return checkedItemsInfo.reduce(
      (sum, { product, quantity }) => sum + (product.original_price - product.original_price * product.discount_rate) * quantity,
      0,
    )
  },
  totalPriceWithShippingCost: () => {
    const totalPrice = get().totalPrice()
    return totalPrice >= 30000 ? totalPrice : totalPrice + 3000
  },

  /**
   * 특정 항목의 체크 상태를 토글하는 함수.
   *
   * 이 함수는 주어진 항목 ID (`idx`)를 기준으로 `checkedItems` 객체 내의 해당 항목의 체크 상태를 토글합니다.
   * 만약 항목이 `checkedItems` 객체에 존재하지 않는 경우, 기본적으로 `true`로 설정하여 체크된 상태로 만듭니다.
   *
   * @param {string} idx - 체크 상태를 토글할 항목의 고유 ID.
   */
  setCheckedItems: (idx: string) =>
    set((state) => ({
      checkedItems: {
        ...state.checkedItems,
        [idx]: state.checkedItems[idx] !== undefined ? !state.checkedItems[idx] : true,
      },
    })),
  ResetCartlist: async (checkedProductIdxs: string[]) => {
    const { setLoading, userIdx } = get()

    setLoading(true)

    try {
      const response = await removeBulkFromCartlist(userIdx, checkedProductIdxs)

      if (!response.success) {
        console.log('fail to reset')
      }

      toast.success('success to reset')
      return response.cartlistCount
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  },
  isSubmitting: false,
  setIsSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),
  SubmitOrder: async (addressIdx: string, payment: string) => {
    console.log('front data==>', addressIdx, payment)

    const { setLoading, fetchData, userIdx, isSubmitting, setIsSubmitting, checkedItemsInfo, ResetCartlist, setActiveTab, sessionUpdate } = get()
    const totalPriceWithShippingCost = get().totalPriceWithShippingCost()
    setLoading(true)

    if (isSubmitting) return // 이미 제출 중이면 중단
    setIsSubmitting(true)
    console.log('========> 제출')

    try {
      const checkedItems = checkedItemsInfo().map(({ product, quantity }) => {
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
      if (checkedItemsInfo().length <= 0) {
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
      const cartlistCount = await ResetCartlist(checkedProductIdxs)

      console.log('cartlist count==>', cartlistCount)

      if (sessionUpdate) {
        sessionUpdate({ cartlist_length: cartlistCount })
      }

      fetchData()
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
