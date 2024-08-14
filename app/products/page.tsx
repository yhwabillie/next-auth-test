'use server'
import authOptions from '@/lib/auth'
import { ProductList } from '@/lib/components/individual/ProductList'
import { getServerSession } from 'next-auth'

export default async function Page() {
  const session = await getServerSession(authOptions)

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
        <ProductList session={session!} />
      </main>
    </section>
  )
}
