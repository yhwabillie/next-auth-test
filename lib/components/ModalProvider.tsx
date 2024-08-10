'use client'
import { useAddressDataStore } from '../zustandStore'
import { AddNewAddressForm } from './individual/AddNewAddressForm'
import { AddressUpdateForm } from './individual/AddressUpdateForm'
import { PostCodeModal } from './individual/PostCodeModal'

export const ModalProvider = () => {
  const { modals } = useAddressDataStore()

  return (
    <>
      {modals.addNewAddress && <AddNewAddressForm />}
      {modals.editAddress && <AddressUpdateForm />}
      {modals.postcode && <PostCodeModal />}
    </>
  )
}
