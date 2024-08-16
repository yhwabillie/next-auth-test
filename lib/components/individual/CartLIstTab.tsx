'use client'
import { useForm } from 'react-hook-form'
import { OrderSchema, OrderSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyTab } from './EmptyTab'
import { Session } from 'next-auth'
import { calculateDiscountedPrice, formatPhoneNumber } from '@/lib/utils'
import { useCartlistInfo } from '@/app/hooks'
import { CartList } from './CartList'
import { OrderUserInfo } from './OrderUserInfo'
import { ShippingInfo } from './ShippingInfo'
import { PaymentInfo } from './PaymentInfo'

interface CartListTabProps {
  session: Session
  userIdx: string
}

export const CartListTab = ({ session, userIdx }: CartListTabProps) => {
  const {
    data,
    setQuantity,
    deleteCartItem,
    increaseQuantity,
    decreaseQuantity,
    loading,
    isCartlistEmpty,
    isAddressEmpty,
    checkedItems,
    setCheckedItems,
    setActiveTab,
    addressActiveTabId,
    setAddressActiveTabId,
    submitOrder,
    checkedItemsInfo,
    totalQuantity,
    totalPrice,
    totalPriceWithShippingCost,
  } = useCartlistInfo(userIdx)

  const { register, handleSubmit } = useForm<OrderSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(OrderSchema),
  })

  /**
   * 최종 주문 데이터 submit
   */
  const handleSubmitOrder = (data: OrderSchemaType) => {
    submitOrder(data.addressIdx, data.payment)
  }

  if (loading) return <TabContentSkeleton />
  if (isCartlistEmpty) return <EmptyTab sub_title="장바구니가 비었습니다" title="🛒 제품을 추가해주세요." type="link" label="장바구니 채우러가기" />

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitOrder)}>
        <h5 className="mb-5 block rounded-lg bg-blue-50 px-4 py-3 text-xl font-semibold text-black">💸 상품 결제하기</h5>

        <CartList
          cartItems={data.cartList}
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          increaseQuantity={increaseQuantity}
          decreaseQuantity={decreaseQuantity}
          setQuantity={setQuantity}
          deleteCartItem={deleteCartItem}
        />

        <OrderUserInfo user_type={session.user?.user_type} name={session.user?.name} email={session.user?.email} />

        <ShippingInfo
          addresses={data.addresses}
          isAddressEmpty={isAddressEmpty}
          setActiveTab={setActiveTab}
          setAddressActiveTabId={setAddressActiveTabId}
          addressActiveTabId={addressActiveTabId}
          register={register}
        />

        <PaymentInfo
          register={register}
          checkedItemsInfo={checkedItemsInfo}
          totalQuantity={totalQuantity}
          totalPrice={totalPrice}
          calculateDiscountedPrice={calculateDiscountedPrice}
        />

        <div className="text-md mb-2 rounded-lg bg-gray-200 py-5 text-center">주문 내용을 모두 확인하였으며, 결제에 동의합니다.</div>
        <button
          disabled={totalQuantity === 0 || isAddressEmpty}
          className="w-full rounded-lg bg-red-500 py-5 text-center text-lg font-bold text-white drop-shadow-md hover:bg-red-600 disabled:bg-gray-400"
        >{`${totalPriceWithShippingCost.toLocaleString('ko-KR')}원 결제하기`}</button>
      </form>
    </>
  )
}
