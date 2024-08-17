'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProductsStore } from '@/lib/stores/productsStore'

export const SearchResult = () => {
  const searchParams = useSearchParams()
  const query = searchParams.get('query') || ''
  const { data, filteredData, setSearchQuery } = useProductsStore()

  const [searchResults, setSearchResults] = useState(filteredData)

  useEffect(() => {
    setSearchQuery(query)
    // 검색어가 포함된 데이터를 필터링
    const results = data.filter(
      (product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()),
    )
    setSearchResults(results)

    setSearchQuery('')
  }, [query, data, setSearchQuery])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">검색 결과</h1>

      <p className="mb-4 text-gray-600">"{query}"에 대한 검색 결과</p>

      {searchResults.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((result) => (
            <div
              key={result.idx}
              className="group relative rounded-lg border bg-white p-4 shadow-lg transition duration-300 ease-in-out hover:shadow-xl"
            >
              <div className="mb-4 h-48 w-full rounded-lg bg-blue-200"></div>
              <h3 className="text-lg font-bold text-gray-800">{result.name}</h3>
              <p className="text-sm text-gray-500">{result.category}</p>
              <p className="mt-2 text-lg font-semibold text-blue-600">{result.original_price.toLocaleString()}원</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">검색 결과가 없습니다.</p>
      )}
    </div>
  )
}
