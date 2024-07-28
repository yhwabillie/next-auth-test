'use server'

import { ResetPassword } from '@/lib/components/ResetPassword'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <ResetPassword />
    </Suspense>
  )
}
