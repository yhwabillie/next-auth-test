'use client'

export const BasketTab = () => {
  return (
    <div>
      <div>
        <h5>상품 결제하기</h5>
        <div>
          <strong>장바구니</strong>
          <ul>
            <li>상품1</li>
            <li>상품2</li>
            <li>상품3</li>
          </ul>
        </div>
        <div>
          <strong>주문자 정보</strong>
          <ul>
            <li>이름</li>
            <li>휴대전화</li>
            <li>이메일</li>
          </ul>
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
          <p>결제수단</p>
          <p>구매금액</p>
          <ul>
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
          </div>
        </div>

        <p>주문 내용을 모두 확인 하였으며, 결제에 동의합니다.</p>
        <button>5,000 원 결제하기</button>
      </div>
    </div>
  )
}
