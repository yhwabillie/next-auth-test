'use client'
import { BtnLoadingSpinner } from '@/lib/components/common/modules/BtnLoadingSpinner'

interface IButtonProps {
  label: string
  disalbe?: boolean
  clickEvent?: () => void
  type?: 'button' | 'submit'
  spinner?: boolean
}

export const Button = ({ label, disalbe, clickEvent, type, spinner }: IButtonProps) => {
  return (
    <button
      type={type}
      onClick={clickEvent}
      disabled={disalbe === undefined || disalbe == false ? false : true}
      className="leading-1 h-[50px] w-full min-w-full cursor-pointer rounded-md bg-blue-400 py-3 text-sm text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400 md:text-[16px]"
    >
      {spinner ? <BtnLoadingSpinner /> : `${label}`}
    </button>
  )
}
