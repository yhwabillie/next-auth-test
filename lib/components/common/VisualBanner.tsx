'use client'
import { IndexPlayBtn } from './IndexPlayBtn'
import { PagingBtn } from './PagingBtn'
import { AutoPlay } from '@egjs/flicking-plugins'
import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Flicking from '@egjs/react-flicking'
import '@egjs/react-flicking/dist/flicking.css'

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
        staggerChildren: 0.1, // 자식 요소가 순차적으로 애니메이션됨
        ease: 'easeInOut',
        duration: 0.3, // 자연스러운 전환을 위한 속도
      },
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
    hidden: {
      filter: 'blur(3px)',
    },
    visible: {
      filter: 'blur(0px)',
    },
    transition: {
      type: 'tween',
      ease: 'easeInOut',
      duration: 0.5,
    },
  }

  const panels = [
    {
      title: '스포츠 / 레저 <br /> 클리어런스',
      description: '인기 요가복 최대 70% 할인! <br /> 한정수량 빠르게 겟하세요.',
      mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-1.webp`,
      tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-1.webp`,
      desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-1.webp`,
      banner_alt: '요가하는 사람의 모습 배너 이미지',
    },
    {
      title: '추석 맞이 <br/> 가족 나들이 특가',
      description: '가족과 함께하는 황금연휴! <br/> 여행 패키지 반값 세일!',
      mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-2.webp`,
      tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-2.webp`,
      desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-2.webp`,
      banner_alt: '관광지 바다 관경 배너 이미지',
    },
    {
      title: '연휴 여행 <br/> 준비 끝!',
      description: '추석 연휴, 놓치면 후회할 <br/> 여행 특가상품 모음전!',
      mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-3.webp`,
      tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-3.webp`,
      desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-3.webp`,
      banner_alt: '방울 토마토가 여러개 열려있는 모습 배너 이미지',
    },
    {
      title: '추석 선물 대전',
      description: '가족, 친구, 소중한 이들을 위한 <br/> 특별한 추석 선물 추천!',
      mobile_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-mobile-4.webp`,
      tablet_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-tablet-4.webp`,
      desktop_image: `${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}/banners/banner-4.webp`,
      banner_alt: '애플 스토어 로고 배너 이미지',
    },
  ]

  return (
    <div className="sticky top-0 mx-auto block w-full min-w-[calc(360px-20px)] max-w-full md:relative">
      {/* CSS 인라인화 */}
      <style jsx>{`
        .flicking-panel {
          position: relative;
          margin: 0 0.5rem;
          box-sizing: border-box;
          aspect-ratio: 9 / 14;
          height: auto;
          width: 66.666667%;
          max-width: 960px;
          overflow: hidden;
          background-color: #6b7280; /* bg-gray-500 */
          padding: 3rem 15%;
          font-size: 1.5rem;
          color: white;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          text-align: center;
        }

        @media (min-width: 360px) {
          .flicking-panel {
            padding-left: 10%;
            padding-right: 10%;
          }
        }

        @media (min-width: 768px) {
          .flicking-panel {
            aspect-ratio: 3 / 2;
            padding-left: 13%;
            padding-right: 13%;
          }
        }

        @media (min-width: 1024px) {
          .flicking-panel {
            padding-left: 13%;
            padding-right: 13%;
          }
        }

        @media (min-width: 1280px) {
          .flicking-panel {
            aspect-ratio: 120 / 41;
            padding-left: 200px;
            padding-right: 200px;
          }
        }
      `}</style>

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
        {panels.map((item, index) => {
          const isActive = currentIndex === index

          return (
            <div key={index} className="flicking-panel rounded-2xl">
              {/* 그라데이션 배경 추가 */}
              <div className="absolute inset-0 z-[1] bg-gradient-to-t from-transparent via-black/50 to-black/50"></div>

              <motion.div variants={containerVariants} initial="hidden" animate={isActive ? 'visible' : 'hidden'} className="relative z-[1]">
                <motion.h2
                  variants={itemVariants}
                  className="mb-2 block text-left font-bold drop-shadow-md sm:mb-5 sm:text-4xl sm:leading-[50px] md:mb-4"
                  dangerouslySetInnerHTML={{ __html: item.title }}
                />
                <motion.p
                  variants={itemVariants}
                  className="text-left text-[14px] drop-shadow-md sm:text-[18px] md:text-lg"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </motion.div>

              <picture>
                {/* <source media="(max-width: 767px)" srcSet={item.mobile_image} />
                <source media="(max-width: 1279px)" srcSet={item.tablet_image} />
                <source media="(min-width: 1280px)" srcSet={item.desktop_image} /> */}

                <motion.div variants={imageVariants} initial="hidden" animate={isActive ? 'visible' : 'hidden'} className="absolute inset-0">
                  <Image
                    src={item.desktop_image}
                    alt={item.banner_alt}
                    fill
                    sizes="(min-width: 320px) 100vw, (max-width: 767px) 501px, (max-width: 1279px) 843px, (min-width: 1280px) 960px"
                    className="object-cover"
                    priority={true}
                    loading={'eager'}
                    quality={75}
                    fetchPriority="high"
                  />
                </motion.div>
              </picture>
            </div>
          )
        })}
      </Flicking>
    </div>
  )
}
