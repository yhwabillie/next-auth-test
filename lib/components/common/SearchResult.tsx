'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useProductsStore } from '@/lib/stores/productsStore'
import { ProductType } from '@/app/actions/products/actions'
import { useSession } from 'next-auth/react'

export const SearchResult = () => {
  const searchParams = useSearchParams()
  const { status, update, data: session } = useSession()
  const query = searchParams.get('query') || ''
  const { data, filteredData, setSearchQuery, toggleCartStatus, cartlistLength, toggleWishStatus, setSessionUpdate } = useProductsStore()

  const [searchResults, setSearchResults] = useState(filteredData)

  const results = data.filter(
    (product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()),
  )

  //1. 세션확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  useEffect(() => {
    setSearchQuery(query)
    setSearchQuery('')
  }, [query, data, setSearchQuery])

  //위시토글
  const handleClickAddWish = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleWishStatus(targetItem.idx)
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  const handleClickAddProduct = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleCartStatus(targetItem.idx)
      // update({ cartlistLength: cartlistLength })
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">검색 결과</h1>

      <p className="mb-4 text-gray-600">"{query}"에 대한 검색 결과</p>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((result) => (
            <div
              key={result.idx}
              className="group relative rounded-lg border bg-white p-4 shadow-lg transition duration-300 ease-in-out hover:shadow-xl"
            >
              <div className="mb-4 h-48 w-full rounded-lg bg-blue-200"></div>
              <h3 className="text-lg font-bold text-gray-800">{result.name}</h3>
              <p className="text-sm text-gray-500">{result.category}</p>
              <p className="mt-2 text-lg font-semibold text-blue-600">{result.original_price.toLocaleString()}원</p>
              <button onClick={() => handleClickAddWish(result)} type="button" className="mr-2 inline-block bg-pink-400 p-2 text-white">
                {result.isInWish ? '위시에서 빼기' : '위시에 넣기'}
              </button>
              <button onClick={() => handleClickAddProduct(result)} type="button" className="bg-blue-400 p-2 text-white">
                {result.isInCart ? '장바구니 빼기' : '장바구니 넣기'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">검색 결과가 없습니다.</p>
      )}
    </div>
  )
}
