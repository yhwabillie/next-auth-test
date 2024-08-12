'use client'
import { fetchCartList, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { FaCheck, FaMinus, FaPlus, FaRegMinusSquare, FaRegPlusSquare } from 'react-icons/fa'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { OrderSchema, OrderSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchAddressList } from '@/app/actions/address/actions'
import { addNewOrder } from '@/app/actions/order/actions'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyTab } from './EmptyTab'
import { tabMenuActiveStore } from '@/lib/zustandStore'
import { FaTrashCan } from 'react-icons/fa6'
import { IoMdClose } from 'react-icons/io'
import clsx from 'clsx'
import { useAddressStore } from '@/lib/stores/addressStore'

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
  const { showModal } = useAddressStore()
  const { setActiveTab } = tabMenuActiveStore()

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

  const isEmptyAddress = address.length === 0

  return (
    <>
      {isEmpty ? (
        <EmptyTab sub_title="장바구니가 비었습니다" title="🛒 제품을 추가해주세요." type="link" label="장바구니 채우러가기" />
      ) : (
        <>
          <form onSubmit={handleSubmit(handleSubmitOrder)}>
            <h5 className="mb-5 block rounded-lg bg-blue-50 px-4 py-3 text-xl font-semibold text-black">💸 상품 결제하기</h5>
            <fieldset className="mx-4 mb-16">
              <h5 className="mb-2 block text-lg font-semibold">장바구니</h5>
              <ul className="flex flex-col gap-5">
                {data.map((item, index) => (
                  <li
                    key={index}
                    className={clsx('flex flex-row justify-between rounded-lg border p-3 last:mb-0', {
                      'border-blue-300 bg-blue-100': checkedItems[item.idx],
                      'border-gray-300 bg-gray-100': !checkedItems[item.idx],
                    })}
                  >
                    <div className="flex flex-row">
                      <label htmlFor={item.idx} className="mr-3 flex h-8 w-8 items-center justify-center rounded-md bg-gray-400/20 drop-shadow-md">
                        <input
                          id={item.idx}
                          type="checkbox"
                          checked={checkedItems[item.idx] || false}
                          onChange={() => handleCheckboxChange(item.idx)}
                        />
                        {checkedItems[item.idx] && <FaCheck className="cursor-pointer text-lg text-blue-600" />}
                      </label>
                      <img src={item.imageUrl} alt={item.name} className="mr-5 block h-28 w-28 rounded-lg border border-gray-400/30 drop-shadow-lg" />
                      <div className="flex flex-col justify-center">
                        <p className="mb-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-sm text-white drop-shadow-md">{item.category}</p>
                        <strong className="text-md block font-medium text-gray-600">{item.name}</strong>

                        {item.discount_rate === 0 ? (
                          <p className="text-lg font-bold text-gray-800">{item.original_price.toLocaleString('ko-KR')}원</p>
                        ) : (
                          <div className="justify-content flex flex-row items-center gap-2">
                            <p className="text-lg font-bold text-red-600">{item.discount_rate * 100}%</p>
                            <p className="text-md text-gray-400 line-through">{item.original_price.toLocaleString('ko-KR')}원</p>
                            <p className="text-lg font-bold text-gray-800">
                              {(item.original_price - item.original_price * item.discount_rate).toLocaleString('ko-KR')}원
                            </p>
                          </div>
                        )}

                        <div className="mt-2 flex w-fit flex-row items-center border border-gray-400/50">
                          <div
                            onClick={() => {
                              setData((prevItems) =>
                                prevItems.map((cartItem) =>
                                  cartItem.idx === item.idx && item.quantity > 1 ? { ...cartItem, quantity: item.quantity - 1 } : cartItem,
                                ),
                              )
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200"
                          >
                            <FaMinus className="text-xs" />
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
                            className="h-8 w-8 text-center text-xs font-semibold"
                          />
                          <div
                            onClick={() => {
                              setData((prevItems) =>
                                prevItems.map((cartItem) =>
                                  cartItem.idx === item.idx && item.quantity < 10 ? { ...cartItem, quantity: item.quantity + 1 } : cartItem,
                                ),
                              )
                            }}
                            className="flex h-8 w-8 cursor-pointer items-center justify-center bg-gray-200"
                          >
                            <FaPlus className="text-xs" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="justify-top flex flex-col gap-2">
                      <button
                        onClick={() => removeCartItem(item.idx)}
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

              {isEmptyAddress ? (
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
                      {address.map((item, index) => (
                        <label
                          key={index}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-blue-200 bg-blue-100 py-2 pl-3 pr-4 text-sm drop-shadow-sm"
                        >
                          <input {...register('addressIdx')} type="radio" value={item.idx} onChange={handleTabChange} defaultChecked={index === 0} />
                          <span className="font-medium">{item.addressName}</span>
                        </label>
                      ))}
                    </li>
                  </ul>

                  {address.map(
                    (item, index) =>
                      selectedTab === item.idx && (
                        <dl key={index} className="flex flex-col gap-3 border-l-4 border-gray-200 pl-4">
                          <div className="flex items-center gap-2">
                            <dt className="w-[200px] font-medium">받는이</dt>
                            <dd className="text-gray-700">{item.recipientName}</dd>
                          </div>
                          <div className="flex items-center gap-2">
                            <dt className="w-[200px] font-medium">연락처</dt>
                            <input {...register('phoneNumber')} className="text-gray-700" type="number" value={item.phoneNumber} />
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
                    {checkedItemDetails.map((item) => (
                      <li key={item.idx} className="mb-2 flex items-center justify-between gap-x-5 px-2 text-gray-600/50">
                        <p className="flex items-center gap-4">
                          <span className="block w-[300px] font-medium">{item.name}</span>
                          <span className="font-medium">{item.quantity}개</span>
                        </p>
                        <span>{`${((item.original_price - item.original_price * item.discount_rate) * item.quantity).toLocaleString('ko-KR')}원`}</span>
                      </li>
                    ))}

                    <li className="mt-4 px-2 text-gray-600/50">{isShippingCost}</li>

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
              disabled={totalQuantity === 0}
              className="w-full rounded-lg bg-red-500 py-5 text-center text-lg font-bold text-white drop-shadow-md hover:bg-red-600 disabled:bg-gray-400"
            >{`${(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toLocaleString('ko-KR')}원 결제하기`}</button>
          </form>
        </>
      )}
    </>
  )
}
