'use client'
import { useProductsStore } from '@/lib/stores/productsStore'
import { useEffect, useState } from 'react'
import { Category } from './Category'
import { LoadingSpinner } from './modules/LoadingSpinner'
import { useInView } from 'react-intersection-observer'
import { useSession } from 'next-auth/react'
import { ProductType } from '@/app/actions/products/actions'
import { LuHeartOff } from 'react-icons/lu'
import { FaHeartCirclePlus } from 'react-icons/fa6'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'
import { calculateDiscountedPrice } from '@/lib/utils'
import { SkeletonProduct } from './SkeletonProduct'
import { motion } from 'framer-motion'
import Image from 'next/image'

export const ProductList = () => {
  const { status, update } = useSession()
  const {
    filteredData,
    setSearchQuery,
    selectedCategory,
    fetchData,
    setCategoryFilter,
    loadMoreData,
    loading,
    isEmpty,
    toggleCartStatus,
    toggleWishStatus,
    setSessionUpdate,
    totalProducts,
  } = useProductsStore()

  const [page, setPage] = useState(1)
  const pageSize = 10
  const lastPage = Math.ceil(totalProducts / pageSize)

  const { ref: triggerRef, inView: triggerInVeiw } = useInView({
    threshold: 0.1,
  })

  //1. 세션확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  // 2. 초기 데이터 패치
  useEffect(() => {
    setSearchQuery('')
    fetchData(page, pageSize)
  }, [])

  // 3. 무한 스크롤 Trigger
  useEffect(() => {
    if (triggerInVeiw && !loading && !isEmpty && page <= lastPage) {
      setPage((prevPage) => prevPage + 1)
      loadMoreData(page, pageSize)
    }
  }, [triggerInVeiw, loading, isEmpty])

  //위시 추가&제거 Toggle
  const handleClickAddWish = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleWishStatus(targetItem.idx)
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  //장바구니 추가&제거 Toggle
  const handleClickAddProduct = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleCartStatus(targetItem.idx)
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  //마크업
  return (
    <div className="relative z-10 mx-auto mt-4 box-border min-w-[460px] rounded-t-[2rem] bg-white pb-4 pt-4 drop-shadow-lg md:static md:z-0 md:mt-0 md:w-auto md:bg-transparent">
      {/* 카테고리 필터 */}
      <Category setCategoryFilter={setCategoryFilter} selectedCategory={selectedCategory} />

      {/* 상품 리스트 */}
      <section className="container box-border w-full bg-white sm:mx-auto md:mt-4 md:bg-transparent">
        <ul className="m-4 grid grid-cols-2 sm:grid-cols-3 md:m-0 md:grid-cols-4 xl:grid-cols-5">
          {filteredData.map((product, index) => (
            <li key={product.idx} className="group relative box-border flex aspect-[2/3] flex-col justify-between overflow-hidden p-5">
              {/* 카테고리, 제목 */}
              <div>
                <p className="relative z-[1] mb-2 text-sm font-semibold text-white/80 transition-all duration-300">{product.category}</p>
                <p className="relative z-[1] flex flex-nowrap overflow-hidden">
                  <span className="inline-block whitespace-nowrap text-lg tracking-tight text-white group-hover:animate-marquee">
                    {product.name}&nbsp;&nbsp;&nbsp;&nbsp;
                    {product.name}&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                </p>
              </div>

              <div className="flex items-end justify-between">
                <div className="relative z-[1]">
                  {product.discount_rate !== 0 ? (
                    <>
                      <p className="text-4xl font-bold tracking-tight text-white drop-shadow-md">{`${product.discount_rate * 100}%`}</p>
                      <p className="text-lg font-normal tracking-tight text-white drop-shadow-md">
                        {calculateDiscountedPrice(product.original_price, product.discount_rate)}
                      </p>
                    </>
                  ) : (
                    <p className="text-lg font-normal tracking-tight text-white drop-shadow-md">{`${product.original_price.toLocaleString(
                      'ko-KR',
                    )}원`}</p>
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
              <motion.figure
                variants={{
                  hidden: {
                    opacity: 0,
                  },
                  visible: {
                    opacity: 1,
                  },
                }}
                initial="hidden"
                animate="visible"
                transition={{
                  delay: index * 0.01, // 인덱스에 따라 더 부드러운 지연
                  ease: 'easeInOut', // 부드러운 전환을 위한 ease 설정
                  duration: 0.2, // 전환 시간을 더 길게 설정
                }}
                className="absolute inset-0 transition-opacity duration-500"
              >
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={600}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                  priority={index === 0}
                />
              </motion.figure>

              {/* 그라데이션 배경 */}
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-transparent to-black/50 transition-all duration-300"></div>
            </li>
          ))}

          {!(page === lastPage + 1) && (
            <>
              <SkeletonProduct triggerRef={triggerRef} />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
              <SkeletonProduct />
            </>
          )}
        </ul>

        {!(page === lastPage + 1) && (
          <div className="flex h-48 w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </section>
    </div>
  )
}
