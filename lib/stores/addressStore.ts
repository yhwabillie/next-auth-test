import { create } from 'zustand'
import { AddNewAddressFormSchemaType, AddressFormSchemaType } from '@/lib/zodSchema'
import { createNewAddress, fetchAddressList, removeAddress, setDefaultAddress, updateAddress, UserAddressType } from '@/app/actions/address/actions'
import { toast } from 'sonner'

interface AddressStore {
  //data idx
  userIdx: string
  addressIdx: string
  setUserIdx: (userIdx: string) => void
  setAddressIdx: (userIdx: string) => void

  //fetch data status
  fetchAddresses: () => Promise<void>
  data: UserAddressType[]
  defaultAddress: UserAddressType[]
  EtcAddress: UserAddressType[]
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
  showModal: (modalName: keyof AddressStore['modals']) => void
  hideModal: (modalName: keyof AddressStore['modals']) => void

  //handleClick
  openEditAddressForm: (targetAddress: UserAddressType) => Promise<void>
  updateDefaultAddress: (addressIdx: string) => Promise<void>
  deleteAddress: (addressIdx: string) => Promise<void>

  //handleSubmit
  createAddress: (data: AddressFormSchemaType) => Promise<void>
  createNewAddressData: (data: AddNewAddressFormSchemaType) => Promise<void>
}

// 배송주소 컨트롤
export const useAddressStore = create<AddressStore>((set, get) => ({
  //data idx
  userIdx: '',
  addressIdx: '',
  setUserIdx: (userIdx: string) => set({ userIdx }),
  setAddressIdx: (addressIdx: string) => set({ addressIdx }),

  fetchAddresses: async () => {
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
        defaultAddress: fetchedCartList.filter((item) => item.isDefault),
        EtcAddress: fetchedCartList.filter((item) => !item.isDefault),
      })
    } catch (error) {
      console.error('배송지 데이터를 불러오는 중 오류가 발생했습니다:', error)
      toast.error('배송지 데이터를 불러오는 중 오류가 발생했습니다.')
    } finally {
      set({ loading: false })
    }
  },
  data: [],
  defaultAddress: [],
  EtcAddress: [],
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

  deleteAddress: async (addressIdx: string) => {
    const { fetchAddresses, userIdx, showModal } = get()

    try {
      const response = await removeAddress(addressIdx, userIdx)

      if (!response.success) {
        toast.error('주소 삭제에 실패했습니다. 다시 시도해주세요.')
        return
      }

      await fetchAddresses()
      toast.success('주소를 삭제했습니다.')
    } catch (error) {
      console.error('주소 삭제 중 오류가 발생했습니다:', error)
      showModal('alert')
    }
  },

  openEditAddressForm: async (targetAddress: {
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

  updateDefaultAddress: async (addressIdx: string) => {
    const { userIdx, fetchAddresses } = get()
    set({ loading: true })

    try {
      const response = await setDefaultAddress(userIdx, addressIdx)

      if (!response?.success) {
        toast.error('기본 배송지 변경에 실패했습니다.')
        return
      }

      fetchAddresses()
      toast.success('기본 배송지가 변경되었습니다.')
    } catch (error) {
      console.error('기본 배송지 변경 중 오류가 발생했습니다:', error)
      toast.error('배송지 설정을 변경하는 중 문제가 발생했습니다. 다시 시도해 주세요.')
    } finally {
      set({ loading: false })
    }
  },

  createAddress: async (data: AddressFormSchemaType) => {
    const { userIdx, edit_address, updatePostcode, fetchAddresses, hideModal, reset_edit_Form } = get()

    try {
      if (!edit_address?.idx) return

      const response = await updateAddress(userIdx, edit_address.idx, data)

      if (!response.success) {
        toast.error('배송지 수정에 실패했습니다.')
        return
      }

      await fetchAddresses()

      // UI 업데이트
      updatePostcode({})
      reset_edit_Form()
      hideModal('editAddress')

      toast.success('배송지가 수정되었습니다.')
    } catch (error) {
      console.error('배송지 수정 중 오류가 발생했습니다:', error)
      toast.error('배송지 수정 중 문제가 발생했습니다. 다시 시도해 주세요.')
    }
  },

  createNewAddressData: async (data: AddNewAddressFormSchemaType) => {
    const { userIdx, fetchAddresses, isDefaultAddress, updatePostcode, hideModal } = get()
    const errorMessage = '배송지 생성에 실패했습니다. 다시 시도해주세요.'

    try {
      const response = await createNewAddress(userIdx, data, isDefaultAddress)

      if (!response.success) {
        toast.error(errorMessage)
        return
      }

      await fetchAddresses()

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
