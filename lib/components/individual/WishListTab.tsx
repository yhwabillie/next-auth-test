'use client'
import { FaTrashCan } from 'react-icons/fa6'
import clsx from 'clsx'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { EmptyTab } from './EmptyTab'
import { TabContentSkeleton } from './TabContentSkeleton'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'
import { useWishlistStore } from '@/lib/stores/wishlistStore'

interface WishListTabProps {
  userIdx: string
}

export const WishListTab = ({ userIdx }: WishListTabProps) => {
  const { update } = useSession()
  const { setUserIdx, fetchData, data, isEmpty, loading, handleToggleCartStatus, handleDeleteWishItem, setSessionUpdate } = useWishlistStore()

  useEffect(() => {
    setUserIdx(userIdx)
    fetchData()
    setSessionUpdate(update)
  }, [userIdx, fetchData, setSessionUpdate, update])

  if (loading) return <TabContentSkeleton />

  return (
    <>
      {isEmpty ? (
        <EmptyTab sub_title="위시리스트가 비었습니다" title="🤩 사고싶은 제품을 추가해주세요." type="link" label="위시리스트 채우러가기" />
      ) : (
        <>
          <h5 className="mb-2 block px-2 text-xl font-semibold text-black">위시리스트 상품</h5>
          <ul className="px-2">
            {data.map(({ product }, index: number) => (
              <li key={index} className="mb-5 flex flex-row justify-between rounded-lg border border-gray-300 bg-gray-100 p-3 last:mb-0">
                <div className="flex flex-row">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="mr-5 block h-28 w-28 rounded-lg border border-gray-400/30 drop-shadow-lg"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="mb-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-sm text-white drop-shadow-md">{product.category}</p>
                    <strong className="text-md block font-medium text-gray-600">{product.name}</strong>

                    {product.discount_rate === 0 ? (
                      <p className="text-lg font-bold text-gray-800">{product.original_price.toLocaleString('ko-KR')}원</p>
                    ) : (
                      <div className="justify-content flex flex-row items-center gap-2">
                        <p className="text-lg font-bold text-red-600">{product.discount_rate * 100}%</p>
                        <p className="text-md text-gray-400 line-through">{product.original_price.toLocaleString('ko-KR')}원</p>
                        <p className="text-lg font-bold text-gray-800">
                          {(product.original_price - product.original_price * product.discount_rate).toLocaleString('ko-KR')}원
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <button
                    onClick={() => handleDeleteWishItem(product.idx)}
                    className="flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-10 py-3 text-sm font-semibold text-white drop-shadow-lg transition-all duration-150 ease-in-out hover:bg-gray-600"
                  >
                    <FaTrashCan />
                    <span>위시 삭제</span>
                  </button>

                  <button
                    onClick={() => handleToggleCartStatus(product.idx)}
                    disabled={loading}
                    className={clsx(
                      'flex items-center gap-2 rounded-lg px-10 py-3 text-sm font-semibold drop-shadow-lg transition-all duration-150 ease-in-out ',
                      {
                        'bg-gray-400/50 hover:bg-gray-400 hover:text-white': product.isInCart,
                        'bg-red-500 text-white hover:bg-red-600': !product.isInCart,
                      },
                    )}
                  >
                    {product.isInCart ? (
                      <>
                        <TbShoppingBagMinus className="text-xl" />
                        <span>장바구니 빼기</span>
                      </>
                    ) : (
                      <>
                        <TbShoppingBagPlus className="text-xl" />
                        <span>장바구니 넣기</span>
                      </>
                    )}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  )
}
