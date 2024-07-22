'use client'
import { Session } from 'next-auth'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const Header = ({ session }: { session: Session | null }) => {
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
          <button onClick={() => router.push('/signIn')}>로그인</button>
        )}
      </div>
    </header>
  )
}
