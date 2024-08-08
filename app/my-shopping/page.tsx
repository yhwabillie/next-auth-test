'use server'
import { UserShoppingTabs } from '@/lib/components/individual/UserShoppingTabs'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        마이쇼핑 본문
      </h2>
      <header>
        <h3>MY SHOPPING</h3>
        <p>위시리스트, 장바구니, 주문/배송조회 리스트를 확인하세요</p>
      </header>
      <main>
        <UserShoppingTabs />
      </main>
    </section>
  )
}
