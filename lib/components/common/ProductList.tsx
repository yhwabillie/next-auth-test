'use client'
import { useProductsStore } from '@/lib/stores/productsStore'
import { useEffect, useRef, useState } from 'react'
import { Session } from 'next-auth'
import { Category } from './Category'
import { LoadingSpinner } from './modules/LoadingSpinner'
import { useInView } from 'react-intersection-observer'
import { motion } from 'framer-motion'
import { BsHeart } from 'react-icons/bs'
import { FaShoppingBag } from 'react-icons/fa'
import { useSession } from 'next-auth/react'
import { ProductType } from '@/app/actions/products/actions'
import { useRouter } from 'next/navigation'
import { LuHeartOff } from 'react-icons/lu'
import { FaHeartCirclePlus } from 'react-icons/fa6'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'
import clsx from 'clsx'
import { calculateDiscountedPrice } from '@/lib/utils'

export const ProductList = () => {
  const {
    setUserIdx,
    filteredData,
    setSearchQuery,
    category,
    selectedCategory,
    fetchData,
    setCategoryFilter,
    loadMoreData,
    loading,
    isEmpty,
    data,
    sessionUpdate,
    toggleCartStatus,
    toggleWishStatus,
    setSessionUpdate,
    cartlistLength,
    syncFilteredDataWithData,
  } = useProductsStore()
  const [page, setPage] = useState(1)
  const pageSize = 4
  const { ref, inView } = useInView()
  const { status, update, data: session } = useSession()
  const router = useRouter()

  //1. 세션확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  //1. 데이터 패치 및 세션확인
  useEffect(() => {
    setSearchQuery('')
    fetchData(page, pageSize)
  }, [])

  //data: 기본 전체 데이터, filteredData: 필터링 사용 데이터
  // console.log('data==>', data)
  // console.log('filteredData==>', filteredData)

  //2. 인피니트 스크롤
  useEffect(() => {
    if (inView && !loading && !isEmpty) {
      setPage((prevPage) => prevPage + 1)
    }
  }, [inView, loading, isEmpty])

  useEffect(() => {
    if (page > 1 && !loading && !isEmpty) {
      loadMoreData(page, pageSize)
    }
  }, [page])

  //위시토글
  const handleClickAddWish = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleWishStatus(targetItem.idx)
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  const handleClickAddProduct = (targetItem: ProductType) => {
    if (status === 'authenticated') {
      //회원 접근
      toggleCartStatus(targetItem.idx)
      // update({ cartlistLength: cartlistLength })
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  //마크업
  return (
    <div className="relative z-10 mx-auto mt-4 box-border min-w-[460px] overflow-x-hidden rounded-t-[2rem] bg-white pb-4 drop-shadow-lg md:static md:z-0 md:w-auto md:bg-transparent">
      {/* 카테고리 필터 */}
      <Category setCategoryFilter={setCategoryFilter} selectedCategory={selectedCategory} />

      {/* 상품 리스트 */}
      <section className="box-border bg-white px-8 lg:container md:mt-4 md:bg-transparent md:px-4 lg:mx-auto">
        <ul className="mt-[26px] grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-2 md:gap-y-6 lg:grid-cols-4 xl:grid-cols-5">
          {filteredData.map((product, index) => (
            <motion.li
              key={`${product.idx}-${index}`}
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
                delay: index * 0.08,
                ease: 'easeInOut',
                duration: 0.2,
              }}
              className="group transition-all md:translate-y-0 md:rounded-xl md:bg-white md:p-3 md:hover:translate-y-[-10px]"
            >
              <div className="mb-3 aspect-square overflow-hidden rounded-xl border border-gray-300 shadow-md">
                <img src={product.imageUrl} alt={product.name} className="w-full transition-all duration-300 group-hover:scale-110" />
              </div>

              <p className="md:text-md mb-2 font-semibold tracking-tight text-gray-700">{product.name}</p>

              <div className="mb-3">
                {product.discount_rate > 0 && (
                  <span className="mr-1 inline-block text-lg font-bold tracking-tight text-gray-700">
                    {calculateDiscountedPrice(product.original_price, product.discount_rate)}
                  </span>
                )}

                {product.discount_rate > 0 && (
                  <span className="text-primary-dark mr-1 inline-block text-lg font-bold tracking-tight">{`${product.discount_rate * 100}%`}</span>
                )}
                <span
                  className={clsx('text-lg font-bold tracking-tight text-gray-700', {
                    'text-sm font-normal !text-gray-400 line-through': product.discount_rate > 0,
                  })}
                >{`${product.original_price.toLocaleString('ko-KR')}원`}</span>
              </div>

              <div className="md:flex md:justify-end">
                <button
                  type="button"
                  onClick={() => handleClickAddWish(product)}
                  className="bg-secondary-dark hover:bg-secondary-tonDown mr-2 inline-block rounded-md p-2 text-sm text-white shadow-md transition-all duration-300"
                >
                  {product.isInWish ? <LuHeartOff className="text-2xl" /> : <FaHeartCirclePlus className="text-2xl drop-shadow-md" />}
                </button>
                <button
                  type="button"
                  onClick={() => handleClickAddProduct(product)}
                  className={clsx('inline-block rounded-md p-2 text-sm text-white duration-300', {
                    'bg-primary-dark hover:bg-primary-tonDown': !product.isInCart,
                    'bg-gray-600 hover:bg-gray-700': product.isInCart,
                  })}
                >
                  {product.isInCart ? <TbShoppingBagMinus className="text-2xl" /> : <TbShoppingBagPlus className="text-2xl drop-shadow-md" />}
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* 로딩 스피너 */}
      {!isEmpty && (
        <div ref={ref} className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
