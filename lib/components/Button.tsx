'use client'
interface IButtonProps {
  label: string
  disalbe?: boolean
}

export const Button = ({ label, disalbe }: IButtonProps) => {
  return (
    <button
      disabled={disalbe === undefined || disalbe == false ? false : true}
      className="leading-1 h-[50px] w-full cursor-pointer rounded-md bg-blue-400 py-3 text-white shadow-lg hover:bg-blue-500 disabled:bg-gray-400 disabled:hover:bg-gray-500"
    >
      {label}
    </button>
  )
}
