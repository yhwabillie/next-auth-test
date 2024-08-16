'use server'
import { ResetPasswordForm } from '@/lib/components/common/ResetPasswordForm'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading" className="py-40">
      <h2 id="page-heading" className="sr-only">
        회원 비밀번호 재설정 본문
      </h2>
      <header>
        <h3 className="text-center text-3xl font-bold text-blue-400">🔐 비밀번호 재설정</h3>
        <p className="text-md pb-10 pt-3 text-center tracking-tighter text-gray-800">
          이 화면은 15분 내에 연결이 끊어집니다. <br /> 제한 시간 내에 비밀번호를 변경하세요
        </p>
      </header>
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </main>
    </section>
  )
}
