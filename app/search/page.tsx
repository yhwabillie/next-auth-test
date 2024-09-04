import { SearchResult } from '@/lib/components/common/SearchResult'
import { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: '검색',
}

export default async function Page() {
  return (
    <Suspense>
      <SearchResult />
    </Suspense>
  )
}
