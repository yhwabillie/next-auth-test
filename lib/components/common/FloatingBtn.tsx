'use client'
import { useFloatingBtnStore } from '@/lib/zustandStore'
import clsx from 'clsx'
import { PiArrowLineUpBold } from 'react-icons/pi'

export const FloatingBtn = () => {
  const { state } = useFloatingBtnStore()

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // 부드러운 스크롤을 위해 설정
    })
  }

  return (
    <button
      onClick={scrollToTop}
      className={clsx(
        'fixed bottom-4 right-4 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg transition-opacity duration-300',
        {
          'opacity-100': state,
          'opacity-0': !state,
        },
      )}
    >
      <PiArrowLineUpBold className="text-2xl text-white" />
    </button>
  )
}
