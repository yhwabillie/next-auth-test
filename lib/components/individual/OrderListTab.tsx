'use client'

export const OrderListTab = () => {
  return (
    <div>
      <div>
        <h5>주문배송 탭</h5>
      </div>
      <ul>
        <li>
          <strong>주문접수</strong>
          <span>0</span>
        </li>
        <li>
          <strong>배송중</strong>
          <span>0</span>
        </li>
        <li>
          <strong>배송완료</strong>
          <span>0</span>
        </li>
      </ul>
      <div>
        <strong>주문리스트</strong>
        <ul>
          <li>
            <span>주문번호</span>
            <span>총 결제금액: 0</span>
            <button>주문 취소</button>
          </li>
        </ul>
      </div>
    </div>
  )
}
