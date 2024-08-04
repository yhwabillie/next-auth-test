'use client'
import { fetchProducts } from '@/app/actions/products/actions'
import { Product } from '@prisma/client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export const ProductList = () => {
  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const pageSize = 3
  const [page, setPage] = useState(1)

  const [hasMore, setHasMore] = useState(true)
  const observer = useRef<IntersectionObserver | null>(null)

  const fetchData = async (page: number) => {
    setLoading(true)

    try {
      const { products, totalProducts } = await fetchProducts({ page, pageSize })

      setData((prevProducts) => [...prevProducts, ...products])
      setHasMore(products.length > 0 && products.length < totalProducts)
    } catch (error: any) {
      console.error('Failed to fetch products:', error) // 디버그용
      toast.error('데이터 fetch에 실패했습니다, 다시 시도해주세요.') // 사용자 알림용
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(page)
  }, [page])

  // 마지막 상품 요소가 뷰포트에 들어왔을 때
  // 새로운 페이지의 데이터를 로드하기 위해 Intersection Observer를 설정
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

  return (
    <div>
      {data.map((item, index) => {
        if (index === data.length - 1) {
          return (
            <div ref={lastProductElementRef} key={item.idx} className="product bg-blue-400">
              <h2>마지막 제품</h2>
              <p>{item.original_price}</p>
              <p>{item.discount_rate}</p>
              <img src={item.imageUrl} alt={item.name} />
            </div>
          )
        } else {
          return (
            <div key={index} className="product bg-pink-400">
              <h2>{item.name}</h2>
              <p>{item.original_price}</p>
              <p>{item.discount_rate}</p>
              <img src={item.imageUrl} alt={item.name} />
            </div>
          )
        }
      })}
      {loading && <p>Loading...</p>}
    </div>
  )
}
