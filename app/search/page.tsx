'use server'
import { SearchResult } from '@/lib/components/common/SearchResult'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <Suspense>
      <SearchResult />
    </Suspense>
  )
}
