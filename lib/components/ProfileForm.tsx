'use client'
import { useRouter } from 'next/navigation'

export const ProfileForm = () => {
  const router = useRouter()
  return (
    <>
      <h1>프로필 페이지</h1>
      <p>권한있는 사용자만 접근할 수 있습니다.</p>
      <button onClick={() => router.push('/')}>메인으로</button>
    </>
  )
}
