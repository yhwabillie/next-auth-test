'use client'
import { addToCartlist, fetchCartList, removeFromCartlist } from '@/app/actions/cartlist/actions'
import { fetchWishlist, removeFromWishlist, addToWishlist } from '@/app/actions/wishlist/actions'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { EmptyTab } from './EmptyTab'

export const WishListTab = () => {
  const { data: session, update } = useSession()
  const [data, setData] = useState<any>([])
  const [cartlist, setCartlist] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const userIdx = session?.user?.idx

  const fetchData = async () => {
    try {
      const wishlist = await fetchWishlist()
      setData(wishlist)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  /**
   * 클릭한 상품을 위시리스트에 제거
   */
  const deleteFromWishList = async (productIdx: string) => {
    try {
      const response = await removeFromWishlist(userIdx!, productIdx)
      setData((prev: any) => prev.filter(({ product }: any) => product.idx !== productIdx))
    } catch (error) {
      console.error('Failed to delete wishlist:', error)
      toast.error('wishlist 제거에 실패했습니다, 다시 시도해주세요.')
    }
  }

  /**
   * wishlist DB 데이터 GET
   */
  const fetchCartData = async () => {
    try {
      const response = await fetchCartList(userIdx!)
      setCartlist(response.map(({ product }) => product.idx))
    } catch (error) {
      console.error('Failed to fetch cartlist:', error)
      toast.error('cartlist 데이터 fetch에 실패했습니다, 다시 시도해주세요.')
    }
  }

  /**
   * productIdx를 비교하여 쇼핑카트에 있는 상품인지 체크
   */
  const isProductInCartlist = (productIdx: string) => {
    return cartlist.includes(productIdx)
  }

  /**
   * toggle 클릭한 상품을 쇼핑카트에 추가/제거
   */
  const toggleCartlist = async (productIdx: string) => {
    if (isProductInCartlist(productIdx)) {
      try {
        const response = await removeFromCartlist(userIdx!, productIdx)
        update({ cartlist_length: response })
        setCartlist((prev: any) => prev.filter((idx: any) => idx !== productIdx))
      } catch (error) {}
    } else {
      try {
        const response = await addToCartlist(userIdx!, productIdx)

        update({ cartlist_length: response })
        setCartlist((prev: any) => [...prev, productIdx])
      } catch (error) {}
    }
  }

  useEffect(() => {
    fetchData()
    fetchCartData()
  }, [userIdx])

  const isEmpty = data.length === 0

  return (
    <>
      {isEmpty ? (
        <EmptyTab sub_title="위시리스트가 비었습니다" title="🤩 사고싶은 제품을 추가해주세요." type="link" label="위시리스트 채우러가기" />
      ) : (
        <div>
          <h5>위시리스트 내역</h5>
          {loading && <div>Loading...</div>}
          {data.map(({ product }: any, index: number) => (
            <div key={index}>
              <strong>{product.name}</strong>
              <img src={product.imageUrl} alt={product.name} />
              <div>
                <button onClick={() => deleteFromWishList(product.idx)} className="bg-blue-600/50 p-3">
                  위시 해제
                </button>
                <button
                  onClick={() => toggleCartlist(product.idx)}
                  className={clsx('wishlist-button  p-5', {
                    'bg-pink-600': isProductInCartlist(product.idx),
                    'bg-pink-600/50': !isProductInCartlist(product.idx),
                  })}
                >
                  장바구니
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
