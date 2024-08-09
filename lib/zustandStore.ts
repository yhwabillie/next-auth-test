import { create } from 'zustand'
import { AgreementSchemaType } from './zodSchema'

//

type DefaultState = {
  defaultState: boolean
  setDefaultState: (data: boolean) => void
}

//주소 리스트 empty 여부
export const useDefaultAddressStore = create<DefaultState>((set) => ({
  defaultState: false,
  setDefaultState: (data: boolean) => set({ defaultState: data }),
}))

//주소 수정 폼 모달
interface AddressFormState {
  showForm: boolean
  showFormComponent: () => void
  hideForm: () => void
}

export const useAddressFormStore = create<AddressFormState>((set) => ({
  showForm: false,
  showFormComponent: () => set({ showForm: true }), // 폼을 표시하는 함수
  hideForm: () => set({ showForm: false }), // 폼을 숨기는 함수
}))

//주소검색 모달
interface AddressState {
  postcode: string
  addressLine1: string
  modalState: boolean
  isPostcodeOpen: boolean
  updateData: (data: any) => void
  setModalState: (state: boolean) => void
  setIsPostcodeOpen: (state: boolean) => void
}

export const useAddressStore = create<AddressState>((set) => ({
  postcode: '',
  addressLine1: '',
  modalState: false,
  isPostcodeOpen: false,
  updateData: (data) => {
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

    set(() => ({
      postcode: data.zonecode,
      addressLine1: fullAddress,
    }))
  },
  setModalState: (state) => set(() => ({ modalState: state })),
  setIsPostcodeOpen: (state) => set(() => ({ isPostcodeOpen: state })),
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
