'use client'
import { IndexPlayBtn } from './IndexPlayBtn'
import { PagingBtn } from './PagingBtn'
import Flicking, { MoveEndEvent } from '@egjs/react-flicking'
import { AutoPlay } from '@egjs/flicking-plugins'
import '@egjs/react-flicking/dist/flicking.css'
import { useRef, useState } from 'react'
import { delay, motion } from 'framer-motion'
import Image from 'next/image'
import clsx from 'clsx'

export const VisualBanner = () => {
  const flickingRef = useRef<Flicking | null>(null)
  const autoPlayRef = useRef<AutoPlay | null>(null)
  const [isAnimating, setIsAnimating] = useState(false) // 애니메이션 상태 관리
  const [isAutoPlaying, setIsAutoPlaying] = useState(false) // 초기값을 false로 설정
  const [currentIndex, setCurrentIndex] = useState(0) // 현재 활성화된 패널 인덱스

  const totalPanels = 4 // 전체 패널 갯수

  // AutoPlay 플러그인 설정
  autoPlayRef.current = new AutoPlay({ duration: 2000, direction: 'NEXT', stopOnHover: true })

  const handleToggleAutoPlay = () => {
    setIsAutoPlaying((prev) => !prev)
  }

  const handleMove = async (direction: 'next' | 'prev') => {
    const flicking = flickingRef.current
    if (flicking && !isAnimating) {
      setIsAnimating(true)

      try {
        if (direction === 'next') {
          await flicking.next()
        } else {
          await flicking.prev()
        }
      } finally {
        setIsAnimating(false)
      }
    }
  }

  // 부모 컨테이너 애니메이션 설정 (stagger 사용)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // 자식 요소가 순차적으로 애니메이션됨
        ease: 'easeInOut',
        duration: 0.8, // 자연스러운 전환을 위한 속도
      },
      delay: 1,
    },
  }

  // 자식 요소 애니메이션 설정 (좌에서 우로 애니메이션)
  const itemVariants = {
    hidden: { opacity: 0, x: -100 }, // 좌측에서 시작
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 60, // 애니메이션 탄성 조정
        damping: 15, // 애니메이션 덜컹거림 완화
      },
    },
  }

  const imageVariants = {
    hidden: { scale: 1, transformOrigin: 'center center', filter: 'blur(3px)' },
    visible: {
      scale: 1.2,
      transformOrigin: 'center center',
      filter: 'blur(0px)',
      transition: {
        type: 'tween',
        ease: 'easeInOut',
        duration: 1,
      },
    },
  }

  return (
    <div className="sticky top-0 mx-auto block w-full min-w-[460px] max-w-full md:relative">
      <div className="absolute left-[50%] top-[50%] z-10 ml-[-30%] mt-[-20px] h-12 origin-left lg:ml-[-320px] xl:ml-[-400px]">
        <PagingBtn direction="back" clickEvent={() => handleMove('prev')} />
      </div>
      <div className="absolute right-[50%] top-[50%] z-10 mr-[-30%] mt-[-20px] h-12 origin-right lg:mr-[-320px] xl:mr-[-400px]">
        <PagingBtn direction="forward" clickEvent={() => handleMove('next')} />
      </div>

      <div className="absolute bottom-5 right-[50%] z-10 mr-[-30%] lg:mr-[-304px]">
        <IndexPlayBtn currentIndex={currentIndex} totalPanels={totalPanels} playStatus={isAutoPlaying} clickEvent={handleToggleAutoPlay} />
      </div>

      <Flicking
        ref={flickingRef}
        circular={true}
        duration={500}
        gap={0} // 패널 간의 간격 설정
        align="center"
        renderOnlyVisible={true}
        plugins={isAutoPlaying ? [autoPlayRef.current!] : []} // 조건부로 AutoPlay 플러그인 적용
        inputType={[]} // 드래그 비활성화
        className="w-full"
        onMoveStart={(e) => {
          if (e.direction === 'NEXT') {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % totalPanels) // 다음 패널로 이동 후 인덱스 업데이트
          } else {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + totalPanels) % totalPanels) // 이전 패널로 이동 후 인덱스 업데이트
          }
        }}
      >
        {/* 슬라이더의 패널 */}
        <div className="flicking-panel relative mx-2 box-border aspect-[9/14] h-auto w-2/3 max-w-[960px] overflow-hidden rounded-xl bg-gray-500 px-[15%] py-12 text-2xl text-white shadow-sm sm:px-[10%] md:aspect-[3/2] md:px-[10%] lg:px-[13%] xl:aspect-[120/41] xl:px-[200px]">
          {/* 그라데이션 배경 추가 */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-transparent via-black/50 to-black/50"></div>

          <motion.div variants={containerVariants} initial="hidden" animate={currentIndex === 0 ? 'visible' : 'hidden'} className="relative z-[1]">
            <motion.h2 variants={itemVariants} className="block text-2xl font-bold drop-shadow-md md:text-3xl">
              스포츠/레저 클리어런스
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-2 text-sm drop-shadow-md md:text-lg">
              요가 및 필라테스복 베스트 브랜드 SALE
            </motion.p>
          </motion.div>

          <motion.div variants={imageVariants} initial="hidden" animate={currentIndex === 0 ? 'visible' : 'hidden'} className="absolute inset-0">
            <Image
              src="https://fluplmlpoyjvgxkldyfh.supabase.co/storage/v1/object/public/next-auth-test/banners/banner-1.webp"
              alt="banner-1"
              fill
              sizes="100%"
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>
        </div>
        <div className="flicking-panel relative mx-2 box-border aspect-[9/14] h-auto w-2/3 max-w-[960px] overflow-hidden rounded-xl bg-gray-500 px-[15%] py-12 text-2xl text-white shadow-sm sm:px-[10%] md:aspect-[3/2] md:px-[10%] lg:px-[13%] xl:aspect-[120/41] xl:px-[200px]">
          {/* 그라데이션 배경 추가 */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t  from-transparent via-black/50 to-black/50"></div>

          <motion.div variants={containerVariants} initial="hidden" animate={currentIndex === 1 ? 'visible' : 'hidden'} className="relative z-[1]">
            <motion.h2 variants={itemVariants} className="block text-2xl font-bold drop-shadow-md md:text-3xl">
              추석황금연휴
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-2 text-sm drop-shadow-md md:text-lg">
              가족 나들이/여행 ~ 50% SALE
            </motion.p>
          </motion.div>

          <motion.div variants={imageVariants} initial="hidden" animate={currentIndex === 1 ? 'visible' : 'hidden'} className="absolute inset-0">
            <Image
              src="https://fluplmlpoyjvgxkldyfh.supabase.co/storage/v1/object/public/next-auth-test/banners/banner-2.webp"
              alt="banner-2"
              fill
              sizes="100%"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
        <div className="flicking-panel relative mx-2 box-border aspect-[9/14] h-auto w-2/3 max-w-[960px] overflow-hidden rounded-xl bg-gray-500 px-[15%] py-12 text-2xl text-white shadow-sm sm:px-[10%] md:aspect-[3/2] md:px-[10%] lg:px-[13%] xl:aspect-[120/41] xl:px-[200px]">
          {/* 그라데이션 배경 추가 */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-transparent via-black/50 to-black/50"></div>

          <motion.div variants={containerVariants} initial="hidden" animate={currentIndex === 2 ? 'visible' : 'hidden'} className="relative z-[1]">
            <motion.h2 variants={itemVariants} className="block text-2xl font-bold drop-shadow-md md:text-3xl">
              추석황금연휴
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-2 text-sm drop-shadow-md md:text-lg">
              가족 나들이/여행 ~ 50% SALE
            </motion.p>
          </motion.div>

          <motion.div variants={imageVariants} initial="hidden" animate={currentIndex === 2 ? 'visible' : 'hidden'} className="absolute inset-0">
            <Image
              src="https://fluplmlpoyjvgxkldyfh.supabase.co/storage/v1/object/public/next-auth-test/banners/banner-3.webp"
              alt="banner-2"
              fill
              sizes="100%"
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
        <div className="flicking-panel relative mx-2 box-border aspect-[9/14] h-auto w-2/3 max-w-[960px] overflow-hidden rounded-xl bg-gray-500 px-[15%] py-12 text-2xl text-white shadow-sm sm:px-[10%] md:aspect-[3/2] md:px-[10%] lg:px-[13%] xl:aspect-[120/41] xl:px-[200px]">
          {/* 그라데이션 배경 추가 */}
          <div className="absolute inset-0 z-[1] bg-gradient-to-t from-transparent via-black/50 to-black/50"></div>

          <motion.div variants={containerVariants} initial="hidden" animate={currentIndex === 3 ? 'visible' : 'hidden'} className="relative z-[1]">
            <motion.h2 variants={itemVariants} className="block text-2xl font-bold drop-shadow-md md:text-3xl">
              추석황금연휴
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-2 text-sm drop-shadow-md md:text-lg">
              가족 나들이/여행 ~ 50% SALE
            </motion.p>
          </motion.div>

          <motion.div variants={imageVariants} initial="hidden" animate={currentIndex === 3 ? 'visible' : 'hidden'} className="absolute inset-0">
            <Image
              src="https://fluplmlpoyjvgxkldyfh.supabase.co/storage/v1/object/public/next-auth-test/banners/banner-4.webp"
              alt="banner-2"
              fill
              sizes="100%"
              className="h-full w-full object-cover"
              priority
            />
          </motion.div>
        </div>
      </Flicking>
    </div>
  )
}
