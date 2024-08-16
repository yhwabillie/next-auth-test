import { OrderlistType } from '@/app/actions/order/actions'
import { toast } from 'sonner'
import { create } from 'zustand'
import { handleLoading } from './utils/helpers'
import { ERROR_MESSAGES, SHIPPING_COST, SHIPPING_COST_THRESHOLD } from '../constants'
import { changeOrderAddress, deleteOrder, getOrderList } from './services/orderService'

interface OrderlistStore {
  userIdx: string
  setUserIdx: (userIdx: string) => void

  orderIdx: string
  setOrderIdx: (orderIdx: string) => void

  loading: boolean
  setLoading: (loading: boolean) => void

  isOrderListEmpty: boolean

  modals: {
    change_address: boolean
  }

  // 모달창 컨트롤
  setModalVisibility: (modalName: keyof OrderlistStore['modals'], isVisible: boolean) => void
  showModal: (modalName: keyof OrderlistStore['modals']) => void
  hideModal: (modalName: keyof OrderlistStore['modals']) => void

  // 가격 계산
  totalPrice: (orderIdx: string) => number
  totalPriceWithShippingCost: (orderIdx: string) => number

  // Data fetching and manipulation
  fetchOrderList: () => Promise<void>
  updateAddressData: (orderIdx: string, newAddressIdx: string) => Promise<void>
  removeOrder: (addressIdx: string) => Promise<void>
  data: OrderlistType[]
}

//초기값
const initialState: Omit<
  OrderlistStore,
  | 'setUserIdx'
  | 'setOrderIdx'
  | 'setLoading'
  | 'setModalVisibility'
  | 'showModal'
  | 'hideModal'
  | 'totalPrice'
  | 'totalPriceWithShippingCost'
  | 'fetchOrderList'
  | 'updateAddressData'
  | 'removeOrder'
> = {
  data: [],
  userIdx: '',
  orderIdx: '',
  loading: false,
  isOrderListEmpty: false,
  modals: {
    change_address: false,
  },
}

export const useOrderlistStore = create<OrderlistStore>((set, get) => ({
  ...initialState,

  setUserIdx: (userIdx: string) => set({ userIdx }),
  setOrderIdx: (orderIdx: string) => set({ orderIdx }),
  setLoading: (loading: boolean) => set({ loading }),

  setModalVisibility: (modalName: keyof OrderlistStore['modals'], isVisible: boolean) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: isVisible,
      },
    })),
  showModal: (modalName: keyof OrderlistStore['modals']) => get().setModalVisibility(modalName, true),
  hideModal: (modalName: keyof OrderlistStore['modals']) => get().setModalVisibility(modalName, false),

  // 총 제품 금액 계산
  totalPrice: (orderIdx: string) => {
    const order = get().data.find((item) => item.idx === orderIdx)

    if (!order) {
      toast.error('해당 주문 데이터를 찾을 수 없습니다.')
      return 0
    }

    return order.orderItems.reduce((total, { unit_price, quantity }) => total + unit_price * quantity, 0)
  },

  // 배송비 포함 총 결제 금액 계산
  totalPriceWithShippingCost: (orderIdx: string) => {
    const { totalPrice } = get()
    const total = totalPrice(orderIdx)
    return total >= SHIPPING_COST_THRESHOLD ? total : total + SHIPPING_COST
  },

  //주문내역 가져오기
  fetchOrderList: async (): Promise<void> => {
    const { userIdx, setLoading } = get()

    await handleLoading(
      setLoading,
      async () => {
        const fetchedOrderlist = await getOrderList(userIdx)

        set({
          data: fetchedOrderlist,
          isOrderListEmpty: fetchedOrderlist.length === 0,
        })
      },
      ERROR_MESSAGES.FETCH_ORDERS,
    )
  },

  //주소 데이터 업데이트
  updateAddressData: async (orderIdx: string, newAddressIdx: string) => {
    const { setLoading, fetchOrderList, hideModal } = get()

    await handleLoading(
      setLoading,
      async () => {
        const response = await changeOrderAddress(orderIdx, newAddressIdx)

        if (response) {
          await fetchOrderList()
          hideModal('change_address')
        }
      },
      ERROR_MESSAGES.UPDATE_ADDRESS,
      '주소가 업데이트되었습니다.',
    )
  },

  //주문내역 삭제
  removeOrder: async (addressIdx: string) => {
    const { setLoading, fetchOrderList } = get()

    await handleLoading(
      setLoading,
      async () => {
        const response = await deleteOrder(addressIdx)

        if (response.success) {
          await fetchOrderList()
        }
      },
      ERROR_MESSAGES.REMOVE_ORDER,
      '주문이 성공적으로 삭제되었습니다.',
    )
  },
}))
