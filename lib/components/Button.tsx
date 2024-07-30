'use client'
interface IButtonProps {
  label: string
  disalbe?: boolean
  clickEvent?: () => void
  type?: 'button' | 'submit'
}

export const Button = ({ label, disalbe, clickEvent, type }: IButtonProps) => {
  return (
    <button
      type={type}
      onClick={clickEvent}
      disabled={disalbe === undefined || disalbe == false ? false : true}
      className="leading-1 h-[50px] w-full min-w-full cursor-pointer rounded-md bg-blue-400 py-3 text-white shadow-lg transition-all duration-150 ease-in-out hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {label}
    </button>
  )
}
