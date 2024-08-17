'use server'
import authOptions from '@/lib/auth'
import { DesktopBanner } from '@/lib/components/common/DesktopBanner'
import { ProductList } from '@/lib/components/common/ProductList'
import { getServerSession, Session } from 'next-auth'

export default async function Page() {
  const session: Session | null = await getServerSession(authOptions)

  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        상품 리스트 본문
      </h2>
      {/* <header className="mx-auto w-[1200px] border border-red-600 px-5">
        <h3>PRODUCTS</h3>
        <p>상품 리스트입니다. 로그인 후, 위시리스트와 장바구니에 제품을 담아보세요.</p>
      </header> */}

      <DesktopBanner />

      <div className="mx-auto w-[1200px] px-5">
        {/* session이 null일 수 있으므로 기본값을 제공 */}
        <ProductList session={session ?? null} />
      </div>
    </section>
  )
}
