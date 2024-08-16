'use server'
import { SignUpForm } from '@/lib/components/common/SignUpForm'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading" className="min-h-full px-5 py-10">
      <h2 id="page-heading" className="sr-only">
        회원가입 정보 등록 본문
      </h2>
      <header>
        <h3 className="mb-10 block text-center text-2xl font-semibold text-gray-700">📌 회원정보 입력</h3>
        <p className="text-center">회원가입을 위한 정보를 입력하세요.</p>
      </header>
      <SignUpForm />
    </section>
  )
}
