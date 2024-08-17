'use server'
import { SearchResult } from '@/lib/components/common/SearchResult'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <div>
      <Suspense>
        <SearchResult />
      </Suspense>
    </div>
  )
}
