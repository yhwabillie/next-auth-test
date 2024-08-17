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

interface ProductListProps {
  session: Session | null
}

export const ProductList = ({ session }: ProductListProps) => {
  const { filteredData, setSearchQuery, category, selectedCategory, fetchData, setCategoryFilter, loadMoreData, loading, isEmpty } =
    useProductsStore()

  const [page, setPage] = useState(1)
  const pageSize = 4

  const { ref, inView } = useInView()

  useEffect(() => {
    setSearchQuery('')

    fetchData(page, pageSize)
  }, [])

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

  const variants = {
    hidden: {
      opacity: 0,
    },
    visible: {
      opacity: 1,
    },
  }

  return (
    <div className="container mx-auto px-4">
      {/* 카테고리 필터 */}
      <Category category={category} setCategoryFilter={setCategoryFilter} selectedCategory={selectedCategory} />

      {/* 상품 리스트 */}
      <div className="mb-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredData.map((product, index) => (
          <motion.div
            variants={variants}
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

              {/* 오버레이 효과 */}
              <div className="absolute inset-0 z-10 rounded-lg bg-black/50 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100"></div>

              {/* 위시리스트 및 장바구니 버튼 */}
              <div className="absolute right-2 top-2 z-20 flex space-x-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <button className="rounded-full bg-white p-2 text-red-500 shadow hover:bg-gray-100">
                  <BsHeart className="h-6 w-6" />
                </button>
                <button className="rounded-full bg-white p-2 text-blue-500 shadow hover:bg-gray-100">
                  <FaShoppingBag className="h-6 w-6" />
                </button>
              </div>
            </div>
            <h3 className="relative z-20 text-lg font-bold text-gray-800">{product.name}</h3>
            <p className="relative z-20 text-sm text-gray-500">{product.category}</p>
            <p className="relative z-20 mt-2 text-lg font-semibold text-blue-600">{product.original_price.toLocaleString()}원</p>
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
