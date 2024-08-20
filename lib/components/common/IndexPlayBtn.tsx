import { FaPause } from 'react-icons/fa'
import { RxSlash } from 'react-icons/rx'
import { FaPlay } from 'react-icons/fa'

interface IndexPlayBtnProps {
  playStatus: boolean
  clickEvent: () => void
  currentIndex: number
  totalPanels: number
}

export const IndexPlayBtn = ({ playStatus, clickEvent, currentIndex, totalPanels }: IndexPlayBtnProps) => {
  return (
    <div className="flex w-fit items-center drop-shadow-lg">
      <button
        aria-label={`${playStatus} carousel autoplay button`}
        onClick={clickEvent}
        className="box-border flex h-[32px] items-center justify-center rounded-l-[16px] bg-black/30 pl-3 pr-2 text-white"
      >
        {playStatus ? <FaPause className="text-xs" /> : <FaPlay className="text-xs" />}
      </button>
      <span className="ml-[1px] flex h-[32px] items-center rounded-r-[16px] bg-black/30 pl-2 pr-3 text-white">
        <span className="font-semibold">{currentIndex + 1}</span>
        <RxSlash className="text-lg" />
        <span className="font-semibold">{totalPanels}</span>
      </span>
    </div>
  )
}
