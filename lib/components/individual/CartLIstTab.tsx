'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FaCheck, FaMinus, FaPlus } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import { OrderSchema, OrderSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyTab } from './EmptyTab'
import { IoMdClose } from 'react-icons/io'
import clsx from 'clsx'
import { Session } from 'next-auth'
import { useCartlistStore } from '@/lib/stores/cartlistStore'
import { calculateDiscountedPrice, formatPhoneNumber } from '@/lib/utils'

interface CartListTabProps {
  session: Session
  userIdx: string
}

export const CartListTab = ({ session, userIdx }: CartListTabProps) => {
  const { update } = useSession()
  const {
    setSessionUpdate,
    setUserIdx,
    fetchData,
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
    activeTabId,
    addressActiveTabId,
    setAddressActiveTabId,
    SubmitOrder,
  } = useCartlistStore()

  const checkedItemsInfo = useCartlistStore((state) => state.checkedItemsInfo())
  const totalQuantity = useCartlistStore((state) => state.totalQuantity())
  const totalPrice = useCartlistStore((state) => state.totalPrice())
  const totalPriceWithShippingCost = useCartlistStore((state) => state.totalPriceWithShippingCost())

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(OrderSchema),
  })

  /**
   * 최종 주문 데이터 submit
   */
  const handleSubmitOrder = (data: OrderSchemaType) => {
    SubmitOrder(data.addressIdx, data.payment)
  }

  useEffect(() => {
    setUserIdx(userIdx)
    setSessionUpdate(update)
    fetchData()
  }, [activeTabId, userIdx, setSessionUpdate, update, fetchData])

  if (loading) return <TabContentSkeleton />

  return (
    <>
      {isCartlistEmpty ? (
        <EmptyTab sub_title="장바구니가 비었습니다" title="🛒 제품을 추가해주세요." type="link" label="장바구니 채우러가기" />
      ) : (
        <>
          <form onSubmit={handleSubmit(handleSubmitOrder)}>
            <h5 className="mb-5 block rounded-lg bg-blue-50 px-4 py-3 text-xl font-semibold text-black">💸 상품 결제하기</h5>
            <fieldset className="mx-4 mb-16">
              <h5 className="mb-2 block text-lg font-semibold">장바구니</h5>
              <ul className="flex flex-col gap-5">
                {data.cartList.map(({ product, quantity }, index) => (
                  <li
                    key={index}
                    className={clsx('flex flex-row justify-between rounded-lg border p-3 last:mb-0', {
                      'border-blue-300 bg-blue-100': checkedItems[product.idx],
                      'border-gray-300 bg-gray-100': !checkedItems[product.idx],
                    })}
                  >
                    <div className="flex flex-row">
                      <label
                        htmlFor={product.idx}
                        className="mr-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-md bg-gray-400/20 drop-shadow-md"
                      >
                        <input
                          id={product.idx}
                          type="checkbox"
                          checked={checkedItems[product.idx] || false}
                          onChange={() => setCheckedItems(product.idx)}
                        />
                        {checkedItems[product.idx] && <FaCheck className="cursor-pointer text-lg text-blue-600" />}
                      </label>
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="mr-5 block h-28 w-28 rounded-lg border border-gray-400/30 drop-shadow-lg"
                      />
                      <div className="flex flex-col justify-center">
                        <p className="mb-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-sm text-white drop-shadow-md">{product.category}</p>
                        <strong className="text-md block font-medium text-gray-600">{product.name}</strong>

                        {product.discount_rate === 0 ? (
                          <p className="text-lg font-bold text-gray-800">{product.original_price.toLocaleString('ko-KR')}원</p>
                        ) : (
                          <div className="justify-content flex flex-row items-center gap-2">
                            <p className="text-lg font-bold text-red-600">{product.discount_rate * 100}%</p>
                            <p className="text-md text-gray-400 line-through">{product.original_price.toLocaleString('ko-KR')}원</p>
                            <p className="text-lg font-bold text-gray-800">
                              {calculateDiscountedPrice(product.original_price, product.discount_rate)}
                            </p>
                          </div>
                        )}

                        <div className="mt-2 flex w-fit flex-row items-center border border-gray-400/50">
                          <div
                            onClick={() => decreaseQuantity(product.idx)}
                            className={clsx('flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200', {
                              'cursor-not-allowed bg-gray-400': quantity <= 1,
                            })}
                          >
                            <FaMinus className="text-xs" />
                          </div>
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={quantity}
                            onChange={(e) => setQuantity(product.idx, parseInt(e.target.value, 10))}
                            className="h-8 w-8 text-center text-xs font-semibold"
                          />
                          <div
                            onClick={() => increaseQuantity(product.idx)}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200"
                          >
                            <FaPlus className="text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="justify-top flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => deleteCartItem(product.idx)}
                        className="flex items-center gap-2 rounded-md bg-gray-500 p-1 text-sm font-semibold text-white drop-shadow-lg transition-all duration-150 ease-in-out hover:bg-gray-600"
                      >
                        <IoMdClose className="text-xl" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset className="mx-4 mb-16">
              <h5 className="mb-2 block text-lg font-semibold">주문자 정보</h5>
              <dl className="flex flex-col gap-3 border-l-4 border-gray-200 pl-4">
                <div className="flex items-center gap-2">
                  <dt className="w-[200px] font-medium">회원구분</dt>
                  <dd className="text-gray-700">{session?.user?.user_type === 'indivisual' ? '일반회원' : '어드민'}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="w-[200px] font-medium">이름</dt>
                  <dd className="text-gray-700">{session?.user?.name}</dd>
                </div>
                <div className="flex items-center gap-2">
                  <dt className="w-[200px] font-medium">이메일</dt>
                  <dd className="text-gray-700">{session?.user?.email}</dd>
                </div>
              </dl>
            </fieldset>

            <fieldset className="mx-4 mb-16">
              <h6 className="mb-2 block text-lg font-semibold">배송지 정보</h6>

              {isAddressEmpty ? (
                <EmptyTab
                  sub_title="입력된 배송정보가 없습니다"
                  title="🚚 배송지를 추가해주세요."
                  type="btn"
                  label="배송정보 입력하러 가기"
                  clickEvent={() => setActiveTab(1)}
                />
              ) : (
                <>
                  <ul className="mb-4 flex flex-col gap-2 text-sm">
                    <span className="sr-only">배송지 선택</span>
                    <li className="flex w-fit flex-row items-center gap-2">
                      {data.addresses.map((item, index) => (
                        <label
                          key={index}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm"
                        >
                          <input
                            {...register('addressIdx')}
                            type="radio"
                            value={item.idx}
                            onChange={() => setAddressActiveTabId(item.idx)}
                            defaultChecked={index === 0}
                          />
                          <span className="font-medium">{item.addressName}</span>
                        </label>
                      ))}
                    </li>
                  </ul>

                  {data.addresses.map(
                    (item, index) =>
                      addressActiveTabId === item.idx && (
                        <dl key={index} className="flex flex-col gap-3 border-l-4 border-gray-200 pl-4">
                          <div className="flex items-center gap-2">
                            <dt className="w-[200px] font-medium">받는이</dt>
                            <dd className="text-gray-700">{item.recipientName}</dd>
                          </div>
                          <div className="flex items-center gap-2">
                            <dt className="w-[200px] font-medium">연락처</dt>
                            <dd>{formatPhoneNumber(item.phoneNumber)}</dd>
                            <input {...register('phoneNumber')} className="h-0 w-0" type="number" value={item.phoneNumber} />
                          </div>
                          <div className="flex items-center gap-2">
                            <dt className="w-[200px] font-medium">배송지</dt>
                            <dd className="text-gray-700">{`(${item.postcode}) ${item.addressLine1} ${item.addressLine2}`}</dd>
                          </div>
                          <div className="flex items-center gap-2">
                            <dt className="w-[200px] font-medium">배송 요청사항</dt>
                            <dd className="text-gray-700">{item.deliveryNote}</dd>
                          </div>
                        </dl>
                      ),
                  )}
                </>
              )}
            </fieldset>

            <h5 className="mb-5 block rounded-lg bg-blue-50 px-4 py-3 text-xl font-semibold text-black">💸 결제 정보</h5>
            <fieldset className="mx-4">
              <ul className="flex flex-col gap-5">
                <li className="flex flex-col gap-2">
                  <span className="text-lg font-semibold">결제수단</span>
                  <ul className="mb-4 flex flex-row gap-2 text-sm">
                    <li className="flex w-fit flex-row items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm">
                        <input {...register('payment')} type="radio" value="CREDIT_CARD" name="payment" defaultChecked />
                        <span>신용카드</span>
                      </label>
                    </li>
                    <li className="flex w-fit flex-row items-center gap-2">
                      <label className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm">
                        <input {...register('payment')} type="radio" value="BANK_TRANSFER" name="payment" />
                        <span>실시간 계좌이체</span>
                      </label>
                    </li>
                  </ul>
                </li>
                <li className="flex flex-col">
                  <span className="mb-2 text-lg font-semibold">구매금액</span>
                  <ul>
                    <li className="mb-4 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm">
                      <span>주문상품 : </span>
                      <span>{`${totalQuantity}개`}</span>
                    </li>
                    {checkedItemsInfo.map(({ product, quantity }) => (
                      <li key={product.idx} className="mb-2 flex items-center justify-between gap-x-5 px-2 text-gray-600/50">
                        <p className="flex items-center gap-4">
                          <span className="block w-[300px] font-medium">{product.name}</span>
                          <span className="font-medium">{quantity}개</span>
                        </p>
                        <span>{`${calculateDiscountedPrice(product.original_price, product.discount_rate, quantity)}`}</span>
                      </li>
                    ))}

                    <li className="mt-4 px-2 text-gray-600/50">{totalPrice >= 30000 ? '배송비(3만원 이상 무료배송) 0원' : '배송비(+3,000원)'}</li>

                    <li className="mt-4 flex flex-row items-center justify-between border-t border-blue-600 px-2 py-4">
                      <span className="text-md text-red-600">최종 결제금액</span>
                      <span className="text-2xl font-bold text-red-600">{`${(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toLocaleString('ko-KR')}원`}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </fieldset>

            <div className="text-md mb-2 rounded-lg bg-gray-200 py-5 text-center">주문 내용을 모두 확인하였으며, 결제에 동의합니다.</div>
            <button
              disabled={totalQuantity === 0 || isAddressEmpty}
              className="w-full rounded-lg bg-red-500 py-5 text-center text-lg font-bold text-white drop-shadow-md hover:bg-red-600 disabled:bg-gray-400"
            >{`${totalPriceWithShippingCost.toLocaleString('ko-KR')}원 결제하기`}</button>
          </form>
        </>
      )}
    </>
  )
}
