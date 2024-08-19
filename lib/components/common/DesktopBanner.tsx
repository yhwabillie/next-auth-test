'use client'
import { IndexPlayBtn } from './IndexPlayBtn'
import { PagingBtn } from './PagingBtn'
import Flicking, { FlickingEvents, MoveEndEvent } from '@egjs/react-flicking'
import { AutoPlay } from '@egjs/flicking-plugins'
import '@egjs/react-flicking/dist/flicking.css'
import { useRef, useState } from 'react'

export const DesktopBanner = () => {
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

  return (
    <div className="relative mx-auto my-4 block w-full min-w-[460px] max-w-full">
      <div className="absolute left-[50%] top-[50%] z-10 ml-[-30%] mt-[-20px] h-12 origin-left lg:ml-[-300px] xl:ml-[-400px]">
        <PagingBtn direction="back" clickEvent={() => handleMove('prev')} />
      </div>
      <div className="absolute right-[50%] top-[50%] z-10 mr-[-30%] mt-[-20px] h-12 origin-right lg:mr-[-300px] xl:mr-[-400px]">
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
        }} // 이동 후 현재 인덱스 업데이트
      >
        {/* 슬라이더의 패널 */}
        <div className="flicking-panel mx-2 flex aspect-[3/2] h-auto w-2/3 max-w-[960px] items-center justify-center rounded-xl bg-gray-500 text-2xl text-white shadow-sm lg:aspect-[120/41]">
          Panel 1
        </div>
        <div className="flicking-panel mx-2 flex aspect-[3/2] h-auto w-2/3 max-w-[960px] items-center justify-center rounded-xl bg-gray-500 text-2xl text-white shadow-sm lg:aspect-[120/41]">
          Panel 2
        </div>
        <div className="flicking-panel mx-2 flex aspect-[3/2] h-auto w-2/3 max-w-[960px] items-center justify-center rounded-xl bg-gray-500 text-2xl text-white shadow-sm lg:aspect-[120/41]">
          Panel 3
        </div>
        <div className="flicking-panel mx-2 flex aspect-[3/2] h-auto w-2/3 max-w-[960px] items-center justify-center rounded-xl bg-gray-500 text-2xl text-white shadow-sm lg:aspect-[120/41]">
          Panel 4
        </div>
      </Flicking>
    </div>
  )
}
