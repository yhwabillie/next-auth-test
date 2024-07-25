import { create } from 'zustand'
import { AgreementSchemaType } from './zodSchema'

type AgreementState = {
  agreements: null
  setAgreement: (data: any) => void
}

export const useAgreementStore = create<AgreementState>((set) => ({
  agreements: null,
  setAgreement: (data: any) => set({ agreements: data }),
}))
