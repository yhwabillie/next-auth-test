'use client'
import { removeOrder } from '@/app/actions/order/actions'
import { useEffect } from 'react'
import { toast } from 'sonner'
import dayjs from 'dayjs'
// import { useOrderDataStore } from '@/lib/zustandStore'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyTab } from './EmptyTab'
import { useAddressStore } from '@/lib/stores/addressStore'
import { useOrderlistStore } from '@/lib/stores/orderlistStore'
import { IoMdClose } from 'react-icons/io'
import 'dayjs/locale/ko'
import clsx from 'clsx'
import { calculateDiscountedPrice } from '@/lib/utils'
dayjs.locale('ko')

interface OrderListTabProps {
  userIdx: string
}

export const OrderListTab = ({ userIdx }: OrderListTabProps) => {
  const { fetchData, data, setUserIdx, loading, setIsShippingCost, handleRemoveOrderData, isEmpty, totalPrice } = useOrderlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchData()
  }, [])

  if (loading) return <TabContentSkeleton />
  if (isEmpty) return <EmptyTab sub_title="구매하신 제품이 없습니다." title="💸 필요한 제품을 구매해보세요" type="link" label="쇼핑하러가기" />

  console.log(data)

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
            <div className="mb-4 border-b border-blue-500/40 pb-4">
              <strong className="mb-2 block text-lg text-blue-500">{item.status === 'pending' && '결제완료'}</strong>
              <span
                className={clsx('mb-2 inline-block w-fit rounded-md bg-blue-500 px-3 py-2 text-sm font-medium text-white drop-shadow-md', {
                  'bg-pink-500': setIsShippingCost(item.idx),
                })}
              >
                {setIsShippingCost(item.idx) ? '배송비 무료' : '배송비 3,000원'}
              </span>
              <p className="tracking-tighter text-gray-600">
                <span className="mr-2 inline-block font-bold">주문인덱스 :</span>
                <span>{item.idx}</span>
              </p>
            </div>
            <div>
              <p className="mb-2 tracking-tighter text-gray-600">
                <span className="mr-2 inline-block text-sm font-medium">주문일시 :</span>
                <span className="text-sm font-medium">{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss (ddd)')}</span>
              </p>
              <ul className="mb-2">
                {item.orderItems.map(({ product, quantity }, index) => (
                  <li key={index} className="flex flex-row gap-4">
                    <img src={product.imageUrl} alt={product.name} className="h-20 w-20 rounded-lg border border-gray-500/60 drop-shadow-md" />
                    <div>
                      <strong className="block font-semibold tracking-tighter text-gray-700">{product.name}</strong>
                      <p>
                        <span>개수</span>
                        <span>{`${quantity}개`}</span>
                      </p>
                      <p>
                        <span>{product.discount_rate * 100}%</span>
                        <span>{calculateDiscountedPrice(product.original_price, product.discount_rate)}</span>
                        <span>{product.original_price.toLocaleString('ko-KR')}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="font-medium">{`총 ${totalPrice(item.idx).toLocaleString('ko-KR')}원`}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* {isEmpty ? (
        <EmptyTab sub_title="구매하신 제품이 없습니다." title="💸 필요한 제품을 구매해보세요" type="link" label="쇼핑하러가기" />
      ) : (
        <div>
          <h5 className="sr-only">주문배송 탭</h5>
          <ul className="mb-10 flex flex-row gap-4">
            <li className="flex flex-col items-center">
              <strong>결제완료</strong>
              <span>{data.length}</span>
            </li>
            <li className="flex flex-col items-center">
              <strong>배송중</strong>
              <span>0</span>
            </li>
            <li className="flex flex-col items-center">
              <strong>배송완료</strong>
              <span>0</span>
            </li>
          </ul>

          <div>
            <strong className="mb-2 block text-xl">주문리스트</strong>
            <ul className="flex flex-col gap-10">
              {data.map((item: any, index: number) => (
                <li className="bg-gray-100 p-5" key={index}>
                  <span className="inline-block w-fit bg-green-300 p-2 text-sm">{item.status === 'pending' && '결제완료'}</span>
                  <span className="inline-block w-fit bg-blue-300 p-2 text-sm">
                    {item.payment === 'CREDIT_CARD' ? '신용카드' : '실시간 계좌이체'}
                  </span>

                  <p className="mt-3">주문번호: {item.idx}</p>
                  <p className="text-sm">결제일시: {dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
                  <ul className="mt-2">
                    {item.orderItems.map((orderItem: any, index: number) => (
                      <li key={index} className="mb-4 flex flex-row gap-3 bg-gray-300/50 p-4 last:mb-0">
                        <img src={orderItem.product.imageUrl} alt={orderItem.product.name} className="h-20 w-20" />
                        <div className="flex flex-col">
                          <strong className="mb-2 mr-2 inline-block">{orderItem.product.name}</strong>
                          <div className="mb-2 flex-col items-center gap-4">
                            <div className="flex flex-row items-center gap-2">
                              <span className="box-border border border-gray-300 bg-gray-50 p-2 text-xs">수량</span>
                              <span className="text-sm">{`${orderItem.quantity}개`}</span>
                            </div>
                            <p>
                              {orderItem.product.original_price}원 (-{orderItem.product.discount_rate * 100}%)
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="mb-2">
                    <strong>배송지</strong>
                    <button
                      onClick={() => {
                        setAddressIdx(item.address.idx)
                        setOrderIdx(item.idx)

                        showModal('changeAddress')
                      }}
                      className="rounded-md bg-pink-300 p-2 text-sm"
                    >
                      배송지변경
                    </button>
                    <p>{`${item.address.recipientName} (${item.address.addressName})`}</p>
                    <p>{item.address.phoneNumber}</p>
                    <p>{`(${item.address.postcode}) ${item.address.addressLine1} ${item.address.addressLine2}`}</p>
                    <p>{item.address.deliveryNote}</p>
                  </div>
                  <div>
                    <strong>결제정보</strong>
                    <div>
                      <p>주문금액</p>
                      <p>{`총 ${item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price * item.quantity, 0) >= 30000 ? item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price * item.quantity, 0) : item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price * item.quantity, 0) + 3000}원`}</p>
                    </div>
                    <div>
                      <div>
                        <p>상품금액</p>
                        <p>{item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price * item.quantity, 0)}원</p>
                      </div>
                      <div>
                        <p>배송비</p>
                        <p>{item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price * item.quantity, 0) >= 30000 ? 0 : 3000}원</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => removeOrderData(item.idx)} className="w-full bg-blue-300 p-4 hover:bg-blue-500">
                    주문취소
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )} */}
    </section>
  )
}
