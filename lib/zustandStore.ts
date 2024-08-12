import { create } from 'zustand'
import { fetchOrderlist, updateOrderAddress } from '@/app/actions/order/actions'
import { AgreementSchemaType } from './zodSchema'

interface ModalType {
  modals: {
    addNewAddress: boolean
    editAddress: boolean
    postcode: boolean
    changeAddress: boolean
    alert: boolean
  }
}

//탭메뉴 컨트롤
interface tabMenuActiveStore {
  activeTabId: number
  setActiveTab: (id: number) => void
}

export const tabMenuActiveStore = create<tabMenuActiveStore>((set) => ({
  activeTabId: 3, // 초기 활성화된 탭 ID (예: 배송정보)
  setActiveTab: (id) => set({ activeTabId: id }),
}))

//상태 모달 컨트롤
interface alertModalStore {
  modals: {
    error: boolean
    info: boolean
  }
  showModal: (modalName: keyof ModalType['modals']) => void
  hideModal: (modalName: keyof ModalType['modals']) => void
}

export const useAlertModalStore = create<alertModalStore>((set) => ({
  modals: {
    error: false,
    info: false,
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
        [modalName]: true,
      },
    })),
}))

//결제완료 주문 리스트 컨트롤
interface OrderDataStore {
  modals: {
    changeAddress: boolean
  }
  userIdx: string
  orderIdx: string
  newAddressIdx: string
  loading: boolean
  data: any[]
  isEmpty: boolean
  setUserIdx: (userIdx: string) => void
  setOrderIdx: (orderIdx: string) => void
  setNewAddressIdx: (newAddressIdx: string) => void
  fetchData: () => Promise<void>
  updateData: () => Promise<void>
  showModal: (modalName: keyof ModalType['modals']) => void
  hideModal: (modalName: keyof ModalType['modals']) => void
}

export const useOrderDataStore = create<OrderDataStore>((set, get) => ({
  modals: {
    changeAddress: false,
  },
  userIdx: '',
  orderIdx: '',
  newAddressIdx: '',
  loading: false,
  data: [],
  isEmpty: false,
  setUserIdx: (userIdx: string) => set({ userIdx }),
  setOrderIdx: (orderIdx: string) => set({ orderIdx }),
  setNewAddressIdx: (newAddressIdx: string) => set({ newAddressIdx }),
  fetchData: async () => {
    const userIdx = get().userIdx

    if (userIdx) {
      set({ loading: true }) // 로딩 시작

      try {
        const fetchedOrderList = await fetchOrderlist()

        if (!fetchedOrderList) {
          console.log('fetch error')
        }

        set({
          data: fetchedOrderList,
          isEmpty: fetchedOrderList.length === 0,
        })
      } catch (error) {
        console.log(error)
      } finally {
        set({ loading: false })
      }
    }
  },
  updateData: async () => {
    const { userIdx, orderIdx, newAddressIdx, fetchData, hideModal } = get()

    if (userIdx) {
      set({ loading: true }) // 로딩 시작

      try {
        const response = await updateOrderAddress(orderIdx, newAddressIdx)

        if (!response) {
          console.log('updated error')
        }

        hideModal('changeAddress')

        await fetchData()
      } catch (error) {
      } finally {
        set({ loading: false })
      }
    }
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
}))

//모달 열기/닫기
type ModalState = {
  modalState: boolean
  setModalState: (data: boolean) => void
}

export const useModalStore = create<ModalState>((set) => ({
  modalState: false,
  setModalState: (data: boolean) => set({ modalState: data }),
}))

//동의 컨트롤
type AgreementState = {
  agreements: AgreementSchemaType
  setAgreement: (data: AgreementSchemaType) => void
}

export const useAgreementStore = create<AgreementState>((set) => ({
  agreements: {
    service_agreement: false,
    privacy_agreement: false,
    selectable_agreement: false,
  },
  setAgreement: (data: AgreementSchemaType) => set({ agreements: data }),
}))

interface ProductState {
  productState: boolean
  setProductState: (data: boolean) => void
}

export const useProductStore = create<ProductState>((set) => ({
  productState: false,
  setProductState: (data: boolean) => set({ productState: data }),
}))
