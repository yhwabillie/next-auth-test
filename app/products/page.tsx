'use server'

import { ProductList } from '@/lib/components/individual/ProductList'

export default async function Page() {
  return (
    <section>
      <h2 className="sr-only">상품 리스트</h2>
      <div>상품 리스트</div>
      <ProductList />
    </section>
  )
}
