'use client'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const Header = () => {
  const router = useRouter()
  const { data: session, status } = useSession()

  return (
    <header>
      <div>
        <button onClick={() => router.push('/')}>홈</button>
        {session && session.user ? (
          <>
            <span>{`${session.user.name}님 안녕하세요!`}</span>
            <button onClick={() => signOut({ callbackUrl: '/signIn' })}>로그아웃</button>
            <button onClick={() => router.push('/profile')}>프로필</button>
          </>
        ) : (
          <>
            <button onClick={() => router.push('/signUp/agreement')}>회원가입</button>
            <button onClick={() => router.push('/signIn')}>로그인</button>
          </>
        )}
      </div>
    </header>
  )
}
