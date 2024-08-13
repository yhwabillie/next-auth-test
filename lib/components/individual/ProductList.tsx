'use client'
import { ProductType } from '@/app/actions/products/actions'
import { useProductsStore } from '@/lib/stores/productsStore'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { TabContentSkeleton } from './TabContentSkeleton'
import { EmptyTab } from './EmptyTab'

export const ProductList = () => {
  const { data: session, update } = useSession()
  const userIdx = session?.user?.idx
  const { fetchData, setUserIdx, data, loading, isEmpty, toggleWishStatus, setSessionUpdate, showModal, toggleCartStatus } = useProductsStore()

  const pageSize = 5
  const [page, setPage] = useState(1)

  const handleClickAddWish = (targetItem: ProductType) => {
    if (!userIdx) {
      //비회원 접근
      showModal('alert')
    } else {
      //회원 접근
      toggleWishStatus(targetItem.idx, page, pageSize)
    }
  }

  const handleClickAddProduct = (targetItem: ProductType) => {
    if (!userIdx) {
      //비회원 접근
      showModal('alert')
    } else {
      //회원 접근
      toggleCartStatus(targetItem.idx, page, pageSize)
    }
  }

  useEffect(() => {
    if (!userIdx) {
      //비회원 접근
    } else if (userIdx) {
      //회원 접근
      setUserIdx(userIdx)

      if (!session) return
      setSessionUpdate(update)
    }

    fetchData(page, pageSize)
  }, [page, userIdx])

  if (loading) return <TabContentSkeleton />

  return (
    <>
      {isEmpty ? (
        <EmptyTab sub_title="입력된 제품정보가 없습니다" title="📦 제품을 추가해주세요." type="link" label="어드민 제품 추가하기" />
      ) : (
        <>
          {data.map((item, index) => (
            <div key={index}>
              <p>{item.name}</p>
              <div className="flex flex-row gap-3">
                <button
                  type="button"
                  onClick={() => handleClickAddWish(item)}
                  className={clsx('p-3 text-white disabled:bg-gray-700', {
                    'bg-blue-300 text-black': item.isInWish,
                    'bg-blue-700 text-black': !item.isInWish,
                  })}
                  disabled={loading}
                >
                  {item.isInWish ? '위시에서 빼기' : '위시에 넣기'}
                </button>
                <button
                  type="button"
                  onClick={() => handleClickAddProduct(item)}
                  className={clsx('bg-red-700 p-3 text-white disabled:bg-gray-700', {
                    'bg-red-300 text-black': item.isInCart,
                  })}
                  disabled={loading}
                >
                  {item.isInCart ? '장바구니에서 빼기' : '장바구니에 넣기'}
                </button>
              </div>
              <img src={item.imageUrl} alt={item.name} className="h-20 w-20" />
            </div>
          ))}
        </>
      )}
    </>
  )
}
