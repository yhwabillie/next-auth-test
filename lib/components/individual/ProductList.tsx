'use client'
import { addToCartlist, fetchCartlist, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { fetchProducts } from '@/app/actions/products/actions'
import { addToWishlist, fetchWishlist, removeFromWishlist } from '@/app/actions/wishlist/actions'
import { Product } from '@prisma/client'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export const ProductList = () => {
  const { data: session } = useSession()
  const [wishlist, setWishlist] = useState<any>([])
  const [cartlist, setCartlist] = useState<any>([])
  const userIdx = session?.user?.idx

  const [data, setData] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const pageSize = 3
  const [page, setPage] = useState(1)

  /**
   * products DB 데이터 GET
   * @param {number} page - 현재 페이지
   */
  const fetchData = async (page: number) => {
    try {
      const { products, totalProducts } = await fetchProducts({ page, pageSize })
      setData(products)
    } catch (error: any) {
      console.error('Failed to fetch products:', error)
      toast.error('product 데이터 fetch에 실패했습니다, 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  /**
   * wishlist DB 데이터 GET
   */
  const fetchWishData = async () => {
    try {
      const response = await fetchWishlist(userIdx!)
      setWishlist(response.map((item) => item.productIdx))
    } catch (error) {
      console.error('Failed to fetch wishlist:', error)
      toast.error('wishlist 데이터 fetch에 실패했습니다, 다시 시도해주세요.')
    }
  }

  /**
   * wishlist DB 데이터 GET
   */
  const fetchCartData = async () => {
    try {
      const response = await fetchCartlist(userIdx!)
      setCartlist(response.map((item) => item.productIdx))
    } catch (error) {
      console.error('Failed to fetch cartlist:', error)
      toast.error('cartlist 데이터 fetch에 실패했습니다, 다시 시도해주세요.')
    }
  }

  /**
   * productIdx를 비교하여 위시리스트에 있는 상품인지 체크
   */
  const isProductInWishlist = (productIdx: string) => {
    return wishlist.includes(productIdx)
  }

  /**
   * productIdx를 비교하여 쇼핑카트에 있는 상품인지 체크
   */
  const isProductInCartlist = (productIdx: string) => {
    return cartlist.includes(productIdx)
  }

  /**
   * toggle 클릭한 상품을 위시리스트에 추가/제거
   */
  const toggleWishlist = async (productIdx: string) => {
    if (isProductInWishlist(productIdx)) {
      console.log('잇으면 빼자')
      await removeFromWishlist(userIdx!, productIdx)
      setWishlist((prev: any) => prev.filter((idx: any) => idx !== productIdx))
    } else {
      console.log('없으면 넣자')
      await addToWishlist(userIdx!, productIdx)
      setWishlist((prev: any) => [...prev, productIdx])
    }
  }

  /**
   * toggle 클릭한 상품을 쇼핑카트에 추가/제거
   */
  const toggleCartlist = async (productIdx: string) => {
    if (isProductInCartlist(productIdx)) {
      console.log('잇으면 빼자')
      await removeFromCartlist(userIdx!, productIdx)
      setCartlist((prev: any) => prev.filter((idx: any) => idx !== productIdx))
    } else {
      console.log('없으면 넣자')
      await addToCartlist(userIdx!, productIdx)
      setCartlist((prev: any) => [...prev, productIdx])
    }
  }

  useEffect(() => {
    fetchData(page)
    fetchWishData()
    fetchCartData()
  }, [page])

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {data.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <div>
                <button
                  onClick={() => toggleWishlist(item.idx)}
                  className={clsx('wishlist-button  p-5', {
                    'bg-blue-600': isProductInWishlist(item.idx),
                    'bg-blue-600/50': !isProductInWishlist(item.idx),
                  })}
                >
                  위시리스트
                </button>
                <button
                  onClick={() => toggleCartlist(item.idx)}
                  className={clsx('wishlist-button  p-5', {
                    'bg-pink-600': isProductInCartlist(item.idx),
                    'bg-pink-600/50': !isProductInCartlist(item.idx),
                  })}
                >
                  장바구니
                </button>
              </div>
              <img src={item.imageUrl} alt={item.name} />
            </div>
          ))}
        </>
      )}
    </div>
  )
}
