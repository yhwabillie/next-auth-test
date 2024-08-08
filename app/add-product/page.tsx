'use server'
import { ProductUploadForm } from '@/lib/components/ProductUploadForm'
import { ProductList } from '@/lib/components/admin/ProductList'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        관리자 상품 데이터 관리 본문
      </h2>
      <header>
        <h3 className="text-center text-3xl font-bold text-blue-400">🛍️ 상품 데이터 업로드</h3>
        <p className="text-md pb-10 pt-3 text-center tracking-tighter text-gray-800">
          엑셀 파일(.xlsx, .xls)을 선택하여 상품 데이터를 업데이트하세요.
        </p>
      </header>
      <main className="py-20">
        <ProductUploadForm />
        <ProductList />
      </main>
    </section>
  )
}
