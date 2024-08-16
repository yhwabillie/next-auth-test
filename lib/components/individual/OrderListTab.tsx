'use client'
import { useEffect } from 'react'
import dayjs from 'dayjs'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyTab } from './EmptyTab'
import { useOrderlistStore } from '@/lib/stores/orderlistStore'
import { IoMdClose } from 'react-icons/io'
import 'dayjs/locale/ko'
import clsx from 'clsx'
import { calculateDiscountedPrice, formatPhoneNumber } from '@/lib/utils'
import { BsChatLeftText } from 'react-icons/bs'
import { useAddressStore } from '@/lib/stores/addressStore'
dayjs.locale('ko')

interface OrderListTabProps {
  userIdx: string
}

export const OrderListTab = ({ userIdx }: OrderListTabProps) => {
  const { setAddressIdx } = useAddressStore()
  const {
    fetchData,
    data,
    setUserIdx,
    setOrderIdx,
    totalPriceWithShippingCost,
    showModal,
    loading,
    setIsShippingCost,
    handleRemoveOrderData,
    isEmpty,
    totalPrice,
  } = useOrderlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchData()
  }, [])

  if (loading) return <TabContentSkeleton />
  if (isEmpty) return <EmptyTab sub_title="구매하신 제품이 없습니다." title="💸 필요한 제품을 구매해보세요" type="link" label="쇼핑하러가기" />

  return (
    <section>
      <header className="mb-4 flex items-baseline gap-2 px-2">
        <h5 className="block w-fit text-xl font-semibold text-black">주문 상세정보</h5>
        <p className="w-fit font-semibold text-blue-500">{`(총 ${data.length}건)`}</p>
      </header>

      <ul className="flex flex-col gap-5 px-2">
        {data.map((item) => (
          <li key={item.idx} className="relative rounded-lg bg-blue-400/15 p-8">
            <IoMdClose onClick={() => handleRemoveOrderData(item.idx)} className="absolute right-5 top-5 cursor-pointer text-2xl" />
            <div className="flex items-center gap-2">
              <strong className="mb-2 block text-lg text-blue-500">{item.status === 'pending' && '결제완료'}</strong>
              <span
                className={clsx('mb-2 inline-block w-fit rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white drop-shadow-md', {
                  'bg-pink-500': setIsShippingCost(item.idx),
                })}
              >
                {setIsShippingCost(item.idx) ? '배송비 무료' : '배송비 3,000원'}
              </span>
            </div>
            <div className="mb-10 flex flex-col gap-1 border-b border-blue-500/40 pb-5">
              <p className="tracking-tighter text-gray-600">
                <span className="text-md mr-2 inline-block font-bold">주문인덱스 :</span>
                <span className="text-md">{item.idx}</span>
              </p>

              <p className="tracking-tighter text-gray-600">
                <span className="text-md mr-1 inline-block font-medium">{dayjs(item.createdAt).format('YYYY년 MM월 DD일 HH:mm:ss (ddd)')}</span>
                <span className="text-md inline-block font-semibold text-blue-500">결제</span>
              </p>
            </div>

            <div>
              <h6 className="mb-2 block text-lg font-bold text-gray-700">🛍️ 주문상품</h6>
              <ul className="mb-10 flex flex-col gap-5">
                {item.orderItems.map(({ product, quantity }, index) => (
                  <li key={index} className="flex flex-row gap-4 rounded-lg bg-white py-3 pl-3 drop-shadow-md">
                    <img src={product.imageUrl} alt={product.name} className="h-20 w-20 rounded-lg border border-gray-500/30 drop-shadow-md" />
                    <div>
                      <strong className="mb-1 block font-semibold tracking-tighter text-gray-700">{product.name}</strong>
                      <p className="mb-1 flex items-center gap-2">
                        <span className="inline-block rounded-[4px] border border-gray-400 bg-white px-[3px] py-[2px] text-xs text-gray-500">
                          개수
                        </span>
                        <span className="text-sm">{`${quantity}개`}</span>
                      </p>

                      {product.discount_rate === 0 ? (
                        <span className="mr-1 font-bold text-gray-700">{product.original_price.toLocaleString('ko-KR')}원</span>
                      ) : (
                        <p>
                          <span className="mr-1 inline-block font-bold text-red-500">{product.discount_rate * 100}%</span>
                          <span className="mr-1 font-bold text-gray-700">
                            {calculateDiscountedPrice(product.original_price, product.discount_rate)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">{product.original_price.toLocaleString('ko-KR')}</span>
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mb-2 flex items-center justify-between">
                <h6 className="block text-lg font-bold text-gray-700">🚚 배송지</h6>
                <button
                  onClick={() => {
                    showModal('change_address')
                    setOrderIdx(item.idx)
                    setAddressIdx(item.address.idx)
                  }}
                  type="button"
                  className="rounded-[5px] bg-blue-600 px-[15px] py-[8px] text-sm text-white drop-shadow-md hover:bg-blue-700"
                >
                  배송지변경
                </button>
              </div>
              <ul className="mb-10 rounded-lg bg-white p-5 drop-shadow-md">
                <li className="text-md mb-1 flex items-center gap-2">
                  <span className="font-semibold text-blue-500">{`${item.address.recipientName}(${item.address.addressName})`}</span>
                  {item.address.isDefault ? (
                    <span className="rounded-[5px] bg-green-100 px-[10px] py-[8px] text-xs font-semibold text-green-600">기본배송지</span>
                  ) : (
                    <span className="rounded-[5px] bg-blue-100 px-[10px] py-[8px] text-xs font-semibold text-blue-600">기타배송지</span>
                  )}
                </li>
                <li className="text-md mb-1 font-medium text-gray-600">{formatPhoneNumber(item.address.phoneNumber)}</li>
                <li className="text-md mb-2 font-medium tracking-tighter text-gray-600">{`(${item.address.postcode}) ${item.address.addressLine1} ${item.address.addressLine2}`}</li>
                <li className="flex items-center gap-2">
                  <BsChatLeftText className="text-md text-gray-500" />
                  <span className="font-medium tracking-tighter text-gray-500">{item.address.deliveryNote}</span>
                </li>
              </ul>

              <h6 className="mb-2 block text-lg font-bold text-gray-700">💸 결제정보</h6>
              <ul className="rounded-lg bg-white p-5 drop-shadow-md">
                <li className="mb-2 flex items-center justify-between">
                  <span className="font-semibold">주문금액</span>
                  <span className="font-semibold text-blue-500">{`총 ${totalPriceWithShippingCost(item.idx).toLocaleString('ko-KR')}원`}</span>
                </li>
                <dl className="flex items-center justify-between border-l-4 border-blue-400/30 pb-1 pl-2">
                  <dt className="text-sm text-gray-500">상품금액</dt>
                  <dd className="text-sm text-gray-500">{`${totalPrice(item.idx).toLocaleString('ko-KR')}원`}</dd>
                </dl>
                <dl className="mb-4 flex items-center justify-between border-l-4 border-blue-400/30 pb-1 pl-2">
                  <dt className="text-sm text-gray-500">배송비</dt>
                  <dd className="text-sm text-gray-500">{setIsShippingCost(item.idx) ? '무료' : '3,000원'}</dd>
                </dl>

                <li className="flex items-center justify-between">
                  <span className="font-semibold">{item.payment === 'CREDIT_CARD' ? '신용카드' : '계좌이체'}</span>
                  <span className="font-semibold text-gray-500">{`${totalPriceWithShippingCost(item.idx).toLocaleString('ko-KR')}원`}</span>
                </li>
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
