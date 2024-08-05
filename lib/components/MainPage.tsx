'use client'
import { Product } from '@/app/actions/upload-product/actions'
import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from '../debounce'
import { toast } from 'sonner'
import { searchProducts } from '@/app/actions/search/actions'
import { fetchProducts } from '@/app/actions/products/actions'

export const MainPage = () => {
  const [data, setData] = useState<Product[]>([])
  const [query, setQuery] = useState('')

  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [hasMore, setHasMore] = useState(true)

  const pageSize = 10
  const [page, setPage] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchData = async (page: number, query: string) => {
    setLoading(true)

    try {
      const { products: newProducts, totalProducts } = query
        ? await searchProducts({ query, page, pageSize })
        : await fetchProducts({ page, pageSize })

      setData((prevProducts) => (page === 1 ? newProducts : [...prevProducts, ...newProducts]))
      setHasMore(newProducts.length > 0 && data.length < totalProducts)
    } catch (error) {
      console.error('Failed to fetch products:', error) // 디버그용
      toast.error('데이터 fetch에 실패했습니다, 다시 시도해주세요.') // 사용자 알림용
    } finally {
      setLoading(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      const trimmedQuery = searchQuery.trim()
      setQuery(trimmedQuery)
      setPage(1)
      setInitialLoad(false) // 검색어 입력 시 초기 로드를 false로 설정

      if (trimmedQuery === '') {
        setData([]) // 입력값이 빈 값이면 제품 리스트 초기화
        setHasMore(false) // 추가 로드를 방지
      }
    }, 300), // 300ms 디바운스 시간
    [],
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value)
  }

  const lastProductElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })
      if (node) observer.current.observe(node)
    },
    [loading, hasMore],
  )

  useEffect(() => {
    if (!initialLoad) {
      fetchData(page, query)
    }
  }, [page, query, initialLoad])

  return (
    <div className="py-10">
      <fieldset className="mb-5 flex flex-row justify-center">
        <input type="text" placeholder="Search products..." onChange={handleSearch} className="mb-4 rounded border px-3 py-2" />
      </fieldset>
      <div className="pb-20 pt-2 text-center">
        <strong>검색 기록</strong>
        <ul></ul>
      </div>

      <div>
        {query && data.length > 0 ? (
          <>
            {data.map((product, index) => {
              if (index === data.length - 1) {
                return (
                  <div ref={lastProductElementRef} key={product.idx} className="product">
                    <h2>{product.name}</h2>
                    <p>{product.original_price}</p>
                    <p>{product.discount_rate}</p>
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                )
              } else {
                return (
                  <div key={index} className="product">
                    <h2>{product.name}</h2>
                    <p>{product.original_price}</p>
                    <p>{product.discount_rate}</p>
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                )
              }
            })}
          </>
        ) : !initialLoad && query ? (
          <p>No products found</p>
        ) : (
          <div>
            <h3>베스트 셀러</h3>
            <ul>
              <li>1위</li>
              <li>2위</li>
              <li>3위</li>
            </ul>
          </div>
        )}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  )
}
