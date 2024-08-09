'use server'
import { SectionHeader } from '@/lib/components/individual/SectionHeader'
import { UserShoppingTabs } from '@/lib/components/individual/UserShoppingTabs'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        마이쇼핑 본문
      </h2>
      <SectionHeader title="🛍️ MY SHOPPING" desc="위시리스트, 장바구니, 주문/배송조회 리스트를 확인하세요" />
      <main className="mt-5 overflow-hidden rounded-lg border-b bg-white p-10 drop-shadow-sm">
        <UserShoppingTabs />
      </main>
    </section>
  )
}
