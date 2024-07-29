'use server'
import { SignInForm } from '@/lib/components/SignInForm'

export default async function Page() {
  return (
    <section>
      <h2>로그인 본문</h2>
      <p>권한이 필요없는 화면입니다. 누구나 이 화면에 접근할 수 있습니다.</p>
      <SignInForm />
    </section>
  )
}
