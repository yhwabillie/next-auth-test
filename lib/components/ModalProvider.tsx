'use client'
import { useAddressDataStore, useAlertModalStore, useOrderDataStore } from '../zustandStore'
import { AddNewAddressForm } from './individual/AddNewAddressForm'
import { AddressUpdateForm } from './individual/AddressUpdateForm'
import { AlertErrorModal } from './individual/alertErrorModal'
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
      {address_modals.alert && (
        <AlertErrorModal message={'해당 주소 데이터로 생성된 주문/배송 데이터가 있습니다. <br /> 배송완료 후 삭제해주세요.'} />
      )}
    </>
  )
}
