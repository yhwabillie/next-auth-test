import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'
import { FaTrashCan } from 'react-icons/fa6'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'

interface WishlistItemProps {
  category: string
  name: string
  imageUrl: string
  original_price: number
  discount_rate: number
  isInCart: boolean | undefined
  loading: boolean
  handleDeleteWishItem: () => void
  handleToggleCartStatus: () => void
}

export const WishlistItem = React.memo(
  ({
    category,
    name,
    imageUrl,
    original_price,
    discount_rate,
    isInCart,
    loading,
    handleDeleteWishItem,
    handleToggleCartStatus,
  }: WishlistItemProps) => {
    return (
      <li className="mb-5 flex flex-col justify-between rounded-lg border border-gray-300 bg-gray-100 p-3 last:mb-0 lg:flex-row">
        <div className="mb-2 flex flex-row lg:mb-0">
          <figure className="relative mr-5 block h-28 w-28 overflow-hidden rounded-lg border border-gray-400/30 drop-shadow-lg">
            <Image src={imageUrl} alt={name} width={80} height={120} className="absolute left-0 top-0 w-full object-fill" />
          </figure>

          <div className="flex w-[calc(100%-132px)] flex-col justify-center">
            <p className="mb-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-sm text-white drop-shadow-md">{category}</p>
            <strong className="text-md block font-medium text-gray-600">{name}</strong>

            {discount_rate === 0 ? (
              <p className="text-lg font-bold text-gray-800">{original_price.toLocaleString('ko-KR')}원</p>
            ) : (
              <div className="justify-content flex flex-row items-center gap-2">
                <p className="text-lg font-bold text-red-600">{discount_rate * 100}%</p>
                <p className="text-md text-gray-400 line-through">{original_price.toLocaleString('ko-KR')}원</p>
                <p className="text-lg font-bold text-gray-800">{(original_price - original_price * discount_rate).toLocaleString('ko-KR')}원</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <button
            onClick={handleDeleteWishItem}
            className="flex items-center justify-center gap-2 rounded-lg bg-gray-500 px-10 py-3 text-sm font-semibold text-white drop-shadow-lg transition-all duration-150 ease-in-out hover:bg-gray-600"
          >
            <FaTrashCan />
            <span>위시 삭제</span>
          </button>

          <button
            onClick={handleToggleCartStatus}
            disabled={loading}
            className={clsx(
              'flex items-center justify-center gap-2 rounded-lg px-10 py-3 text-sm font-semibold drop-shadow-lg transition-all duration-150 ease-in-out ',
              {
                'bg-gray-400/50 hover:bg-gray-400 hover:text-white': isInCart,
                'bg-red-500 text-white hover:bg-red-600': !isInCart,
              },
            )}
          >
            {isInCart ? (
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
    )
  },
)
