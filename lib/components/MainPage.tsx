'use client'
import { useRouter } from 'next/navigation'

export const MainPage = () => {
  const router = useRouter()
  return (
    <section>
      <h1>메인페이지</h1>
      <p>누구나 접근 가능한 화면</p>
      <button onClick={() => router.push('/signIn')}>로그인</button>
      <button onClick={() => router.push('/signUp')}>회원가입</button>
    </section>
  )
}
