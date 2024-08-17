import { IoIosArrowBack } from 'react-icons/io'
import { IoIosArrowForward } from 'react-icons/io'

interface PagingBtnProps {
  direction: 'back' | 'forward'
  clickEvent: () => void
}

export const PagingBtn = ({ direction, clickEvent }: PagingBtnProps) => {
  return (
    <button onClick={clickEvent} className="h-12 w-12 rounded-[50%] bg-white/90 shadow-sm">
      {direction === 'back' && <IoIosArrowBack className="mx-auto text-xl" />}
      {direction === 'forward' && <IoIosArrowForward className="mx-auto text-xl" />}
    </button>
  )
}
