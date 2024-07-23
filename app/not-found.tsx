'use client'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()
  return (
    <main>
      <h1>Not Found</h1>
      <p>404</p>
      <button onClick={() => router.push('/')}>메인으로</button>
    </main>
  )
}
