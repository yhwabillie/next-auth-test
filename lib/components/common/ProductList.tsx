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
import Image from 'next/image'
import { SkeletonProduct } from './SkeletonProduct'

export const ProductList = () => {
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
    filtering,
    setFiltering,
  } = useProductsStore()

  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoadedStates, setImageLoadedStates] = useState<boolean[]>([])

  // 페이징 상태
  const [page, setPage] = useState(1)
  const pageSize = 10

  // 무한 스크롤 감지
  const { ref: triggerRef, inView: triggerInVeiw } = useInView({
    threshold: 0.1,
  })

  const { status, update } = useSession()

  // 마지막 페이지 계산
  const lastPage = Math.ceil(totalProducts / pageSize)

  //1. 세션확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  // 2. 초기 데이터 패치
  useEffect(() => {
    setSearchQuery('')
    fetchData(page, pageSize) // 초기 페이지는 항상 1
  }, [])

  useEffect(() => {
    if (triggerInVeiw && !loading && !isEmpty && page <= lastPage) {
      setPage((prevPage) => prevPage + 1)
      loadMoreData(page, pageSize)
    }
  }, [triggerInVeiw, loading, isEmpty])

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
    } else {
      //비회원 접근
      alert('비회원')
    }
  }

  useEffect(() => {
    if (filteredData.length > 0) {
      setTimeout(() => {
        // 이미지 로드 상태를 초기화
        setImageLoadedStates(new Array(filteredData.length).fill(false))
        setFiltering(true) // 이미지 로딩 시작 시 filtering 상태를 true로 설정
      }, 0)
    }
  }, [filteredData])

  // 각 이미지가 로드될 때 호출되는 함수
  const handleImageLoad = (index: number) => {
    setImageLoadedStates((prevStates) => {
      const newStates = [...prevStates]
      newStates[index] = true

      // 모든 이미지가 로드되었는지 확인
      const allImagesLoaded = newStates.every((loaded) => loaded)
      if (allImagesLoaded) {
        setFiltering(false) // 모든 이미지가 로드되었을 때 filtering을 false로 설정
      }

      return newStates
    })
  }

  //마크업
  return (
    <div className="relative z-10 mx-auto mt-4 box-border min-w-[460px] rounded-t-[2rem] bg-white pb-4 pt-4 drop-shadow-lg md:static md:z-0 md:mt-0 md:w-auto md:bg-transparent">
      {/* 카테고리 필터 */}
      <Category setCategoryFilter={setCategoryFilter} selectedCategory={selectedCategory} />

      <div className="text-2xl">{filtering ? '필터중' : '필터완'}</div>

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

              {/* 이미지 로드 전 또는 로드 실패 시 플레이스홀더 표시 */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  {!imageError ? (
                    <LoadingSpinner /> // 로딩 중일 때 스피너
                  ) : (
                    <p className="text-sm text-gray-500">Image not available</p> // 로드 실패 시 대체 텍스트
                  )}
                </div>
              )}

              {/* 제품 배경 이미지 */}
              <figure className={`absolute inset-0 transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={400}
                  height={600}
                  className="h-full w-full object-cover transition-all duration-300 group-hover:scale-110"
                  onLoad={() => {
                    setImageLoaded(true)
                    handleImageLoad(index)
                  }}
                  onError={() => {
                    setImageError(true)
                    setImageLoaded(true) // 이미지 에러 발생 시 플레이스홀더 해제
                    handleImageLoad(index) // 이미지 에러 발생 시에도 로드 처리
                  }}
                  priority={index === 0} // 첫 번째 이미지만 priority로 설정
                />
              </figure>

              {/* 그라데이션 배경 */}
              <div className="absolute inset-0 z-0 bg-gradient-to-t from-black/60 via-transparent to-black/50 transition-all duration-300"></div>
            </li>
          ))}

          {/* 로딩 중일 때 스켈레톤 컴포넌트 렌더링 */}
          {loading && Array.from({ length: 5 }).map((_, index) => <SkeletonProduct key={index} />)}
        </ul>
        {!(page === lastPage + 1) && (
          <div ref={triggerRef} className="flex h-48 w-full items-center justify-center">
            <LoadingSpinner />
          </div>
        )}
      </section>
    </div>
  )
}
