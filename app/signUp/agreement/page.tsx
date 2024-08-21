'use server'
import { AgreementForm } from '@/lib/components/common/AgreementForm'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading" className="min-h-full px-5 py-10">
      <h2 id="page-heading" className="sr-only">
        회원가입 이용약관 동의 본문
      </h2>
      <header className="mb-10">
        <h3 className="mb-4 block text-center text-2xl font-semibold text-gray-700">📌 이용약관 동의</h3>
        <p className="text-center">선택 동의 사항은 회원가입 후, 회원정보 관리에서 동의 여부를 수정할 수 있습니다.</p>
      </header>
      <main>
        <AgreementForm />
      </main>
    </section>
  )
}
