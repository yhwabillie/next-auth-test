'use server'
import { ProductUploadForm } from '@/lib/components/ProductUploadForm'
import { fetchAllProducts } from '../actions/upload-product/actions'
import { ProductList } from '@/lib/components/ProductList'

export default async function Page() {
  const products = await fetchAllProducts()

  console.log('Response===>', products)

  return (
    <section className="py-20">
      <h2 className="sr-only">상품 데이터 업로드</h2>
      <h3 className="text-center text-3xl font-bold text-blue-400">🛍️ 상품 데이터 업로드</h3>
      <p className="text-md pb-10 pt-3 text-center tracking-tighter text-gray-800">엑셀 파일을 업로드하여 상품 데이터를 추가하세요.</p>
      <ProductUploadForm />
      <ProductList data={products} />
    </section>
  )
}
