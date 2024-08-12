'use client'
import { useAddressStore } from '../stores/addressStore'
import { useOrderDataStore } from '../zustandStore'
import { AddNewAddressForm } from './individual/AddNewAddressForm'
import { AddressUpdateForm } from './individual/AddressUpdateForm'
import { AlertErrorModal } from './individual/alertErrorModal'
import { ChangeOrderAddress } from './individual/ChangeOrderAddress'
import { PostCodeModal } from './individual/PostCodeModal'

export const ModalProvider = () => {
  const { modals: address_modals } = useAddressStore()
  const { modals: order_modals } = useOrderDataStore()

  const alert_messages = {
    addressList: {
      error: '해당 주소 데이터로 생성된 주문/배송 데이터가 있습니다. <br /> 배송완료 후 삭제해주세요.',
    },
  }

  return (
    <>
      {address_modals.addNewAddress && <AddNewAddressForm />}
      {address_modals.editAddress && <AddressUpdateForm />}
      {address_modals.postcode && <PostCodeModal />}
      {order_modals.changeAddress && <ChangeOrderAddress />}
      {address_modals.alert && <AlertErrorModal message={alert_messages.addressList.error} />}
    </>
  )
}
