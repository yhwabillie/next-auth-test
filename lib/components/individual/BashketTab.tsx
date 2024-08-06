'use client'
import { fetchCartlist } from '@/app/actions/cartlist/actions'
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

export const BasketTab = () => {
  const { data: session, update, status } = useSession()
  const userIdx = session?.user?.idx
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkedItems, setCheckedItems] = useState<CheckedItem>({})

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderSchemaType>({
    mode: 'onChange',
    resolver: zodResolver(OrderSchema),
  })

  const fetchData = async () => {
    try {
      const cartlist = await fetchCartlist(userIdx!)
      setData(cartlist)

      const initialCheckedState: any = {}

      cartlist.forEach((item) => {
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

  const handleCheckboxChange = (idx: string) => {
    setCheckedItems((prevState: any) => ({
      ...prevState,
      [idx]: !prevState[idx],
    }))
  }

  // 체크된 상품들의 이름과 가격을 계산
  const checkedItemDetails = data.filter(({ product }) => checkedItems[product.idx])
  const totalPrice = checkedItemDetails.reduce(
    (sum, item) => sum + (item.product.original_price - item.product.original_price * item.product.discount_rate) * item.quantity,
    0,
  )

  const onSubmitForm = (data: any) => {
    try {
      //checkedItemDetails
      const order_items = checkedItemDetails.map((item) => ({
        productIdx: item.product.idx,
        price: item.product.original_price - item.product.original_price * item.product.discount_rate,
        quantity: item.quantity,
      }))

      const order = {
        userIdx: userIdx,
        addressIdx: '',
        totalAmount: totalPrice,
        orderItems: order_items,
      }

      console.log(order)
    } catch (error) {}
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div>
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
        {/* <div>
          <strong>배송지 정보</strong>
          <p>배송지 선택</p>
          <p>수령자명</p>
          <p>연락처</p>
          <p>배송지</p>
          <p>배송 요청사항</p>
        </div> */}
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
      </div>
    </form>
  )
}
