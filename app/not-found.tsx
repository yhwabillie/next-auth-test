'use client'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <section aria-labelledby="page-heading">
      <h2 id="page-heading" className="sr-only">
        없는 페이지 입니다.
      </h2>
      <header>
        <h3>404</h3>
        <p>Not Found</p>
      </header>
      <main>
        <button onClick={() => router.push('/')}>메인으로</button>
      </main>
    </section>
  )
}
