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
    <div className="container mx-auto px-4">
      {/* 카테고리 필터 */}
      <Category setCategoryFilter={setCategoryFilter} selectedCategory={selectedCategory} />

      {/* 상품 리스트 */}
      <div className="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((product, index) => (
          <motion.div
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
            key={`${product.idx}-${index}`}
            className="group relative rounded-lg border bg-white p-4 shadow-lg transition duration-300 ease-in-out hover:shadow-xl"
          >
            <div className="relative">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="mb-4 h-48 w-full rounded-lg object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="relative z-20 text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="relative z-20 text-sm text-gray-500">{product.category}</p>
            <p className="relative z-20 mt-2 text-lg font-semibold text-blue-600">{product.original_price.toLocaleString()}원</p>
            <button type="button" onClick={() => handleClickAddWish(product)} className="mr-2 inline-block bg-pink-400 p-2 text-white">
              {product.isInWish ? '위시에서 빼기' : '위시에 넣기'}
            </button>
            <button type="button" onClick={() => handleClickAddProduct(product)} className="bg-blue-400 p-2 text-white">
              {product.isInCart ? '장바구니 빼기' : '장바구니 넣기'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* 로딩 스피너 */}
      {!isEmpty && (
        <div ref={ref} className="flex items-center justify-center">
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}
