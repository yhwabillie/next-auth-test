'use server'
import { PasswordResetRequestForm } from '@/lib/components/PasswordResetRequestForm'
import Link from 'next/link'

export default async function Page() {
  return (
    <section className="py-40">
      <h2 className="sr-only">비밀번호 재설정</h2>
      <h3 className="text-center text-3xl font-bold text-blue-400">🔐 비밀번호 재설정</h3>
      <p className="text-md pb-10 pt-3 text-center tracking-tighter text-gray-800">
        가입했을 때 입력했던 이메일로 <br /> 비밀번호 재설정 링크를 받아서 비밀번호를 갱신하세요.
      </p>
      <PasswordResetRequestForm />
    </section>
  )
}
