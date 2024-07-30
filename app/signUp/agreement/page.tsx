'use server'
import { AgreementForm } from '@/lib/components/AgreementForm'

export default async function Page() {
  return (
    <section className="min-h-full px-5 py-10">
      <h2 className="mb-10 block text-center text-2xl font-semibold text-gray-700">📌 이용약관 동의</h2>
      <AgreementForm />
    </section>
  )
}
