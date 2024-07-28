'use client'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default async function Page() {
  // useSearchParams 훅을 사용하여 쿼리 파라미터에서 토큰을 가져옵니다.
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') // 쿼리 파라미터에서 토큰을 가져옵니다.

  useEffect(() => {
    if (!token) {
      console.log('No token provided')
    }
  }, [token])

  return (
    <div>
      <h1>Reset PW</h1>
    </div>
  )
}
