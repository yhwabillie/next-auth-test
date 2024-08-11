import { create } from 'zustand'
import { AddNewAddressFormSchemaType, AddressFormSchemaType, AgreementSchemaType } from './zodSchema'
import { createNewAddress, fetchAddressList, removeAddress, updateAddress } from '@/app/actions/address/actions'
import { toast } from 'sonner'
import { fetchOrderlist, updateOrderAddress } from '@/app/actions/order/actions'

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
  showModal: (modalName: keyof AddressDataStore['modals']) => void
  hideModal: (modalName: keyof AddressDataStore['modals']) => void
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
  showModal: (modalName: keyof AddressDataStore['modals']) => void
  hideModal: (modalName: keyof AddressDataStore['modals']) => void
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

//배송주소 컨트롤
interface AddressDataStore {
  modals: {
    addNewAddress: boolean
    editAddress: boolean
    postcode: boolean
    changeAddress: boolean
    alert: boolean
  }
  addressIdx: string
  new_address: AddNewAddressFormSchemaType
  edit_address: AddressFormSchemaType
  fetchData: () => Promise<void>
  updatePostcode: (data: any) => void
  setNewAddress: (data: AddNewAddressFormSchemaType) => void
  setEditAddress: (data: AddressFormSchemaType) => void
  userIdx: string
  data: any[]
  loading: boolean
  isEmpty: boolean
  defaultState: boolean
  setUserIdx: (userIdx: string) => void
  setAddressIdx: (userIdx: string) => void
  handleRemoveAddress: (addressIdx: string) => Promise<void>
  onSubmitNewAddress: (data: AddNewAddressFormSchemaType) => Promise<void>
  onSubmitUpdateAddress: (data: AddressFormSchemaType) => Promise<void>
  showModal: (modalName: keyof AddressDataStore['modals']) => void
  hideModal: (modalName: keyof AddressDataStore['modals']) => void
  reset_edit_Form: () => void // 폼 초기화 함수 추가
}

export const useAddressDataStore = create<AddressDataStore>((set, get) => ({
  modals: {
    addNewAddress: false,
    editAddress: false,
    postcode: false,
    changeAddress: false,
    alert: false,
  },
  addressIdx: '',
  new_address: {
    addressName: '',
    recipientName: '',
    phoneNumber: '',
    new_postcode: '',
    new_addressLine1: '',
    addressLine2: '',
    deliveryNote: '',
  },
  edit_address: {
    addressName: '',
    recipientName: '',
    phoneNumber: '',
    postcode: '',
    addressLine1: '',
    addressLine2: '',
    deliveryNote: '',
  },
  userIdx: '',
  data: [],
  loading: false,
  isEmpty: false,
  defaultState: false,
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
  setUserIdx: (userIdx: string) => set({ userIdx }),
  setAddressIdx: (addressIdx: string) => set({ addressIdx }),
  fetchData: async () => {
    const userIdx = get().userIdx

    if (userIdx) {
      set({ loading: true }) // 로딩 시작

      try {
        const fetchedCartList = await fetchAddressList(userIdx)

        if (!fetchedCartList) {
          console.log('fetch error')
        }

        set({
          data: fetchedCartList,
          isEmpty: fetchedCartList.length === 0,
          defaultState: fetchedCartList.length === 0,
        })
      } catch (error) {
        console.log(error)
      } finally {
        set({ loading: false })
      }
    }
  },
  setNewAddress: (state) => set(() => ({ new_address: state })),
  setEditAddress: (state) => set(() => ({ edit_address: state })),
  updatePostcode: (data: any) => {
    let fullAddress = data.address
    let extraAddress = ''

    if (data.addressType === 'R') {
      if (data.bname !== '') {
        extraAddress += data.bname
      }
      if (data.buildingName !== '') {
        extraAddress += extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName
      }
      fullAddress += extraAddress !== '' ? ` (${extraAddress})` : ''
    }

    set((current) => ({
      edit_address: {
        ...current.edit_address,
        postcode: data.zonecode,
        addressLine1: fullAddress,
      },
      new_address: {
        ...current.new_address,
        new_postcode: data.zonecode,
        new_addressLine1: fullAddress,
      },
    }))
  },
  handleRemoveAddress: async (addressIdx: string) => {
    const { userIdx, showModal } = get()

    try {
      const response = await removeAddress(addressIdx, userIdx)

      if (!response) {
        toast.error('주소 삭제에 실패했습니다.')
        return
      }

      await get().fetchData() // 데이터를 다시 가져오기
      toast.success('주소를 삭제했습니다.')
    } catch (error) {
      showModal('alert')
    }
  },
  onSubmitNewAddress: async (data: AddNewAddressFormSchemaType) => {
    const { userIdx, defaultState, updatePostcode, hideModal } = get()

    try {
      const response = await createNewAddress(userIdx, data, defaultState)

      if (!response) {
        toast.error('배송지 추가에 실패했습니다.')
        return
      }

      await get().fetchData() // 데이터 다시 가져오기
      updatePostcode('') // 우편번호 초기화
      hideModal('addNewAddress') // 모달 숨기기

      toast.success('배송지가 추가되었습니다.')
    } catch (error) {
      console.error('Error adding new address:', error)
      toast.error('배송지 추가에 실패했습니다.')
    }
  },
  reset_edit_Form: () => {
    // 폼을 초기화하는 로직
    set(() => ({
      edit_address: {
        addressName: '',
        recipientName: '',
        phoneNumber: '',
        postcode: '',
        addressLine1: '',
        addressLine2: '',
        deliveryNote: '',
      },
    }))
  },
  onSubmitUpdateAddress: async (data: AddressFormSchemaType) => {
    const { userIdx, edit_address, fetchData, hideModal, reset_edit_Form } = get()

    try {
      const response = await updateAddress(userIdx, edit_address?.idx!, data)

      if (!response?.success) {
        toast.error('수정 실패')
        return
      }

      await fetchData() // 데이터를 다시 가져오기

      hideModal('editAddress') // 모달 숨기기
      reset_edit_Form() // 수정 폼 초기화
      toast.success('배송지가 수정되었습니다.')
    } catch (error) {
      console.error('Error updating address:', error)
      toast.error('배송지 수정 중 오류가 발생했습니다.')
    }
  },
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
