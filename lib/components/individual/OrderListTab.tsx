'use client'
import { fetchOrderlist, removeOrder } from '@/app/actions/order/actions'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import dayjs from 'dayjs'

export const OrderListTab = () => {
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  const fetchOrderlistData = async () => {
    try {
      const orderlist = await fetchOrderlist()

      if (!orderlist) {
        toast.error('주문 데이터가 없습니다')
      }

      setData(orderlist)
    } catch (error) {
      toast.error('주문 데이터 fetch 실패')
    } finally {
      setLoading(false)
    }
  }

  const removeOrderData = async (orderIdx: string) => {
    try {
      const response = await removeOrder(orderIdx)

      if (!response.success) {
        toast.error('주문 취소에 실패했습니다.')
      }

      fetchOrderlistData()
      toast.success('주문 취소했습니다.')
    } catch (error) {
      toast.error('주문 취소에 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchOrderlistData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <div>
      <h5 className="sr-only">주문배송 탭</h5>
      <ul className="mb-10 flex flex-row gap-4">
        <li className="flex flex-col items-center">
          <strong>주문완료</strong>
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
              <span className="inline-block w-fit bg-green-300 p-2 text-sm">{item.status === 'pending' && '주문완료'}</span>
              <span className="inline-block w-fit bg-blue-300 p-2 text-sm">{item.payment === 'CREDIT_CARD' ? '신용카드' : '실시간 계좌이체'}</span>

              {/* <span className="inline-block w-fit bg-pink-300 p-2 text-sm">무료배송</span> */}
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
                <p>{`${item.address.recipientName} (${item.address.addressName})`}</p>
                <p>{item.address.phoneNumber}</p>
                <p>{`(${item.address.postcode}) ${item.address.addressLine1} ${item.address.addressLine2}`}</p>
                <p>{item.address.deliveryNote}</p>
              </div>
              <div>
                <strong>결제정보</strong>
                <div>
                  <p>주문금액</p>
                  <p>{`총 ${item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price, 0) >= 30000 ? item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price, 0) : item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price, 0) + 3000}원`}</p>
                </div>
                <div>
                  <div>
                    <p>상품금액</p>
                    <p>{item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price, 0)}원</p>
                  </div>
                  <div>
                    <p>배송비</p>
                    <p>{item.orderItems.reduce((sum: any, item: any) => sum + item.unit_price, 0) >= 30000 ? 0 : 3000}원</p>
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
  )
}
