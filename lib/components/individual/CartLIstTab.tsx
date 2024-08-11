'use client'
import { fetchCartList, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FaCheck } from 'react-icons/fa'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { OrderSchema, OrderSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchAddressList } from '@/app/actions/address/actions'
import { addNewOrder } from '@/app/actions/order/actions'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyTab } from './EmptyTab'

interface CheckedItem {
  [key: string]: boolean
}

export const CartListTab = () => {
  const { data: session, update } = useSession()
  const userIdx = session?.user?.idx
  const [data, setData] = useState<any[]>([])
  const [address, setAddress] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkedItems, setCheckedItems] = useState<CheckedItem>({})
  const [selectedTab, setSelectedTab] = useState<any>()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(OrderSchema),
  })

  const fetchData = async () => {
    try {
      const fetchedCartList = await fetchCartList(userIdx!)

      //product 키 제거, 새로운 객체로 변환
      const transformedArray = fetchedCartList.map((item) => ({
        ...item.product,
        quantity: item.quantity,
      }))

      //state 저장
      setData(transformedArray)

      //로드시 모든 checkbox true
      const initialCheckedState: any = {}

      fetchedCartList.forEach((item) => {
        initialCheckedState[item.product.idx] = true
      })

      setCheckedItems(initialCheckedState)
    } catch (error) {
      console.error('Failed to fetch products:', error)
      toast.error('product 데이터 fetch에 실패했습니다, 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const transferToPercent = (discount_rate: number) => {
    if (discount_rate > 0) {
      return `(${discount_rate * 100}% 할인)`
    } else {
      return ''
    }
  }

  const calculatePrice = (original_price: number, discount_rate: number) => {
    return `${(original_price - original_price * discount_rate).toLocaleString('ko-KR')}원`
  }

  const handleCheckboxChange = (idx: string) => {
    setCheckedItems((prevState: any) => ({
      ...prevState,
      [idx]: !prevState[idx],
    }))
  }

  // 체크된 상품들의 이름과 가격을 계산
  const checkedItemDetails = data.filter((item) => checkedItems[item.idx])
  const totalQuantity = checkedItemDetails.reduce((sum, item) => sum + item.quantity, 0)

  const totalPrice = checkedItemDetails.reduce(
    (sum, item) => sum + (item.original_price - item.original_price * item.discount_rate) * item.quantity,
    0,
  )

  const finalPrice = totalPrice >= 30000 ? totalPrice : totalPrice + 3000

  const isShippingCost = totalPrice >= 30000 ? '배송비(3만원 이상 무료배송) 0원' : '배송비(+3,000원)'

  /**
   * 클릭한 상품을 쇼핑카트에 제거
   */
  const removeCartItem = async (productIdx: string) => {
    try {
      const response = await removeFromCartlist(userIdx!, productIdx)
      update({ cartlist_length: response })
      setData((prev: any) => prev.filter((idx: any) => idx !== productIdx))

      fetchData()
    } catch (error) {}
  }

  /**
   * 배송지 radio 버튼 tab
   */
  const handleTabChange = (event: any) => {
    setSelectedTab(event.target.value)
  }

  /**
   * 세션 사용자의 배송지 데이터 fetch
   */
  const fetchAddressData = async () => {
    try {
      const response = await fetchAddressList(userIdx!)

      if (!response) toast.error('배송지 데이터 fetch 실패')
      setAddress(response)
      setSelectedTab(response[0].idx)
    } catch (error) {}
  }

  /**
   * 최종 주문 데이터 submit
   */

  const handleSubmitOrder = async (data: any) => {
    const orderItems = checkedItemDetails.map((item: any) => {
      return {
        productIdx: item.idx,
        quantity: item.quantity,
        unit_price: item.original_price - item.original_price * item.discount_rate,
      }
    })

    const newOrder = {
      addressIdx: data.addressIdx,
      payment: data.payment,
      total_amount: finalPrice,
      orderItems: orderItems,
    }

    //상품을 선택하지 않았을 경우
    if (!(checkedItemDetails.length > 0)) {
      toast.error('결제할 상품을 선택하세요')
      return
    }

    try {
      const response = await addNewOrder(newOrder)

      if (!response.success) {
        toast.error('주문 전송 실패')
        return
      }

      toast.success('주문 데이터가 정상적으로 전송되었습니다')
    } catch (error: any) {
      console.error('Order creation failed:', error)
      toast.error('주문 생성 중 오류가 발생했습니다. 다시 시도해 주세요.')
    }
  }

  const isEmpty = data.length === 0

  useEffect(() => {
    fetchData()
    fetchAddressData()
  }, [])

  if (loading) return <TabContentSkeleton />

  return (
    <>
      {isEmpty ? (
        <EmptyTab sub_title="장바구니가 비었습니다" title="🛒 제품을 추가해주세요." type="link" label="장바구니 채우러가기" />
      ) : (
        <>
          <h4 className="mb-10 text-2xl font-bold">상품 결제하기</h4>
          <form onSubmit={handleSubmit(handleSubmitOrder)}>
            <fieldset className="mb-10 border-b border-gray-300">
              <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">장바구니</h5>
              <ul className="flex flex-col gap-5 px-2 py-4">
                {data.map((item, index) => (
                  <li key={index} className="flex flex-row items-center gap-3">
                    <label htmlFor={item.idx} className="flex h-5 w-5 items-center justify-center bg-gray-400/30">
                      <input
                        id={item.idx}
                        type="checkbox"
                        checked={checkedItems[item.idx] || false}
                        onChange={() => handleCheckboxChange(item.idx)}
                      />
                      {checkedItems[item.idx] && <FaCheck className="cursor-pointer text-blue-600" />}
                    </label>
                    <img className="h-10 w-10" src={item.imageUrl} alt={item.name} />
                    <strong>{item.name}</strong>
                    <div>
                      <p className="text-sm font-semibold text-red-500">{transferToPercent(item.discount_rate)}</p>
                      {item.discount_rate !== 0 && <p className="text-xs line-through">{`${item.original_price.toLocaleString('KR')}원`}</p>}
                      <strong className="text-lg">{calculatePrice(item.original_price, item.discount_rate)}</strong>
                    </div>

                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={item.quantity}
                      onChange={(e) => {
                        setData((prevItems) =>
                          prevItems.map((cartItem) =>
                            cartItem.idx === item.idx ? { ...cartItem, quantity: parseInt(e.target.value, 10) } : cartItem,
                          ),
                        )
                      }}
                    />

                    <button type="button" onClick={() => removeCartItem(item.idx)} className="bg-gray-300 p-2">
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </fieldset>

            <fieldset className="mb-10 border-b border-gray-300">
              <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">주문자 정보</h5>
              <ul className="flex flex-col gap-2 pb-2">
                <li>
                  <span className="inline-block w-[200px]">회원구분</span>
                  <span>{session?.user?.user_type === 'indivisual' ? '일반회원' : '어드민'}</span>
                </li>
                <li>
                  <span className="inline-block w-[200px]">이름</span>
                  <span>{session?.user?.name}</span>
                </li>
                <li>
                  <span className="inline-block w-[200px]">이메일</span>
                  <span>{session?.user?.email}</span>
                </li>
              </ul>
            </fieldset>

            <fieldset className="mb-10 border-b border-gray-300">
              <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">배송지 정보</h5>
              <ul className="flex flex-col gap-2 pb-2">
                <li className="flex flex-row gap-4">
                  <span>배송지 선택</span>

                  {address.map((item, index) => (
                    <input
                      key={index}
                      {...register('addressIdx')}
                      value={item.idx}
                      type="radio"
                      onChange={handleTabChange}
                      defaultChecked={index === 0}
                    />
                  ))}
                </li>
              </ul>

              {address.map(
                (item, index) =>
                  selectedTab === item.idx && (
                    <ul key={index}>
                      <li>
                        <span>받는이</span>
                        <span>{item.recipientName}</span>
                      </li>
                      <li>
                        <span>연락처</span>
                        <input {...register('phoneNumber')} type="text" value={item.phoneNumber} />
                      </li>
                      <li>
                        <span>배송지</span>
                        <span>{`(${item.postcode}) ${item.addressLine1} ${item.addressLine2}`}</span>
                      </li>
                      <li>
                        <span>배송 요청사항</span>
                        <span>{item.deliveryNote}</span>
                      </li>
                    </ul>
                  ),
              )}
            </fieldset>

            <fieldset className="mb-5 border-b border-gray-300">
              <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">결제 정보</h5>
              <ul className="flex flex-col gap-5">
                <li className="flex flex-row items-center gap-10 bg-gray-200">
                  <span>결제수단</span>
                  <ul className="flex flex-row items-center gap-5">
                    <li>
                      <label>
                        <input {...register('payment')} type="radio" value="CREDIT_CARD" name="payment" defaultChecked />
                        <span>신용카드</span>
                      </label>
                    </li>
                    <li>
                      <label>
                        <input {...register('payment')} type="radio" value="BANK_TRANSFER" name="payment" />
                        <span>실시간 계좌이체</span>
                      </label>
                    </li>
                  </ul>
                </li>
                <li className="flex flex-row items-center gap-10">
                  <span>구매금액</span>
                  <ul>
                    <li className="mb-2">
                      <span>주문상품 : </span>
                      <span>{`${totalQuantity}개`}</span>
                    </li>
                    {checkedItemDetails.map((item) => (
                      <li key={item.idx} className="mb-2 flex items-center justify-between gap-x-5 text-gray-600/50">
                        <p className="flex gap-4">
                          <strong>{item.name}</strong>
                          <span>{item.quantity}개</span>
                        </p>
                        <span>{`${((item.original_price - item.original_price * item.discount_rate) * item.quantity).toLocaleString('ko-KR')}원`}</span>
                      </li>
                    ))}

                    <li className="mt-4 text-sm">{isShippingCost}</li>

                    <li className="mt-4 flex flex-row items-center justify-between border-t border-blue-600 py-4">
                      <span className="text-md text-red-600">최종 결제금액</span>

                      <input id="total_amount" type="number" value={totalPrice >= 30000 ? totalPrice : totalPrice + 3000} readOnly />

                      <span className="text-2xl font-bold text-red-600">{`${(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toLocaleString('ko-KR')}원`}</span>
                    </li>
                  </ul>
                </li>
              </ul>
            </fieldset>

            <div className="text-md mb-4 bg-gray-200 py-5 text-center">주문 내용을 모두 확인하였으며, 결제에 동의합니다.</div>

            <button className="w-full bg-red-500 py-5 text-center text-lg font-bold text-white hover:bg-red-500/50">{`${(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toLocaleString('ko-KR')}원 결제하기`}</button>
          </form>
        </>
      )}
    </>
  )
}
