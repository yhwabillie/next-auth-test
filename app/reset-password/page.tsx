'use server'

import ResetPasswordPage from '@/lib/components/ResetPassword'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordPage />
      </Suspense>
    </div>
  )
}
