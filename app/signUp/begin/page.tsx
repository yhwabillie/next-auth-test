'use server'
import { SignUpForm } from '@/lib/components/SignUpForm'

export default async function Page() {
  return (
    <section className="min-h-full px-5 py-10">
      <h2 className="mb-10 block text-center text-2xl font-semibold text-gray-700">📌 회원정보 입력</h2>
      <SignUpForm />
    </section>
  )
}
