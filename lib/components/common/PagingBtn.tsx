import { IoIosArrowBack } from 'react-icons/io'
import { IoIosArrowForward } from 'react-icons/io'

interface PagingBtnProps {
  direction: 'back' | 'forward'
  clickEvent: () => void
}

export const PagingBtn = ({ direction, clickEvent }: PagingBtnProps) => {
  return (
    <button
      aria-label={`swiper banner ${direction} button`}
      onClick={clickEvent}
      className="h-10 w-10 rounded-[50%] bg-white/90 shadow-sm sm:h-12 sm:w-12"
    >
      {direction === 'back' && <IoIosArrowBack className="mx-auto text-xl" />}
      {direction === 'forward' && <IoIosArrowForward className="mx-auto text-xl" />}
    </button>
  )
}
