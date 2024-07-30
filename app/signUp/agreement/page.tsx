'use server'
import { AgreementForm } from '@/lib/components/AgreementForm'

export default async function Page() {
  return (
    <section className="min-h-full px-5 py-10">
      <h2 className="mb-10 block text-3xl font-semibold text-blue-400">📌 이용약관 동의</h2>
      <AgreementForm />
    </section>
  )
}
