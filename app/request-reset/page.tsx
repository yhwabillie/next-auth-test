import { PasswordResetRequestForm } from '@/lib/components/common/PasswordResetRequestForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '비밀번호 재설정 요청',
}

export default async function Page() {
  return (
    <section aria-labelledby="page-heading" className="py-40">
      <h2 id="page-heading" className="sr-only">
        회원 비밀번호 재설정 본문
      </h2>
      <header>
        <h3 className="text-center text-2xl font-bold text-blue-400 md:text-3xl">🔐 비밀번호 재설정</h3>
        <p className="pb-10 pt-3 text-center text-sm tracking-tighter text-gray-800 md:text-[16px] md:leading-6">
          가입했을 때 입력했던 이메일로 <br /> 비밀번호 재설정 링크를 받아서 비밀번호를 갱신하세요.
        </p>
      </header>
      <main>
        <PasswordResetRequestForm />
      </main>
    </section>
  )
}
