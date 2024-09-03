import { motion } from 'framer-motion'
import { ProductType } from '@/app/actions/products/actions'
import { calculateDiscountedPrice } from '@/lib/utils'
import { FaHeartCirclePlus } from 'react-icons/fa6'
import { LuHeartOff } from 'react-icons/lu'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'
import Image from 'next/image'
import React from 'react'

interface ProductItemProps {
  product: ProductType
  index: number
  handleClickAddProduct: (targetItem: ProductType) => void
  handleClickAddWish: (targetItem: ProductType) => void
}

export const ProductItem = React.memo(({ product, index, handleClickAddProduct, handleClickAddWish }: ProductItemProps) => {
  return (
    <li className="group relative box-border flex aspect-[2/3] flex-col justify-between overflow-hidden p-5">
      {/* 카테고리, 제목 */}
      <div>
        <p className="relative z-[1] mb-2 text-xs font-semibold text-white/80 transition-all duration-300 sm:text-sm">{product.category}</p>
        <p className="relative z-[1] flex flex-nowrap overflow-hidden">
          <span className="inline-block whitespace-nowrap text-sm tracking-tight text-white group-hover:animate-marquee sm:text-lg">
            {product.name}&nbsp;&nbsp;&nbsp;&nbsp;
            {product.name}&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
        </p>
      </div>

      <div className="flex items-end justify-between">
        <div className="relative z-[1]">
          {product.discount_rate !== 0 ? (
            <>
              <p className="text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-4xl">{`${product.discount_rate * 100}%`}</p>
              <p className="text-md font-normal tracking-tight text-white drop-shadow-md sm:text-lg">
                {calculateDiscountedPrice(product.original_price, product.discount_rate)}
              </p>
            </>
          ) : (
            <p className="text-md font-normal tracking-tight text-white drop-shadow-md sm:text-lg">{`${product.original_price.toLocaleString('ko-KR')}원`}</p>
          )}
        </div>
        <ul className="relative z-[1] flex h-fit w-fit flex-col gap-3">
          <li className="flex items-center justify-center">
            <button aria-label="shopping cart add remove toggle button" type="button" onClick={() => handleClickAddProduct(product)}>
              {product.isInCart ? (
                <TbShoppingBagMinus className="text-4xl text-white drop-shadow-md transition-all hover:text-gray-300" />
              ) : (
                <TbShoppingBagPlus className="text-4xl text-red-400 drop-shadow-md transition-all hover:text-red-600" />
              )}
            </button>
          </li>
          <li className="flex items-center justify-center">
            <button aria-label="wishlist cart add remove toggle button" type="button" onClick={() => handleClickAddWish(product)}>
              {product.isInWish ? (
                <LuHeartOff className="text-3xl text-white drop-shadow-md transition-all hover:text-gray-300" />
              ) : (
                <FaHeartCirclePlus className="text-3xl text-white drop-shadow-md transition-all hover:text-pink-300" />
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* 제품 배경 이미지 */}
      <picture className="absolute inset-0 transition-opacity duration-500">
        <Image
          src={product.imageUrl}
          alt={product.name}
          width={400}
          height={600}
          className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
          priority={true}
          loading={'eager'}
          quality={75}
        />
      </picture>

      {/* 그라데이션 배경 */}
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-transparent to-black/50 transition-all duration-300"></div>
    </li>
  )
})
