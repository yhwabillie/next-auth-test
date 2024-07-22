'use client'
import { Session } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  session: Session | null
}

export const Header = ({ session }: HeaderProps) => {
  const router = useRouter()

  return (
    <header>
      <div>
        {session && session.user ? (
          <>
            <button onClick={() => signOut()}>로그아웃</button>
            <button onClick={() => router.push('/profile')}>프로필</button>
          </>
        ) : (
          <>
            <button onClick={() => router.push('/signUp')}>회원가입</button>
            <button onClick={() => router.push('/signIn')}>로그인</button>
          </>
        )}
      </div>
    </header>
  )
}
