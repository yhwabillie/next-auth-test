'use server'
import { SignInForm } from '@/lib/components/SignInForm'
import Link from 'next/link'

export default async function Page() {
  return (
    <section aria-labelledby="page-heading" className="py-40">
      <h2 id="page-heading" className="sr-only">
        로그인 본문
      </h2>
      <header>
        <h3 className="text-center text-3xl font-bold text-blue-400">🔐 로그인</h3>
        <p className="text-md pb-10 pt-3 text-center tracking-tighter text-gray-800">
          권한이 필요없는 화면입니다. <br /> 누구나 이 화면에 접근할 수 있습니다.
        </p>
      </header>
      <main>
        <SignInForm />
        <ul className="mx-auto mt-10 flex w-fit justify-center gap-5 font-medium text-gray-400">
          <li className="after:content:'' relative cursor-pointer font-normal after:absolute after:right-[-10px] after:top-[6px] after:h-3 after:w-[1px] after:bg-gray-400 hover:text-blue-400">
            <Link href="/request-reset">비밀번호 재발급</Link>
          </li>
          <li className="cursor-pointer font-normal hover:text-blue-400">
            <Link href="/signUp/agreement">회원가입</Link>
          </li>
        </ul>
      </main>
    </section>
  )
}
