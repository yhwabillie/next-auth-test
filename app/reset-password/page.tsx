'use server'
import { ResetPasswordForm } from '@/lib/components/ResetPasswordForm'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <div>
      <h1>비밀번호 재설정 페이지입니다.</h1>
      <p>이 화면은 15분 내에 연결이 끊어집니다. 그 안에 비밀번호를 변경하세요</p>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  )
}
