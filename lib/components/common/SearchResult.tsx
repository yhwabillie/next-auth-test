'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useProductsStore } from '@/lib/stores/productsStore'
import { ProductType } from '@/app/actions/products/actions'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { calculateDiscountedPrice } from '@/lib/utils'
import clsx from 'clsx'
import { LuHeartOff } from 'react-icons/lu'
import { FaHeartCirclePlus } from 'react-icons/fa6'
import { TbShoppingBagMinus, TbShoppingBagPlus } from 'react-icons/tb'
import Image from 'next/image'

export const SearchResult = () => {
  const searchParams = useSearchParams()
  const { status, update } = useSession()
  const query = searchParams.get('query') || ''
  const { allData, setSearchQuery, toggleCartStatus, loadedImages, resetLoadedImages, setLoadedImages, toggleWishStatus, setSessionUpdate } =
    useProductsStore()

  const results = allData.filter(
    (product) => product.name.toLowerCase().includes(query.toLowerCase()) || product.category.toLowerCase().includes(query.toLowerCase()),
  )

  const handleImageLoad = (index: number) => {
    setLoadedImages({ [index]: true }) // Zustand의 상태 업데이트
  }

  //1. 세션확인
  useEffect(() => {
    if (status === 'authenticated') {
      setSessionUpdate(update)
    }
  }, [setSessionUpdate, status])

  useEffect(() => {
    setSearchQuery(query)

    resetLoadedImages()

    const initialLoadedImages: Record<number, boolean> = {}
    results.forEach((_, index) => {
      initialLoadedImages[index] = false
    })
    setLoadedImages(initialLoadedImages)
  }, [query, setSearchQuery])

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

  return (
    <section className="container mx-auto mt-10 min-w-[460px]">
      <header className="mx-8 box-border rounded-lg bg-white px-8 py-4 drop-shadow-md md:mx-4">
        <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-700">🔎 검색 결과</h2>
        <p className="text-lg tracking-tight text-gray-600">
          <span className="text-primary-dark mr-1 inline-block font-semibold text-blue-600">"{query}"</span>에 대한 검색 결과
        </p>
      </header>

      {results.length > 0 ? (
        <>
          {/* 상품 리스트 */}
          <div className="box-border px-8 lg:container md:mt-4 md:bg-transparent md:px-4 lg:mx-auto">
            <ul className="mb-20 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:gap-x-2 lg:grid-cols-4 xl:grid-cols-5">
              {results.map((product, index) => (
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
                  className="group rounded-xl bg-white p-3 transition-all md:translate-y-0 md:hover:translate-y-[-10px]"
                >
                  <figure className="mb-3 aspect-square w-full overflow-hidden rounded-xl border border-gray-300 shadow-md">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={400}
                      height={600}
                      priority={index === 0} // 첫 번째 이미지만 priority로 설정
                      onLoad={() => handleImageLoad(index)} // 이미지 로드 완료 시 true로 설정
                      className="object-cover transition-all duration-300 group-hover:scale-110"
                    />
                  </figure>

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
                      className="mr-2 inline-block rounded-md bg-secondary p-2 text-sm text-white shadow-md transition-all duration-300"
                    >
                      {product.isInWish ? <LuHeartOff className="text-2xl" /> : <FaHeartCirclePlus className="text-2xl drop-shadow-md" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleClickAddProduct(product)}
                      className={clsx('inline-block rounded-md p-2 text-sm text-white duration-300', {
                        'hover:bg-primary-tonDown bg-primary': !product.isInCart,
                        'bg-gray-600 hover:bg-gray-700': product.isInCart,
                      })}
                    >
                      {product.isInCart ? <TbShoppingBagMinus className="text-2xl" /> : <TbShoppingBagPlus className="text-2xl drop-shadow-md" />}
                    </button>
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="mt-4 box-border px-8 lg:container md:bg-transparent md:px-4 lg:mx-auto">검색 결과가 없습니다.</div>
      )}
    </section>
  )
}
