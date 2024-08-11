'use client'
import { useAddressDataStore, useOrderDataStore } from '../zustandStore'
import { AddNewAddressForm } from './individual/AddNewAddressForm'
import { AddressUpdateForm } from './individual/AddressUpdateForm'
import { ChangeOrderAddress } from './individual/ChangeOrderAddress'
import { PostCodeModal } from './individual/PostCodeModal'

export const ModalProvider = () => {
  const { modals: address_modals } = useAddressDataStore()
  const { modals: order_modals } = useOrderDataStore()

  return (
    <>
      {address_modals.addNewAddress && <AddNewAddressForm />}
      {address_modals.editAddress && <AddressUpdateForm />}
      {address_modals.postcode && <PostCodeModal />}
      {order_modals.changeAddress && <ChangeOrderAddress />}
    </>
  )
}
