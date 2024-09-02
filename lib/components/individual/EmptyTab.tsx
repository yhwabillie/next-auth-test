'use client'
import Link from 'next/link'

interface EmptyTabProps {
  sub_title: string
  title: string
  label?: string
  type?: 'btn' | 'link'
  clickEvent?: () => void
}

export const EmptyTab = ({ sub_title, title, label, type, clickEvent }: EmptyTabProps) => {
  return (
    <div className="rounded-md bg-gray-100 p-10">
      <p className="mb-4 text-center text-gray-500 md:mb-10">
        <span className="mb-1 block text-sm tracking-tighter md:mb-2 md:text-[16px]">{sub_title}</span>
        <strong className="block text-[16px] tracking-tighter md:text-2xl">{title}</strong>
      </p>

      {type === 'btn' && (
        <button
          type="button"
          className="mx-auto block w-fit rounded-lg bg-blue-400 px-10 py-4 text-sm font-semibold tracking-tighter text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500 md:w-[300px] md:text-[16px]"
          onClick={clickEvent}
        >
          {label}
        </button>
      )}
      {type === 'link' && (
        <Link
          href="/"
          className="mx-auto block w-fit rounded-lg bg-blue-400 px-10 py-4 text-center text-sm font-semibold tracking-tighter text-white drop-shadow-md transition-all duration-150 ease-in-out hover:bg-blue-500 md:w-[300px] md:text-[16px]"
        >
          {label}
        </Link>
      )}
    </div>
  )
}
