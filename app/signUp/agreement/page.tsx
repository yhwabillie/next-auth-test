'use server'
import { AgreementForm } from '@/lib/components/AgreementForm'

export default async function Page() {
  return (
    <main>
      <h1>제3자 동의</h1>

      <AgreementForm />
    </main>
  )
}
