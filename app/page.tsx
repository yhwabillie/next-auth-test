'use server'
import authOptions from '@/lib/auth'
import { DesktopBanner } from '@/lib/components/common/DesktopBanner'
import { ProductList } from '@/lib/components/common/ProductList'
import { getServerSession, Session } from 'next-auth'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        상품 리스트 본문
      </h2>

      <DesktopBanner />

      {/* <div className="mx-auto w-[1200px] px-5">
        <ProductList />
      </div> */}
    </section>
  )
}
