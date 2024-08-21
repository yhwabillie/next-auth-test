'use server'
import { ProductUploadForm } from '@/lib/components/admin/ProductUploadForm'
import { ProductList } from '@/lib/components/admin/ProductList'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading" className="container mx-auto mt-20">
      <h2 id="page-heading" className="sr-only">
        관리자 상품 데이터 관리 본문
      </h2>
      <header className="mx-auto w-fit">
        <h3 className="text-center text-3xl font-bold text-blue-400">🛍️ 상품 데이터 업로드</h3>
        <p className="text-md pt-3 text-center tracking-tighter text-gray-800">엑셀 파일(.xlsx, .xls)을 선택하여 상품 데이터를 업데이트하세요.</p>
      </header>
      <main className="mb-20 mt-10">
        <ProductUploadForm />
        <ProductList />
      </main>
    </section>
  )
}
