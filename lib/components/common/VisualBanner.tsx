'use client'

import { useRef, useState } from 'react'
import dotenv from 'dotenv'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import Image from 'next/image'
import clsx from 'clsx'

// CSS 파일 및 스타일 관련 임포트
import '@egjs/react-flicking/dist/flicking.css'

// 내부 모듈 및 컴포넌트 임포트
import { IndexPlayBtn } from './IndexPlayBtn'
import { PagingBtn } from './PagingBtn'
import { AutoPlay } from '@egjs/flicking-plugins'
import { LoadingSpinner } from './modules/LoadingSpinner'

// 동적 로딩을 위한 Flicking 임포트
import type { FlickingProps } from '@egjs/react-flicking'
const Flicking = dynamic(() => import('@egjs/react-flicking'), {
  ssr: false, // 서버사이드 렌더링 비활성화
})

// 환경변수 설정
dotenv.config()

export const VisualBanner = () => {
  const flickingRef = useRef<FlickingProps | null>(null)
  const autoPlayRef = useRef<AutoPlay | null>(null)
  const [isAnimating, setIsAnimating] = useState(false) // 애니메이션 상태 관리
  const [isAutoPlaying, setIsAutoPlaying] = useState(false) // 초기값을 false로 설정
  const [currentIndex, setCurrentIndex] = useState(0) // 현재 활성화된 패널 인덱스
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

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

  const panels = [
    {
      title: '스포츠/레저 클리어런스',
      description: '인기 요가복 최대 70% 할인! 한정수량 빠르게 겟하세요.',
      image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-1.webp`,
    },
    {
      title: '추석 맞이 가족 나들이 특가',
      description: '가족과 함께하는 황금연휴! 여행 패키지 반값 세일!',
      image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-2.webp`,
    },
    {
      title: '연휴 여행 준비 끝!',
      description: '추석 연휴, 놓치면 후회할 여행 특가상품 모음전!',
      image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-3.webp`,
    },
    {
      title: '추석 선물 대전',
      description: '가족, 친구, 소중한 이들을 위한 특별한 추석 선물 추천!',
      image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-4.webp`,
    },
  ]

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
        {panels.map((item, index) => (
          <div
            key={index}
            className="flicking-panel relative mx-2 box-border aspect-[9/14] h-auto w-2/3 max-w-[960px] overflow-hidden rounded-xl bg-gray-500 px-[15%] py-12 text-2xl text-white shadow-sm sm:px-[10%] md:aspect-[3/2] md:px-[10%] lg:px-[13%] xl:aspect-[120/41] xl:px-[200px]"
          >
            {/* 그라데이션 배경 추가 */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-transparent via-black/50 to-black/50"></div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={currentIndex === index ? 'visible' : 'hidden'}
              className="relative z-[1]"
            >
              <motion.h2 variants={itemVariants} className="block text-2xl font-bold drop-shadow-md md:text-3xl">
                {item.title}
              </motion.h2>
              <motion.p variants={itemVariants} className="mt-2 text-sm drop-shadow-md md:text-lg">
                {item.description}
              </motion.p>
            </motion.div>

            {/* 이미지 로드 전 또는 로드 실패 시 플레이스홀더 표시 */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-accent">
                {!imageError ? (
                  <LoadingSpinner /> // 로딩 중일 때 스피너
                ) : (
                  <p className="text-sm text-gray-500">Image not available</p> // 로드 실패 시 대체 텍스트
                )}
              </div>
            )}

            <motion.figure
              variants={imageVariants}
              initial="hidden"
              animate={currentIndex === index ? 'visible' : 'hidden'}
              className={clsx('absolute inset-0 transition-opacity duration-500', {
                'opacity-100': imageLoaded,
                'opacity-0': !imageLoaded,
              })}
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="100%"
                className="h-full w-full object-cover"
                priority={index === 0} // 첫 번째 이미지만 priority로 설정
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  setImageError(true)
                  setImageLoaded(true) // 이미지 에러 발생 시 플레이스홀더 해제
                }}
              />
            </motion.figure>
          </div>
        ))}
      </Flicking>
    </div>
  )
}
