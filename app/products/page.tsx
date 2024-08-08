'use server'
import { ProductList } from '@/lib/components/individual/ProductList'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        상품 리스트 본문
      </h2>
      <header>
        <h3>PRODUCTS</h3>
        <p>상품 리스트입니다. 로그인 후, 위시리스트와 장바구니에 제품을 담아보세요.</p>
      </header>
      <main>
        <ProductList />
      </main>
    </section>
  )
}
