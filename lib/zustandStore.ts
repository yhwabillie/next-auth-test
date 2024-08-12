import { create } from 'zustand'
import { AddNewAddressFormSchemaType, AddressFormSchemaType, AgreementSchemaType } from './zodSchema'
import { createNewAddress, fetchAddressList, removeAddress, setDefaultAddress, updateAddress } from '@/app/actions/address/actions'
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
export interface AddressItemType {
  idx: string
  userIdx: string
  recipientName: string
  phoneNumber: string
  addressName: string
  addressLine1: string
  addressLine2: string
  isDefault: boolean
  deliveryNote: string
  postcode: string
  createdAt: Date
  updatedAt: Date
}

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
  data: AddressItemType[]
  loading: boolean
  isEmpty: boolean
  defaultState: boolean
  setUserIdx: (userIdx: string) => void
  setAddressIdx: (userIdx: string) => void
  handleRemoveAddress: (addressIdx: string) => Promise<void>
  onSubmitNewAddress: (data: AddNewAddressFormSchemaType) => Promise<void>
  showModal: (modalName: keyof AddressDataStore['modals']) => void
  hideModal: (modalName: keyof AddressDataStore['modals']) => void
  reset_edit_Form: () => void // 폼 초기화 함수 추가
  handleSetDefaultAddress: (addressIdx: string) => Promise<void>
  handleOpenEditForm: (targetAddress: AddressItemType) => Promise<void>
  handleSubmitUpdateAddress: (data: AddressFormSchemaType) => Promise<void>
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
    if (!data || Object.keys(data).length === 0) {
      // data가 비어 있는 경우 초기화
      set((current) => ({
        edit_address: {
          ...current.edit_address,
          postcode: '',
          addressLine1: '',
        },
        new_address: {
          ...current.new_address,
          new_postcode: '',
          new_addressLine1: '',
        },
      }))
      return
    }

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

  /**
   * 배송지 수정 폼 제출 핸들러
   *
   * 사용자가 제출한 주소 데이터를 서버에 전송하여 배송지를 업데이트하고,
   * 업데이트가 성공적으로 완료되면 UI를 갱신합니다.
   *
   * @param data - 사용자가 제출한 주소 데이터
   */
  handleSubmitUpdateAddress: async (data: AddressFormSchemaType) => {
    const { userIdx, edit_address, updatePostcode, fetchData, hideModal, reset_edit_Form } = get()

    try {
      if (!edit_address?.idx) return

      const response = await updateAddress(userIdx, edit_address.idx, data)

      if (!response?.success) {
        toast.error('배송지 수정에 실패했습니다.')
        return
      }

      await fetchData()

      // UI 업데이트
      updatePostcode({})
      reset_edit_Form()
      hideModal('editAddress')

      toast.success('배송지가 수정되었습니다.')
    } catch (error) {
      console.error('Error updating address:', error)
      toast.error('배송지 수정 중 오류가 발생했습니다.')
    }
  },

  /**
   * 클릭한 주소 수정 폼 열기
   *
   * 주어진 주소 항목(targetAddress)의 idx를 기준으로,
   * 데이터 목록(data)에서 동일한 idx를 가진 항목을 찾아
   * 수정할 주소로 설정한 뒤, 'editAddress' 모달을 화면에 표시합니다.
   *
   * @param targetAddress - 사용자가 수정하려고 클릭한 주소 항목
   */
  handleOpenEditForm: async (targetAddress: AddressItemType) => {
    const { userIdx, data, setEditAddress, showModal } = get()
    const target = data.find((dataItem) => dataItem.idx === targetAddress.idx)

    if (!target) {
      toast.error('해당 주소 데이터를 찾을 수 없습니다.')
      return
    }

    setEditAddress(target) //찾은 항목을 수정할 주소로 설정
    showModal('editAddress') //'editAddress' 모달을 표시
  },

  /**
   * 기본 배송지 설정 함수
   *
   * 주어진 주소 ID (addressIdx)를 사용하여 해당 주소를 기본 배송지로 설정합니다.
   * 설정 작업 중 로딩 상태를 관리하고, 작업 완료 후 데이터 갱신과 사용자 피드백을 제공합니다.
   *
   * @param addressIdx - 기본 배송지로 설정할 주소의 ID
   */
  handleSetDefaultAddress: async (addressIdx: string) => {
    const { userIdx, fetchData } = get()
    set({ loading: true })

    try {
      const response = await setDefaultAddress(userIdx, addressIdx)

      if (!response?.success) {
        toast.error('기본 배송지 변경에 실패했습니다.')
        return
      }

      fetchData()
      toast.success('기본 배송지가 변경되었습니다.')
    } catch (error) {
      console.error('Error in setDefaultAddress:', error)
      toast.error('배송지 설정을 변경하는 중 문제가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      set({ loading: false })
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
