'use client'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
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
            {/* <Image src={session.user.profile_img ? session.user.profile_img : '/images/default_profile.jpeg'} alt="" width={50} height={50} /> */}

            {session.user.profile_img === 'undefined' ? (
              <Image src={'/images/default_profile.jpeg'} alt="user profile" width={50} height={50} />
            ) : (
              <Image src={session.user.profile_img!} alt="user profile" width={50} height={50} />
            )}

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
