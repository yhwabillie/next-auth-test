'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const MainPage = () => {
  const router = useRouter()
  const { data: session } = useSession()

  return (
    <section>
      {session && session.user ? (
        <div>
          <h1>메인페이지 (로그인 후)</h1>
          <p>권한이 있는 화면</p>
          <button onClick={() => signOut()}>로그아웃</button>
        </div>
      ) : (
        <div>
          <h1>메인페이지 (로그인 전)</h1>
          <p>누구나 접근 가능한 화면</p>
          <button onClick={() => router.push('/signIn')}>로그인</button>
          <button onClick={() => router.push('/signUp')}>회원가입</button>
        </div>
      )}
    </section>
  )
}
