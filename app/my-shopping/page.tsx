'use server'
import authOptions from '@/lib/auth'
import { SectionHeader } from '@/lib/components/individual/SectionHeader'
import { UserShoppingTabs } from '@/lib/components/individual/UserShoppingTabs'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page() {
  const session = await getServerSession(authOptions)

  // 세션이 없거나 세션에 user.idx가 없는 경우 로그인 페이지로 리다이렉트
  if (!session?.user?.idx) redirect('/signIn')

  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        마이쇼핑 본문
      </h2>
      <SectionHeader title="🛍️ MY SHOPPING" desc="위시리스트, 장바구니, 주문/배송조회 리스트를 확인하세요" />
      <main className="mt-5 overflow-hidden rounded-lg border-b bg-white p-10 drop-shadow-sm">
        <UserShoppingTabs session={session} />
      </main>
    </section>
  )
}
