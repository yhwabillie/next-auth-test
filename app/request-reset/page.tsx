'use server'

import { ConfirmEmailForm } from '@/lib/components/confirmEmailForm'

export default async function Page() {
  return (
    <div>
      <h1>비밀번호를 잊으셨나요?</h1>
      <p>가입했을때 작성했던 이메일로 링크를 받아 재설정하세요</p>

      <ConfirmEmailForm />
    </div>
  )
}
