'use client'
import { fetchCartList, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { FaCheck, FaCheckSquare, FaSquare } from 'react-icons/fa'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { OrderSchema, OrderSchemaType } from '@/lib/zodSchema'
import { zodResolver } from '@hookform/resolvers/zod'

interface CheckedItem {
  [key: string]: boolean
}

export const CartListTab = () => {
  const { data: session, update, status } = useSession()
  const userIdx = session?.user?.idx
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkedItems, setCheckedItems] = useState<CheckedItem>({})
  const [selectedTab, setSelectedTab] = useState('tab1')

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(OrderSchema),
  })

  // const onSubmitForm = (data: any) => {
  //   try {
  //     //checkedItemDetails
  //     const order_items = checkedItemDetails.map((item) => ({
  //       productIdx: item.product.idx,
  //       price: item.product.original_price - item.product.original_price * item.product.discount_rate,
  //       quantity: item.quantity,
  //     }))

  //     const order = {
  //       userIdx: userIdx,
  //       addressIdx: '',
  //       totalAmount: totalPrice,
  //       orderItems: order_items,
  //     }

  //     console.log(order)
  //   } catch (error) {}
  // }

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

  const isShippingCost = totalPrice >= 30000 ? '배송비(3만원 이상 무료배송) 0원' : '배송비(+3,000원)'

  /**
   * 클릭한 상품을 쇼핑카트에 제거
   */
  const removeCartItem = async (productIdx: string) => {
    console.log(productIdx, '///')
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
    console.log(event)
    setSelectedTab(event.target.value)
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>

  return (
    <>
      <h4 className="mb-10 text-2xl font-bold">상품 결제하기</h4>
      <form>
        <fieldset className="mb-10 border-b border-gray-300">
          <h5 className="mb-2 border-b-2 border-blue-500 pb-2 text-lg font-semibold">장바구니</h5>
          <ul className="flex flex-col gap-5 px-2 py-4">
            {data.map((item, index) => (
              <li key={index} className="flex flex-row items-center gap-3">
                <label htmlFor={item.idx} className="flex h-5 w-5 items-center justify-center bg-gray-400/30">
                  <input id={item.idx} type="checkbox" checked={checkedItems[item.idx] || false} onChange={() => handleCheckboxChange(item.idx)} />
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
                      prevItems.map((cartItem) => (cartItem.idx === item.idx ? { ...cartItem, quantity: parseInt(e.target.value, 10) } : cartItem)),
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
              <ul className="flex flex-row items-center gap-5">
                <li>
                  <label>
                    <input type="radio" name="address" onChange={handleTabChange} value="tab1" checked={selectedTab === 'tab1'} />
                    <span>배송지 이름1</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" name="address" onChange={handleTabChange} value="tab2" checked={selectedTab === 'tab2'} />
                    <span>배송지 이름2</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" name="address" onChange={handleTabChange} value="tab3" checked={selectedTab === 'tab3'} />
                    <span>배송지 이름3</span>
                  </label>
                </li>
              </ul>
            </li>
          </ul>

          {selectedTab === 'tab1' && (
            <ul>
              <li>
                <span>받는이</span>
                <span>잉뉴화</span>
              </li>
              <li>
                <span>연락처</span>
                <span>000-0000-0000</span>
              </li>
              <li>
                <span>배송요청사항</span>
                <select>
                  <option>문앞에 부탁드립니다.</option>
                </select>
              </li>
            </ul>
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
                    <input type="radio" value="credit_card" name="payment" defaultChecked />
                    <span>신용카드</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="radio" value="bank_transfer" name="payment" />
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
                  <span className="text-2xl font-bold text-red-600">{`${(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toLocaleString('ko-KR')}원`}</span>
                </li>
              </ul>
            </li>
          </ul>
        </fieldset>

        <div className="text-md mb-4 bg-gray-200 py-5 text-center">주문 내용을 모두 확인하였으며, 결제에 동의합니다.</div>

        <button className="w-full bg-red-500 py-5 text-center text-lg font-bold text-white hover:bg-red-500/50">{`${(totalPrice >= 30000 ? totalPrice : totalPrice + 3000).toLocaleString('ko-KR')}원 결제하기`}</button>

        {/* <div>
        <h5>상품 결제하기</h5>
        <div>
          <strong>장바구니</strong>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {data.map((item, index) => (
                <div key={index}>
                  <label
                    htmlFor={item.product.idx}
                    className="mx-auto flex h-4 w-4 cursor-pointer items-center justify-center border border-gray-500/50"
                  >
                    <input
                      id={item.product.idx}
                      type="checkbox"
                      checked={checkedItems[item.product.idx] || false}
                      onChange={() => handleCheckboxChange(item.product.idx)}
                    />
                    {checkedItems[item.product.idx] && <FaCheck className="cursor-pointer text-blue-600" />}
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    min={1}
                    max={10}
                    value={item.quantity}
                    onChange={(e) => {
                      setData((prevItems) =>
                        prevItems.map((cartItem) =>
                          cartItem.product.idx === item.product.idx ? { ...cartItem, quantity: parseInt(e.target.value, 10) } : cartItem,
                        ),
                      )
                    }}
                  />
                  <strong>{item.product.name}</strong>
                  <p>{item.product.original_price}</p>
                  <p>{item.product.discount_rate}</p>
                  <strong>{item.product.original_price - item.product.original_price * item.product.discount_rate}원</strong>
                  <img src={item.product.imageUrl} alt={item.product.name} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <strong>주문자 정보</strong>
          <div>
            <strong>회원구분:</strong>
            <span>{session?.user?.user_type === 'indivisual' ? '일반회원' : '어드민'}</span>
          </div>
          <div>
            <strong>이름:</strong>
            <span>{session?.user?.name}</span>
          </div>
          <div>
            <strong>이메일: </strong>
            <span></span>
          </div>
          <div>
            <strong>휴대폰 번호: </strong>
            <input {...register('phoneNumber')} id="phoneNumber" type="text" placeholder="휴대폰 번호를 입력하세요" />
          </div>
        </div>
        <div>
          <strong>배송지 정보</strong>
          <p>배송지 선택</p>
          <p>수령자명</p>
          <p>연락처</p>
          <p>배송지</p>
          <p>배송 요청사항</p>
        </div>
        <div>
          <strong>결제 정보</strong>
          <div>
            <h2>결제수단</h2>
            <fieldset>
              <div>
                <input {...register('payment')} id="credit_card" type="radio" value={'신용카드'} defaultChecked name="payment" />
                <label>신용카드</label>
              </div>
              <div>
                <input {...register('payment')} id="bank_transfer" type="radio" value={'실시간 계좌이체'} name="payment" />
                <label>실시간 계좌이체</label>
              </div>
            </fieldset>
          </div>
          <div className="checked-items bg-blue-300 p-3">
            <h2>구매금액</h2>
            {checkedItemDetails.map((item) => (
              <li key={item.product.idx}>
                <strong>{item.product.name}</strong>
                <span>{item.quantity}개</span>
                <span>{(item.product.original_price - item.product.original_price * item.product.discount_rate) * item.quantity}</span>
              </li>
            ))}
            <p>{totalPrice >= 30000 ? '3만원 이상 무료배송' : '배송비 +3000원'}</p>
            <h3>최종결제: ${totalPrice >= 30000 ? totalPrice : totalPrice + 3000}</h3>
            <input {...register('totalAmount')} type="text" value={totalPrice >= 30000 ? totalPrice : totalPrice + 3000} />
          </div>
        </div>

        <p>주문 내용을 모두 확인 하였으며, 결제에 동의합니다.</p>
        <button>{totalPrice >= 30000 ? totalPrice : totalPrice + 3000} 원 결제하기</button>
      </div> */}
      </form>
    </>
  )
}
