'use client'
import { useAddressStore } from '@/lib/stores/addressStore'
import { useCartlistStore } from '@/lib/stores/cartlistStore'
import { useOrderlistStore } from '@/lib/stores/orderlistStore'
import { useProductsStore } from '@/lib/stores/productsStore'
import { AddNewAddressForm } from '@/lib/components/individual/AddNewAddressForm'
import { AddressUpdateForm } from '@/lib/components/individual/AddressUpdateForm'
import { AlertErrorModal } from '@/lib/components/common/modals/AlertErrorModal'
import { ChangeOrderAddress } from '@/lib/components/individual/ChangeOrderAddress'
import { PostCodeModal } from '@/lib/components/individual/PostCodeModal'
import { FloatingBtn } from '../FloatingBtn'
import { useFloatingBtnStore } from '@/lib/zustandStore'

export const ModalProvider = () => {
  const { modals: address_modals, hideModal: address_hide } = useAddressStore()
  // const { modals: product_modals, hideModal: product_hide } = useProductsStore()
  const { modals: cart_modals, hideModal: cart_hide } = useCartlistStore()
  const { modals: order_modals, hideModal: order_hide } = useOrderlistStore()
  const { state } = useFloatingBtnStore()

  const alert_messages = {
    addressList: {
      warning: '해당 주소 데이터로 생성된 주문/배송 데이터가 있습니다. <br /> 배송완료 후 삭제해주세요.',
    },
    products: {
      warning: '위시리스트와 장바구니 기능은 <br/> 로그인 후 사용할 수 있습니다.',
    },
    cartlist: {
      need_session: '세션이 필요합니다.',
    },
  }

  return (
    <>
      {address_modals.addNewAddress && <AddNewAddressForm />}
      {address_modals.editAddress && <AddressUpdateForm />}
      {address_modals.postcode && <PostCodeModal />}
      {order_modals.change_address && <ChangeOrderAddress />}
      {address_modals.alert && <AlertErrorModal handleClickClose={() => address_hide('alert')} message={alert_messages.addressList.warning} />}
      {cart_modals.need_session && (
        <AlertErrorModal handleClickClose={() => cart_hide('need_session')} message={alert_messages.cartlist.need_session} />
      )}
      {state && <FloatingBtn />}
    </>
  )
}
