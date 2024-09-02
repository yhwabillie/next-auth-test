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
      <li className="mb-5 flex flex-col justify-between gap-2 rounded-lg border border-gray-300 bg-gray-100 p-3 last:mb-0 md:flex-row">
        <div>
          <div className="flex flex-row items-start gap-2.5 md:gap-4 lg:mb-0">
            <figure className="relative block h-[100px] w-[100px] overflow-hidden rounded-lg border border-gray-400/30 bg-gray-300 drop-shadow-lg md:mr-0 md:h-[100px] md:w-[100px]">
              <Image src={imageUrl} alt={name} width={80} height={120} className="absolute left-0 top-0 w-full object-fill" />
            </figure>

            <div className="w-[calc(100%-(100px+1rem))]">
              <div className="mt-2 flex flex-col justify-center">
                <p className="mb-1 block w-fit rounded-md bg-blue-600 px-2 py-1 text-[12px] text-white drop-shadow-md md:text-sm">{category}</p>
                <strong className="block break-all text-sm font-medium tracking-tighter text-gray-600 md:text-[16px]">{name}</strong>
              </div>

              {discount_rate === 0 ? (
                <p className="text-lg font-bold text-gray-800">{original_price.toLocaleString('ko-KR')}원</p>
              ) : (
                <div className="justify-content flex flex-row items-end">
                  <div className="mt-2">
                    <p className="mr-1 text-[16px] font-bold leading-[20px] text-red-600 md:text-[18px]">{discount_rate * 100}%</p>
                    <p className="mr-2 text-sm tracking-tighter text-gray-400 line-through">{original_price.toLocaleString('ko-KR')}원</p>
                  </div>
                  <p className="text-[18px] font-bold leading-[24px] tracking-tighter text-gray-800">
                    {(original_price - original_price * discount_rate).toLocaleString('ko-KR')}원
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row justify-between md:w-fit md:flex-col md:justify-center md:gap-1">
          <button
            onClick={handleDeleteWishItem}
            className="flex w-[calc(50%-2px)] items-center justify-center gap-2 rounded-lg bg-gray-500 text-sm font-semibold text-white drop-shadow-lg transition-all duration-150 ease-in-out hover:bg-gray-600 md:h-10 md:w-[200px]"
          >
            <FaTrashCan />
            <span>위시 삭제</span>
          </button>

          <button
            onClick={handleToggleCartStatus}
            disabled={loading}
            className={clsx(
              'flex w-[calc(50%-2px)] items-center justify-center gap-2 rounded-lg py-3 font-semibold drop-shadow-lg transition-all duration-150 ease-in-out md:h-10 md:w-[200px]',
              {
                'bg-gray-400/50 hover:bg-gray-400 hover:text-white': isInCart,
                'bg-red-500 text-white hover:bg-red-600': !isInCart,
              },
            )}
          >
            {isInCart ? (
              <>
                <TbShoppingBagMinus className="text-xl" />
                <span className="inline-block w-fit text-sm">장바구니 빼기</span>
              </>
            ) : (
              <>
                <TbShoppingBagPlus className="text-xl" />
                <span className="inline-block w-fit text-sm">장바구니 넣기</span>
              </>
            )}
          </button>
        </div>
      </li>
    )
  },
)
