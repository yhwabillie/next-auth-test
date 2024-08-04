'use server'
import { MainPage } from '@/lib/components/MainPage'

export default async function Home() {
  return (
    <section>
      <h2 className="sr-only">메인 페이지 - 제품 검색</h2>
      <MainPage />
    </section>
  )
}
