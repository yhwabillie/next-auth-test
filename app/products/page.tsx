'use server'

import { ProductList } from '@/lib/components/individual/ProductList'

export default async function Page() {
  return (
    <section>
      <h2 className="sr-only">상품 리스트</h2>
      <div>상품 비주얼 배너 Swiper</div>
      <div>
        <h4>플로팅 메뉴</h4>
        <div>
          <button>장바구니</button>
          <button>위시</button>
        </div>
      </div>
      <ProductList />
    </section>
  )
}
