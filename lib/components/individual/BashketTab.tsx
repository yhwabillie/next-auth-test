'use client'
import { fetchCartlist } from '@/app/actions/cartlist/actions'
import { useSession } from 'next-auth/react'
import { ChangeEvent, useEffect, useState } from 'react'
import { FaCheck, FaCheckSquare, FaSquare } from 'react-icons/fa'
import { toast } from 'sonner'

interface CheckedItem {
  [key: string]: boolean
}

export const BasketTab = () => {
  const { data: session, update, status } = useSession()
  const userIdx = session?.user?.idx
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [checkedItems, setCheckedItems] = useState<CheckedItem>({})

  const fetchData = async () => {
    try {
      const cartlist = await fetchCartlist(userIdx!)
      setData(cartlist)

      const initialCheckedState: any = {}
      cartlist.forEach(({ product }) => {
        initialCheckedState[product.idx] = true
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
    (sum, { product }) => sum + (product.original_price - product.original_price * product.discount_rate),
    0,
  )

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <div>
        <h5>상품 결제하기</h5>
        <div>
          <strong>장바구니</strong>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div>
              {data.map(({ product }, index) => (
                <div key={index}>
                  <label htmlFor={product.idx} className="mx-auto flex h-4 w-4 cursor-pointer items-center justify-center border border-gray-500/50">
                    <input
                      id={product.idx}
                      type="checkbox"
                      checked={checkedItems[product.idx] || false}
                      onChange={() => handleCheckboxChange(product.idx)}
                    />
                    {checkedItems[product.idx] && <FaCheck className="cursor-pointer text-blue-600" />}
                  </label>
                  <strong>{product.name}</strong>
                  <p>{product.original_price}</p>
                  <p>{product.discount_rate}</p>
                  <strong>{product.original_price - product.original_price * product.discount_rate}원</strong>
                  <img src={product.imageUrl} alt={product.name} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div>
          <strong>주문자 정보</strong>
          <ul>
            <li>이름: {session?.user?.name}</li>
            <li>휴대전화</li>
            <li>이메일: </li>
          </ul>
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
                <input type="radio" value={'신용카드'} defaultChecked name="payment" />
                <label>신용카드</label>
              </div>
              <div>
                <input type="radio" value={'실시간 계좌이체'} name="payment" />
                <label>실시간 계좌이체</label>
              </div>
            </fieldset>
          </div>
          <div className="checked-items bg-blue-300 p-3">
            <h2>구매금액</h2>
            {checkedItemDetails.map(({ product }) => (
              <li key={product.idx}>
                {product.name}: ${product.original_price - product.original_price * product.discount_rate}
              </li>
            ))}
            <p>{totalPrice >= 30000 ? '3만원 이상 무료배송' : '배송비 +3000원'}</p>
            <h3>최종결제: ${totalPrice >= 30000 ? totalPrice : totalPrice + 3000}</h3>
          </div>
          {/* <ul>
            <li>
              <span>제품명</span>
              <span>1200원</span>
            </li>
          </ul>
          <p>배송비 (30,000원 이상 무료)</p>
          <p>0 원</p>
          <div>
            <span>최종 결제 금액</span>
            <span>45000원</span>
          </div> */}
        </div>

        {/* <p>주문 내용을 모두 확인 하였으며, 결제에 동의합니다.</p>
        <button>5,000 원 결제하기</button> */}
      </div>
    </div>
  )
}
