'use server'
import { ProductUploadForm } from '@/lib/components/ProductUploadForm'
import { ProductList } from '@/lib/components/ProductList'

export default async function Page() {
  return (
    <>
      <h2 className="sr-only">상품 데이터 업로드 본문</h2>
      <section className="py-20">
        <h3 className="text-center text-3xl font-bold text-blue-400">🛍️ 상품 데이터 업로드</h3>
        <p className="text-md pb-10 pt-3 text-center tracking-tighter text-gray-800">
          엑셀 파일(.xlsx, .xls)을 선택하여 상품 데이터를 업데이트하세요.
        </p>
        <ProductUploadForm />
        <ProductList />
      </section>
    </>
  )
}
