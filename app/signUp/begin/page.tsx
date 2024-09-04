import { SignUpForm } from '@/lib/components/common/SignUpForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '회원정보입력',
}

export default async function Page() {
  return (
    <section aria-labelledby="page-heading" className="min-h-full py-10">
      <h2 id="page-heading" className="sr-only">
        회원가입 정보 등록 본문
      </h2>
      <header className="mb-10">
        <h3 className="mb-2 block text-center text-2xl font-semibold tracking-tighter text-gray-700">회원정보 입력</h3>
        <p className="text-center text-sm tracking-tighter text-gray-700 md:text-[16px] md:leading-6">회원가입을 위한 정보를 입력하세요.</p>
      </header>
      <SignUpForm />
    </section>
  )
}
