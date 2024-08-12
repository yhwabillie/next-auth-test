import { create } from 'zustand'
import { AddNewAddressFormSchemaType, AddressFormSchemaType, AgreementSchemaType } from './zodSchema'
import { createNewAddress, fetchAddressList, removeAddress, setDefaultAddress, updateAddress, UserAddressType } from '@/app/actions/address/actions'
import { toast } from 'sonner'
import { fetchOrderlist, updateOrderAddress } from '@/app/actions/order/actions'

interface AddressDataStore {
  //data idx
  userIdx: string
  addressIdx: string
  setUserIdx: (userIdx: string) => void
  setAddressIdx: (userIdx: string) => void

  //fetch data status
  fetchData: () => Promise<void>
  data: UserAddressType[]
  loading: boolean
  isEmpty: boolean

  //input data status
  new_address: AddNewAddressFormSchemaType
  edit_address: AddressFormSchemaType
  setNewAddress: (data: AddNewAddressFormSchemaType) => void
  setEditAddress: (data: AddressFormSchemaType) => void
  reset_edit_Form: () => void

  isDefaultAddress: boolean //기본배송지 여부
  updatePostcode: (data: any) => void //postcode complete data

  //modal status
  modals: {
    addNewAddress: boolean
    editAddress: boolean
    postcode: boolean
    changeAddress: boolean
    alert: boolean
  }
  showModal: (modalName: keyof AddressDataStore['modals']) => void
  hideModal: (modalName: keyof AddressDataStore['modals']) => void

  //handleClick
  handleOpenEditForm: (targetAddress: UserAddressType) => Promise<void>
  handleSetDefaultAddress: (addressIdx: string) => Promise<void>
  handleRemoveAddress: (addressIdx: string) => Promise<void>

  //handleSubmit
  handleSubmitUpdateAddress: (data: AddressFormSchemaType) => Promise<void>
  handleSubmitNewAddress: (data: AddNewAddressFormSchemaType) => Promise<void>
}

// 배송주소 컨트롤
export const useAddressDataStore = create<AddressDataStore>((set, get) => ({
  //data idx
  userIdx: '',
  addressIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),
  setAddressIdx: (addressIdx: string) => set({ addressIdx }),

  /**
   * 사용자의 주소 목록을 가져오는 비동기 함수
   *
   * 이 함수는 사용자의 ID(userIdx)를 기반으로 주소 목록을 가져오고,
   * 가져온 데이터를 상태로 업데이트합니다. 데이터가 없거나 오류가 발생하면
   * 이를 처리하고, 로딩 상태를 관리합니다.
   */
  fetchData: async () => {
    const { userIdx } = get()

    set({ loading: true })

    try {
      const fetchedCartList = await fetchAddressList(userIdx)

      if (!fetchedCartList) {
        console.error('Failed to fetch address list')
        return
      }

      set({
        data: fetchedCartList,
        isEmpty: fetchedCartList.length === 0,
        isDefaultAddress: fetchedCartList.length === 0,
      })
    } catch (error) {
      console.error('Error fetching address list:', error)
    } finally {
      set({ loading: false })
    }
  },
  data: [],
  loading: false,
  isEmpty: false,

  //input data status
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
  setNewAddress: (state) => set(() => ({ new_address: state })),
  setEditAddress: (state) => set(() => ({ edit_address: state })),
  reset_edit_Form: () => {
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

  //modal types
  modals: {
    addNewAddress: false,
    editAddress: false,
    postcode: false,
    changeAddress: false,
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

  //기본배송지 여부
  isDefaultAddress: false,

  //postcode complete data
  updatePostcode: (data: any) => {
    if (!data || Object.keys(data).length === 0) {
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

  /**
   * 주소 삭제 핸들러
   *
   * 주어진 주소 ID (addressIdx)를 사용하여 해당 주소를 삭제하고,
   * 삭제가 성공적으로 완료되면 UI를 갱신합니다.
   * 삭제 중 오류가 발생하면 사용자에게 오류를 알립니다.
   *
   * @param addressIdx - 삭제할 주소의 ID
   */
  handleRemoveAddress: async (addressIdx: string) => {
    const { fetchData, userIdx, showModal } = get()

    try {
      const response = await removeAddress(addressIdx, userIdx)

      if (!response.success) {
        toast.error('주소 삭제에 실패했습니다. 다시 시도해주세요.')
        return
      }

      await fetchData()
      toast.success('주소를 삭제했습니다.')
    } catch (error) {
      console.error(error)
      showModal('alert')
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
  handleOpenEditForm: async (targetAddress: {
    idx: string
    recipientName: string
    phoneNumber: string
    addressName: string
    addressLine1: string
    addressLine2: string
    isDefault: boolean
    deliveryNote: string
    postcode: string
  }) => {
    const { data, setEditAddress, showModal } = get()
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

      if (!response.success) {
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
   * 새로운 주소를 생성하고, UI를 업데이트하는 핸들러 함수
   *
   * @param data - 사용자가 제출한 새로운 주소 데이터
   */
  handleSubmitNewAddress: async (data: AddNewAddressFormSchemaType) => {
    const { userIdx, fetchData, isDefaultAddress, updatePostcode, hideModal } = get()
    const errorMessage = '배송지 생성에 실패했습니다. 다시 시도해주세요.'

    try {
      const response = await createNewAddress(userIdx, data, isDefaultAddress)

      if (!response.success) {
        toast.error(errorMessage)
        return
      }

      await fetchData()

      // UI 업데이트
      updatePostcode({})
      hideModal('addNewAddress')

      toast.success('배송지가 추가되었습니다.')
    } catch (error) {
      console.error('Error occurred while creating new address:', error)
      toast.error(errorMessage)
    }
  },
}))

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
